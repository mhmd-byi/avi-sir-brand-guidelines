"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { title: "About us",    href: "/about" },
  { title: "Logo",        href: "/logo" },
  { title: "Typography",  href: "/typography" },
  { title: "Colours",     href: "/colours" },
  { title: "Pattern",     href: "/pattern" },
  { title: "Iconography", href: "/iconography" },
  { title: "Illustration",href: "/illustration" },
  { title: "Photography", href: "/photography" },
  { title: "Videography", href: "/videography" },
  { title: "Application", href: "/application" },
];

export default function BrandNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-8 md:px-16">
        <ul className="flex flex-wrap gap-0">
          {SECTIONS.map((s) => {
            const isActive = pathname === s.href;
            return (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className={`
                    inline-block px-3 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap
                    ${isActive
                      ? "border-(--brand-primary) text-(--brand-primary)"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                    }
                  `}
                >
                  {s.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
