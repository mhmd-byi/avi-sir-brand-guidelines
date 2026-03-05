import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import BrandSettings from "@/models/BrandSettings";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { primaryColor, secondaryColor } = await req.json();

    if (!primaryColor || !secondaryColor) {
      return NextResponse.json(
        { message: "Both primary and secondary colors are required." },
        { status: 400 }
      );
    }

    // Simple hex color validation
    const hexRegex = /^#([0-9A-Fa-f]{6})$/;
    if (!hexRegex.test(primaryColor) || !hexRegex.test(secondaryColor)) {
      return NextResponse.json(
        { message: "Colors must be valid hex values (e.g. #3b82f6)." },
        { status: 400 }
      );
    }

    await connectDB();

    // Upsert the singleton brand settings document
    await BrandSettings.findOneAndUpdate(
      {},
      { primaryColor, secondaryColor },
      { upsert: true, new: true }
    );

    // Mark the user as setup complete
    await User.findByIdAndUpdate(session.user.id, { isSetupComplete: true });

    return NextResponse.json(
      { message: "Brand settings saved successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SETUP ERROR]", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
