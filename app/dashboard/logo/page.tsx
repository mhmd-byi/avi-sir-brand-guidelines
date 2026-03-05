"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Loader2, UploadCloud } from "lucide-react";

const LOGO_TYPES = [
  { id: "stackedLogo",        label: "Stacked Logo (Full Color)", description: "For print and primary digital use" },
  { id: "landscapeLogo",      label: "Landscape Logo (Full Color)", description: "For social media and narrow spaces" },
  { id: "stackedLogoBlack",   label: "Stacked Logo (Black)", description: "One colour black version" },
  { id: "landscapeLogoBlack", label: "Landscape Logo (Black)", description: "One colour black landscape version" },
  { id: "stackedLogoWhite",   label: "Stacked Logo (White)", description: "One colour white version (for dark bgs)" },
  { id: "landscapeLogoWhite", label: "Landscape Logo (White)", description: "One colour white landscape version" },
];

export default function LogoDashboardPage() {
  const { data: session } = useSession();
  const [logos, setLogos] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/brand")
      .then((res) => res.json())
      .then((data) => {
        setLogos({
          stackedLogo:    data.stackedLogo,
          landscapeLogo:  data.landscapeLogo,
          stackedLogoBlack:    data.stackedLogoBlack,
          landscapeLogoBlack:  data.landscapeLogoBlack,
          stackedLogoWhite:    data.stackedLogoWhite,
          landscapeLogoWhite:  data.landscapeLogoWhite,
        });
      })
      .catch(console.error);
  }, []);

  const handleUpload = async (logoType: string, file: File) => {
    if (!file) return;

    setUploading(logoType);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("logoType", logoType);

    try {
      const res = await fetch("/api/logo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed.");
      }

      setLogos((prev) => ({ ...prev, [logoType]: data.publicPath }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Logo Section</h1>
        <p className="text-gray-600">
          Upload and manage official logo variations. These will be automatically saved to project's asset folders.
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {LOGO_TYPES.map((type) => (
          <Card key={type.id} className="overflow-hidden flex flex-col">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle className="text-lg font-semibold">{type.label}</CardTitle>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 px-6 pb-6 pt-0 space-y-4">
              {/* Preview Box */}
              <div className={`
                h-40 rounded-lg border border-dashed flex items-center justify-center p-4 relative bg-gray-50/50
                ${type.id.includes("White") ? "bg-slate-900 border-white/20" : ""}
              `}>
                {logos[type.id] ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={`${logos[type.id]}?t=${Date.now()}`}
                      alt={type.label}
                      fill
                      className="object-contain"
                      unoptimized={true}
                    />
                  </div>
                ) : (
                  <div className={`flex flex-col items-center gap-1 ${type.id.includes("White") ? "text-white/40" : "text-gray-400"}`}>
                    <UploadCloud size={24} />
                    <span className="text-xs">No image uploaded</span>
                  </div>
                )}
                
                {uploading === type.id && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                    <Loader2 className="animate-spin text-primary" size={24} />
                  </div>
                )}
              </div>

              {/* Upload Input */}
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg"
                  className="cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(type.id, file);
                  }}
                  disabled={!!uploading}
                />
                <p className="text-[10px] text-muted-foreground">
                  PNG or SVG recommended. Max size 5MB.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
