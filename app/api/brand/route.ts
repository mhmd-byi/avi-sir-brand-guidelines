import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import BrandSettings from "@/models/BrandSettings";
import fs from "fs/promises";
import path from "path";

async function getLogoPath(subFolder: string, baseName: string) {
  const possibleExts = [".png", ".svg", ".jpg", ".jpeg", ".webp"];
  const dirPath = path.join(process.cwd(), "public", "assets", "logos", subFolder);
  
  try {
    const files = await fs.readdir(dirPath);
    const foundFile = files.find(f => {
      const ext = path.extname(f).toLowerCase();
      return f.toLowerCase().startsWith(baseName.toLowerCase()) && possibleExts.includes(ext);
    });
    
    if (foundFile) {
      return `/assets/logos/${subFolder}/${foundFile}`;
    }
  } catch (err) {
    // Directory might not exist yet
  }
  return null;
}

export async function GET() {
  try {
    await connectDB();

    const settings = await BrandSettings.findOne({}).lean<{
      primaryColor: string;
      secondaryColor: string;
    }>();

    // Map logo fields directly from disk to ensure sync
    const stackedLogo         = await getLogoPath("stacked", "stackedLogo");
    const stackedLogoBlack    = await getLogoPath("stacked", "stackedLogoBlack");
    const stackedLogoWhite    = await getLogoPath("stacked", "stackedLogoWhite");
    const landscapeLogo       = await getLogoPath("landscape", "landscapeLogo");
    const landscapeLogoBlack  = await getLogoPath("landscape", "landscapeLogoBlack");
    const landscapeLogoWhite  = await getLogoPath("landscape", "landscapeLogoWhite");

    return NextResponse.json({
      primaryColor:   settings?.primaryColor   ?? "#1d6497",
      secondaryColor: settings?.secondaryColor ?? "#f59e0b",
      stackedLogo,
      stackedLogoBlack,
      stackedLogoWhite,
      landscapeLogo,
      landscapeLogoBlack,
      landscapeLogoWhite,
      configured: !!settings,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error) {
    console.error("[BRAND ERROR]", error);
    return NextResponse.json(
      { primaryColor: "#1d6497", secondaryColor: "#f59e0b", configured: false },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    );
  }
}
