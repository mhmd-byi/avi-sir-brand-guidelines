"use client";

import Link from "next/link";
import { 
  Palette, 
  Image as ImageIcon, 
  Type, 
  LayoutTemplate, 
  Layers, 
  Video, 
  Camera, 
  Square
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const MODULES = [
  {
    title: "Colours",
    description: "Manage your brand's primary and secondary colour palettes.",
    icon: Palette,
    href: "/setup",
    status: "Active"
  },
  {
    title: "Logo",
    description: "Upload and manage different logo variations and sizes.",
    icon: ImageIcon,
    href: "/dashboard/logo",
    status: "Active"
  },
  {
    title: "Typography",
    description: "Configure brand fonts and typographic hierarchy.",
    icon: Type,
    href: "#",
    status: "Coming Soon"
  },
  {
    title: "Iconography",
    description: "Manage your custom icon sets and usage guidelines.",
    icon: Layers,
    href: "#",
    status: "Coming Soon"
  },
  {
    title: "Patterns",
    description: "Define brand patterns and decorative elements.",
    icon: LayoutTemplate,
    href: "#",
    status: "Coming Soon"
  },
  {
    title: "Photography",
    description: "Style guides and requirements for brand photography.",
    icon: Camera,
    href: "#",
    status: "Coming Soon"
  },
  {
    title: "Videography",
    description: "Motion principles and video production standards.",
    icon: Video,
    href: "#",
    status: "Coming Soon"
  },
  {
    title: "Applications",
    description: "Examples of how to apply branding across different mediums.",
    icon: Square,
    href: "#",
    status: "Coming Soon"
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage all your brand guideline modules from one place.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((module) => (
          <Link 
            key={module.title} 
            href={module.href}
            className={module.status === "Coming Soon" ? "pointer-events-none opacity-50" : ""}
          >
            <Card className="h-full hover:border-primary transition-colors cursor-pointer group">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">{module.title}</CardTitle>
                <div className="ml-auto bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <module.icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{module.description}</p>
                <div className="mt-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                    module.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {module.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
