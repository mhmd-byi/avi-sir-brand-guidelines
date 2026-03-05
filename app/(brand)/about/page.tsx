export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-8 md:px-16 py-8">
      <div className="flex gap-16">

        {/* ── Left sidebar ─────────────────────────────────── */}
        <aside className="w-40 shrink-0 pt-1">
          <nav className="flex flex-col gap-3">
            {[
              { label: "Who we are", href: "#who-we-are" },
              { label: "Our brand",  href: "#our-brand"  },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm hover:underline underline-offset-2"
                style={{ color: "var(--brand-primary)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* ── Main content ─────────────────────────────────── */}
        <main className="flex-1 max-w-2xl">
          <h1
            id="who-we-are"
            className="text-3xl font-bold mb-6"
            style={{ color: "var(--brand-primary)" }}
          >
            About us
          </h1>

          <p className="text-sm text-gray-700 leading-relaxed mb-5">
            Our brand is formed by people experiencing how we look, sound and
            act. Users form the brand in their minds through various
            touchpoints, such as:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-5 text-sm text-gray-700 leading-relaxed">
            <li>
              our <strong>visual brand</strong> – what we look like when people
              interact with us
            </li>
            <li>
              our <strong>written brand</strong> – what we say and how we say
              it
            </li>
            <li>
              our <strong>physical brand</strong> – the spaces in which we
              work, our presence at events, our coverage in the media and our
              products
            </li>
          </ul>

          <p
            id="our-brand"
            className="text-sm text-gray-700 leading-relaxed mb-5"
          >
            The more consistent we are in our consideration of these things,
            the more trust, reliability and recognition we build. It is
            extremely important that our brand is used properly, so we ask that
            both internal colleagues and external suppliers regularly refer to
            this guidance.
          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
            If you have any questions, email{" "}
            <a
              href="mailto:design@brand.com"
              className="hover:underline underline-offset-2"
              style={{ color: "var(--brand-primary)" }}
            >
              design@brand.com ↗
            </a>
          </p>
        </main>

      </div>
    </div>
  );
}
