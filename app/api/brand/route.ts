import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import BrandSettings from "@/models/BrandSettings";

export async function GET() {
  try {
    await connectDB();

    const settings = await BrandSettings.findOne({}).lean<{
      primaryColor: string;
      secondaryColor: string;
      stackedLogo?: string;
      landscapeLogo?: string;
      stackedLogoBlack?: string;
      landscapeLogoBlack?: string;
      stackedLogoWhite?: string;
      landscapeLogoWhite?: string;
    }>();

    return NextResponse.json({
      primaryColor:   settings?.primaryColor   ?? "#1d6497",
      secondaryColor: settings?.secondaryColor ?? "#f59e0b",
      stackedLogo:    settings?.stackedLogo,
      landscapeLogo:  settings?.landscapeLogo,
      stackedLogoBlack:    settings?.stackedLogoBlack,
      landscapeLogoBlack:  settings?.landscapeLogoBlack,
      stackedLogoWhite:    settings?.stackedLogoWhite,
      landscapeLogoWhite:  settings?.landscapeLogoWhite,
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
