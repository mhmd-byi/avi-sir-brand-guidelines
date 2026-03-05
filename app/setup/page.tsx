"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function SetupPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [secondaryColor, setSecondaryColor] = useState("#f59e0b");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect based on auth/setup state
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session.user.isSetupComplete) {
      router.push("/");
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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

      // Refresh the JWT so isSetupComplete becomes true in the session
      await update({ isSetupComplete: true });

      router.push("/");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show nothing while session is loading or redirecting
  if (status === "loading" || status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Set up your brand</CardTitle>
          <CardDescription>
            Choose your brand colors. These will be displayed publicly.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Primary Color */}
            <div className="space-y-2">
              <Label htmlFor="primary-hex">Primary color</Label>
              <div className="flex items-center gap-3">
                {/* Clickable swatch that opens native color picker */}
                <label className="relative cursor-pointer shrink-0">
                  <div
                    className="h-10 w-10 rounded-md border border-input"
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
                <Input
                  id="primary-hex"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#6366f1"
                  maxLength={7}
                  className="font-mono"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="space-y-2">
              <Label htmlFor="secondary-hex">Secondary color</Label>
              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer shrink-0">
                  <div
                    className="h-10 w-10 rounded-md border border-input"
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

            {/* Live preview */}
            <div className="rounded-md border overflow-hidden">
              <div className="h-8" style={{ backgroundColor: primaryColor }} />
              <div className="h-8" style={{ backgroundColor: secondaryColor }} />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving…" : "Save & continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
