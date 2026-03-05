"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BrandColors {
  primaryColor: string;
  secondaryColor: string;
  configured: boolean;
}

const SECTIONS = [
  {
    title: "About us",
    href: "/about",
    description:
      "An introduction to our brand identity and how we represent ourselves consistently across every touchpoint.",
  },
  {
    title: "Logo",
    href: "/logo",
    description:
      "Download our official logos, understand the different variations, placements and rules for use.",
  },
  {
    title: "Typography",
    href: "#",
    description:
      "Our fonts, application guidelines and guidance on accessible text formatting.",
  },
  {
    title: "Colours",
    href: "#",
    description:
      "Our brand colour palettes, swatch libraries and guidance on accessible colour use.",
  },
  {
    title: "Pattern",
    href: "#",
    description:
      "Our patterns and examples of how we apply them across different communication types.",
  },
  {
    title: "Iconography",
    href: "#",
    description:
      "Our icon set, how to use icons and a guide to designing new icons.",
  },
  {
    title: "Illustration",
    href: "#",
    description:
      "Our illustration examples, how to create illustrations and how to apply them.",
  },
  {
    title: "Photography",
    href: "#",
    description:
      "Our photography style, how to choose an appropriate image and licensing.",
  },
  {
    title: "Videography",
    href: "#",
    description: "How to record and edit videos for use on our channels.",
  },
  {
    title: "Application",
    href: "#",
    description:
      "How to apply consistent branding across different types of communications.",
  },
];

export default function HomePage() {
  const [colors, setColors] = useState<BrandColors>({
    primaryColor: "#1d6497",
    secondaryColor: "#f59e0b",
    configured: false,
  });

  useEffect(() => {
    fetch("/api/brand")
      .then((r) => r.json())
      .then((data) => setColors(data))
      .catch(() => {});
  }, []);

  // Hero background: primary color at ~12% opacity
  const heroBg = `${colors.primaryColor}1f`;

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero banner */}
      <div style={{ backgroundColor: heroBg }}>
        <div className="max-w-6xl mx-auto px-8 md:px-16 py-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.primaryColor }}>
            Brand guidelines
          </h1>
          <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
            Learn about our brand identity and how we apply it consistently to
            build trust and recognition. Explore our core visual elements,
            design guidance and downloadable assets.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Sections grid */}
      <div className="max-w-6xl mx-auto px-8 md:px-16 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <Link
                href={section.href}
                className="text-base font-semibold underline-offset-2 hover:underline"
                style={{ color: colors.primaryColor }}
              >
                {section.title}
              </Link>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {section.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
