"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MoveUpRight } from "lucide-react";

export default function LogoPage() {
  const [brand, setBrand] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/brand?t=${Date.now()}`)
      .then((res) => res.json())
      .then(setBrand)
      .catch(console.error);
  }, []);

  const contents = [
    { label: "Overview", href: "#overview" },
    { label: "Stacked logo", href: "#stacked-logo" },
    { label: "Landscape logo", href: "#landscape-logo" },
    { label: "Logo colours", href: "#logo-colours" },
    { label: "Using the logo", href: "#using-the-logo" },
    { label: "Size guides", href: "#size-guides" },
    { label: "Incorrect usage", href: "#incorrect-usage" },
    { label: "Downloads", href: "#downloads" },
  ];

  if (!brand) return <div className="p-16 text-center text-sm text-gray-500">Loading guidelines...</div>;

  return (
    <div className="max-w-6xl mx-auto px-8 md:px-16 py-8">
      <div className="flex gap-16">
        
        {/* ── Sidebar ───────────────────────────────────────── */}
        <aside className="w-48 shrink-0 hidden lg:block sticky top-8 h-fit">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
            Contents
          </h2>
          <nav className="flex flex-col gap-2">
            {contents.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm border-l-2 border-transparent pl-3 py-1 hover:border-gray-300 hover:text-gray-900 transition-colors"
                style={{ color: "var(--brand-primary)" }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* ── Main Content ──────────────────────────────────── */}
        <main className="flex-1 max-w-3xl space-y-20 pb-20">
          
          {/* Header */}
          <section id="top">
            <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--brand-primary)" }}>
              Logo
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our logo consists of our name and symbol and is one of the main tools for identifying our brand.
            </p>
          </section>

          {/* Overview */}
          <section id="overview" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              Consisting of our name and symbol, the logo must be used exactly as provided. Download our official logos for all communications.
            </p>
          </section>

          {/* Stacked Logo */}
          <section id="stacked-logo" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Stacked logo</h2>
            <p className="text-gray-700 leading-relaxed">
              We use the stacked logo wherever possible on our print and digital communications.
            </p>
            <div className="bg-gray-50/50 border rounded-lg p-16 flex justify-center min-h-[280px] relative items-center">
              {brand.stackedLogo ? (
                <div className="relative w-full h-40">
                  <Image src={`${brand.stackedLogo}?t=${Date.now()}`} alt="Stacked Logo" fill className="object-contain" unoptimized={true} />
                </div>
              ) : (
                <div className="text-sm text-gray-400 font-medium italic">No logo uploaded yet. Visit dashboard to upload.</div>
              )}
            </div>
          </section>

          {/* Landscape Logo */}
          <section id="landscape-logo" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Landscape logo</h2>
            <p className="text-gray-700 leading-relaxed">
              Includes our name in a single line. Mainly for digital use, social media, or when vertical space is restricted.
            </p>
            <div className="bg-gray-50/50 border rounded-lg p-16 flex justify-center min-h-[180px] relative items-center">
              {brand.landscapeLogo ? (
                <div className="relative w-full h-24">
                  <Image src={`${brand.landscapeLogo}?t=${Date.now()}`} alt="Landscape Logo" fill className="object-contain" unoptimized={true} />
                </div>
              ) : (
                <div className="text-sm text-gray-400 font-medium italic">No logo uploaded yet. Visit dashboard to upload.</div>
              )}
            </div>
          </section>

          {/* Logo Colours */}
          <section id="logo-colours" className="space-y-10">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Logo colours</h2>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Black or white</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Single colour black or white logo is for use when the full colour version is not appropriate, or on dark backgrounds.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Black Variation */}
                <div className="space-y-3">
                  <div className="bg-gray-50 border rounded-lg h-32 relative flex items-center justify-center p-6">
                    {brand.stackedLogoBlack ? (
                       <Image src={`${brand.stackedLogoBlack}?t=${Date.now()}`} alt="Black Logo" fill className="object-contain p-6" unoptimized={true} />
                    ) : <span className="text-xs text-gray-400 italic">No black logo</span>}
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Black logo</p>
                </div>

                {/* White Variation */}
                <div className="space-y-3">
                  <div className="bg-slate-900 border border-white/10 rounded-lg h-32 relative flex items-center justify-center p-6 text-white/20">
                    {brand.stackedLogoWhite ? (
                       <Image src={`${brand.stackedLogoWhite}?t=${Date.now()}`} alt="White Logo" fill className="object-contain p-6" unoptimized={true} />
                    ) : <span className="text-xs italic">No white logo</span>}
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">White logo (on dark bg)</p>
                </div>
              </div>
            </div>
          </section>

          {/* Downloads Block (Mockup style but pointing to actual files if they exist) */}
          <section id="downloads" className="space-y-6 pt-10">
            <div className="bg-slate-900 text-white rounded-xl p-8 md:p-12">
              <h2 className="text-2xl font-bold mb-4">Downloads</h2>
              <p className="text-white/70 mb-8 max-w-xl">
                Official high-resolution logo files for all print and digital needs. Always use vector formats (.svg) for best quality.
              </p>
              
              <div className="flex flex-wrap gap-4">
                {brand.stackedLogo && (
                  <a 
                    href={brand.stackedLogo} 
                    download 
                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-md font-bold text-sm hover:bg-gray-200 transition-colors"
                  >
                    Download Stacked Logo <MoveUpRight size={14} />
                  </a>
                )}
                {brand.landscapeLogo && (
                  <a 
                    href={brand.landscapeLogo}
                    download
                    className="inline-flex items-center gap-2 bg-transparent border border-white/30 text-white px-6 py-3 rounded-md font-bold text-sm hover:border-white transition-colors"
                  >
                    Download Landscape Logo <MoveUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
