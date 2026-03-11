import { connectDB } from "@/lib/db";
import BrandSettings from "@/models/BrandSettings";

async function getBrandColors() {
  try {
    await connectDB();
    const settings = await BrandSettings.findOne({}).lean<{
      primaryColor: string;
      secondaryColor: string;
    }>();
    return {
      primaryColor: settings?.primaryColor ?? "#1d6497",
      secondaryColor: settings?.secondaryColor ?? "#f59e0b",
    };
  } catch {
    return { primaryColor: "#1d6497", secondaryColor: "#f59e0b" };
  }
}

// Helper: convert hex to RGB tuple
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

// Helper: mix hex color with white at given opacity (0-1)
function tint(hex: string, opacity: number): string {
  const [r, g, b] = hexToRgb(hex);
  const tr = Math.round(r + (255 - r) * (1 - opacity));
  const tg = Math.round(g + (255 - g) * (1 - opacity));
  const tb = Math.round(b + (255 - b) * (1 - opacity));
  return `#${tr.toString(16).padStart(2, "0")}${tg.toString(16).padStart(2, "0")}${tb.toString(16).padStart(2, "0")}`;
}

// Helper: check if text should be dark or light based on background
function needsDarkText(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  // Luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55;
}

interface ColorSwatchProps {
  hex: string;
  label: string;
  sublabel?: string;
}

function ColorSwatch({ hex, label, sublabel }: ColorSwatchProps) {
  const dark = needsDarkText(hex);
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <div
        className="h-20 flex flex-col justify-end p-3"
        style={{ backgroundColor: hex }}
      >
        <p className={`text-xs font-bold ${dark ? "text-gray-900" : "text-white"}`}>
          {label}
        </p>
        {sublabel && (
          <p className={`text-[10px] font-mono ${dark ? "text-gray-700" : "text-white/80"}`}>
            {sublabel}
          </p>
        )}
      </div>
      <div className="bg-white px-3 py-2">
        <p className="text-xs font-mono text-gray-500 uppercase">{hex}</p>
      </div>
    </div>
  );
}

