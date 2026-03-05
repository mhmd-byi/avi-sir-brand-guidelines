import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import BrandSettings from "@/models/BrandSettings";

export async function GET() {
  try {
    await connectDB();

    const settings = await BrandSettings.findOne({}).lean<{
      primaryColor: string;
      secondaryColor: string;
    }>();

    return NextResponse.json({
      primaryColor:   settings?.primaryColor   ?? "#6366f1",
      secondaryColor: settings?.secondaryColor ?? "#f59e0b",
      configured: !!settings,
    });
  } catch (error) {
    console.error("[BRAND ERROR]", error);
    return NextResponse.json(
      { primaryColor: "#6366f1", secondaryColor: "#f59e0b", configured: false },
    );
  }
}
