"use client";

import { useEffect, useState } from "react";
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
import { CheckCircle } from "lucide-react";

export default function DashboardColoursPage() {
  const [primaryColor, setPrimaryColor] = useState("#1d6497");
  const [secondaryColor, setSecondaryColor] = useState("#f59e0b");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Load existing brand colors on mount
  useEffect(() => {
    fetch("/api/brand")
      .then((res) => res.json())
      .then((data) => {
        if (data.primaryColor) setPrimaryColor(data.primaryColor);
        if (data.secondaryColor) setSecondaryColor(data.secondaryColor);
      })
      .catch(console.error)
      .finally(() => setIsFetching(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ primaryColor, secondaryColor }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-16 text-sm text-muted-foreground">
        Loading brand colors…
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Brand Colours</h1>
        <p className="text-muted-foreground mt-2">
          Update your brand's primary and secondary colors. Changes will be reflected across all public guidelines pages.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Primary Color</CardTitle>
            <CardDescription>
              Used for the header, main titles, links, and key UI elements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <label className="relative cursor-pointer shrink-0">
                <div
                  className="h-14 w-14 rounded-lg border shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                />
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  aria-label="Pick primary color"
                />
              </label>
              <div className="flex-1 space-y-1">
                <Label htmlFor="primary-hex">Hex value</Label>
                <Input
                  id="primary-hex"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#1d6497"
                  maxLength={7}
                  className="font-mono"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Secondary Color</CardTitle>
            <CardDescription>
              Used for accents, highlights, and supporting UI elements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <label className="relative cursor-pointer shrink-0">
                <div
                  className="h-14 w-14 rounded-lg border shadow-sm"
                  style={{ backgroundColor: secondaryColor }}
                />
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  aria-label="Pick secondary color"
                />
              </label>
              <div className="flex-1 space-y-1">
                <Label htmlFor="secondary-hex">Hex value</Label>
                <Input
                  id="secondary-hex"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  placeholder="#f59e0b"
                  maxLength={7}
                  className="font-mono"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>How your colors look together.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg overflow-hidden border h-24 flex">
              <div className="flex-1 flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: primaryColor }}>
                Primary
              </div>
              <div className="flex-1 flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: secondaryColor }}>
                Secondary
              </div>
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {success && (
          <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
            <CheckCircle size={16} />
            Colors saved successfully! The site will reflect the new brand colors on next load.
          </div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto px-8">
          {isLoading ? "Saving…" : "Save Colors"}
        </Button>
      </form>
    </div>
  );
}