export default async function ColoursPage() {
  const { primaryColor, secondaryColor } = await getBrandColors();

  const primary70 = tint(primaryColor, 0.7);
  const primary40 = tint(primaryColor, 0.4);
  const primary10 = tint(primaryColor, 0.1);

  const secondary70 = tint(secondaryColor, 0.7);
  const secondary40 = tint(secondaryColor, 0.4);
  const secondary10 = tint(secondaryColor, 0.1);

  const contents = [
    { label: "Overview", href: "#overview" },
    { label: "Brand palette", href: "#brand-palette" },
    { label: "Tints", href: "#tints" },
    { label: "Accessible contrast", href: "#accessible-contrast" },
    { label: "Usage guidance", href: "#usage-guidance" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-8 md:px-16 py-8">
      <div className="flex gap-16">

        {/* ── Left Sidebar ────────────────────────────────── */}
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

        {/* ── Main Content ─────────────────────────────────── */}
        <main className="flex-1 max-w-3xl space-y-20 pb-20">

          {/* Title */}
          <section id="top">
            <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--brand-primary)" }}>
              Colours
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our brand colour palettes, swatch libraries and guidance on accessible colour use.
            </p>
          </section>

          {/* Overview */}
          <section id="overview" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              Our core brand colours should be used across all products to build familiarity and recognition.
              We use consistent groups of colours based on our configured primary and secondary palettes.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Colours are managed by the brand team via the dashboard and are automatically reflected here.
            </p>
          </section>

          {/* Brand Palette */}
          <section id="brand-palette" className="space-y-10">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Brand palette</h2>

            {/* Primary */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Primary colour</h3>
              <p className="text-sm text-gray-600">
                The primary colour drives the brand's header, key navigation, titles, and core interactive elements.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ColorSwatch hex={primaryColor} label="Primary 100" sublabel="Full" />
                <ColorSwatch hex={primary70} label="Primary 70" sublabel="Tint" />
                <ColorSwatch hex={primary40} label="Primary 40" sublabel="Tint" />
                <ColorSwatch hex={primary10} label="Primary 10" sublabel="Tint" />
              </div>
            </div>

            {/* Secondary */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Secondary colour</h3>
              <p className="text-sm text-gray-600">
                The secondary colour adds depth and warmth, used for accents, highlights, and supporting UI elements.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ColorSwatch hex={secondaryColor} label="Secondary 100" sublabel="Full" />
                <ColorSwatch hex={secondary70} label="Secondary 70" sublabel="Tint" />
                <ColorSwatch hex={secondary40} label="Secondary 40" sublabel="Tint" />
                <ColorSwatch hex={secondary10} label="Secondary 10" sublabel="Tint" />
              </div>
            </div>

            {/* Neutral greys - always static */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Grey palette</h3>
              <p className="text-sm text-gray-600">
                The grey palette is used for text, borders, and background surfaces.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ColorSwatch hex="#222222" label="Black" />
                <ColorSwatch hex="#707071" label="Grey 75" />
                <ColorSwatch hex="#BCBCBD" label="Grey 35" />
                <ColorSwatch hex="#f5f5f6" label="Grey 5" />
              </div>
            </div>
          </section>

          {/* Tints */}
          <section id="tints" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Tints</h2>
            <p className="text-gray-700 leading-relaxed">
              We use 70%, 40%, or 10% tints of our colours. Tints are created by mixing the colour with white,
              rather than using transparency. This ensures colours stay consistent on different backgrounds.
            </p>

            {/* Tint visual strip */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-500">Primary colour scale</p>
              <div className="flex rounded-lg overflow-hidden h-14 border">
                {[primaryColor, primary70, primary40, primary10].map((c, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="flex text-[10px] text-gray-500 font-mono">
                <span className="flex-1">100%</span>
                <span className="flex-1">70%</span>
                <span className="flex-1">40%</span>
                <span className="flex-1">10%</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-500">Secondary colour scale</p>
              <div className="flex rounded-lg overflow-hidden h-14 border">
                {[secondaryColor, secondary70, secondary40, secondary10].map((c, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="flex text-[10px] text-gray-500 font-mono">
                <span className="flex-1">100%</span>
                <span className="flex-1">70%</span>
                <span className="flex-1">40%</span>
                <span className="flex-1">10%</span>
              </div>
            </div>
          </section>

          {/* Accessible Contrast */}
          <section id="accessible-contrast" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Accessible colour contrast</h2>
            <p className="text-gray-700 leading-relaxed">
              Brand colours must be used with correct contrast to meet accessibility requirements.
              All colour combinations should meet at least{" "}
              <strong>WCAG 2.1 AA level</strong>, which requires a contrast ratio of at least
              4.5:1 for normal text and 3:1 for large text.
            </p>

            {/* Sample contrast examples */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="rounded-lg p-5 text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <p className="text-sm font-bold mb-1">White on Primary</p>
                <p className="text-xs opacity-80">This combination should pass AA.</p>
              </div>
              <div
                className="rounded-lg p-5"
                style={{ backgroundColor: primary10, color: primaryColor }}
              >
                <p className="text-sm font-bold mb-1">Primary on Light Tint</p>
                <p className="text-xs opacity-80">Used for subtle highlighted sections.</p>
              </div>
              <div className="rounded-lg p-5 bg-gray-900 text-white">
                <p className="text-sm font-bold mb-1">White on Dark Grey</p>
                <p className="text-xs opacity-80">For footer, dark sections, code blocks.</p>
              </div>
              <div
                className="rounded-lg p-5"
                style={{ backgroundColor: secondaryColor, color: "#222222" }}
              >
                <p className="text-sm font-bold mb-1">Dark on Secondary</p>
                <p className="text-xs opacity-80">Check this against your chosen secondary colour.</p>
              </div>
            </div>
          </section>

          {/* Usage Guidance */}
          <section id="usage-guidance" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Usage guidance</h2>
            <ul className="space-y-3 text-gray-700">
              {[
                "Use the primary colour for all key interactive elements: buttons, links, and headings.",
                "Use 10% tints as page backgrounds or highlight zones to add depth without overwhelming content.",
                "Never use both primary and secondary at the same prominence in a single component.",
                "Always check contrast ratios before using colour combinations on text.",
                "Do not create ad-hoc colour variants — use only the defined palette and its tints.",
                "Avoid placing white text on tint variants (40%, 10%) as contrast may be insufficient.",
              ].map((rule) => (
                <li key={rule} className="flex gap-3 text-sm leading-relaxed">
                  <span
                    className="mt-1.5 h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                  />
                  {rule}
                </li>
              ))}
            </ul>
          </section>

        </main>
      </div>
    </div>
  );
}
