import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import BrandSettings from "@/models/BrandSettings";
import { put, del } from "@vercel/blob";

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

    await connectDB();
    
    // Check for previous logo to delete it
    const existingSettings = await BrandSettings.findOne({});
    if (existingSettings && (existingSettings as any)[logoType]) {
      try {
        const oldUrl = (existingSettings as any)[logoType];
        // Only attempt delete if it's a blob URL
        if (oldUrl.includes("blob.vercel-storage.com")) {
          await del(oldUrl);
        }
      } catch (delError) {
        console.error("[LOGO DELETE ERROR] Failed to delete old blob:", delError);
        // We continue anyway so the new upload isn't blocked by a failed delete
      }
    }

    // Upload to Vercel Blob
    const filename = `${logoType}-${Date.now()}-${file.name}`;
    const blob = await put(filename, file, {
      access: 'public',
    });

    // Update the corresponding field in the singleton BrandSettings doc with the Blob URL
    await BrandSettings.findOneAndUpdate(
      {},
      { [logoType]: blob.url },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { message: "Logo uploaded successfully.", publicPath: blob.url },
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
