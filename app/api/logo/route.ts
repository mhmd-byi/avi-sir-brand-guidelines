import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import BrandSettings from "@/models/BrandSettings";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const formData = await req.formData();
    const logoType = formData.get("logoType") as string;
    const file = formData.get("file") as File;

    if (!logoType || !file) {
      return NextResponse.json(
        { message: "logoType and file are required." },
        { status: 400 }
      );
    }

    // Valid logo types matching the BrandSettings fields
    const validLogoTypes = [
      "stackedLogo",
      "landscapeLogo",
      "stackedLogoBlack",
      "landscapeLogoBlack",
      "stackedLogoWhite",
      "landscapeLogoWhite",
    ];

    if (!validLogoTypes.includes(logoType)) {
      return NextResponse.json(
        { message: "Invalid logoType." },
        { status: 400 }
      );
    }

    // Folder structure: public/assets/logos/{stacked|landscape}/
    const subFolder = logoType.startsWith("stacked") ? "stacked" : "landscape";
    const uploadDir = path.join(process.cwd(), "public", "assets", "logos", subFolder);

    // Create dir if not exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Sanitize filename or give it a standard name
    // e.g., stackedLogo_fullcolor.png
    const ext = path.extname(file.name) || ".png";
    const fileName = `${logoType}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // The public path stored in DB
    const publicPath = `/assets/logos/${subFolder}/${fileName}`;

    await connectDB();

    // Update the corresponding field in the singleton BrandSettings doc
    await BrandSettings.findOneAndUpdate(
      {},
      { [logoType]: publicPath },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { message: "Logo uploaded successfully.", publicPath },
      { status: 200 }
    );
  } catch (error) {
    console.error("[LOGO UPLOAD ERROR]", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
