"use client";

import { useState } from "react";
import Link from "next/link";
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

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">
            Forgot password
          </CardTitle>
          <CardDescription>
            {submitted
              ? "Check your inbox for a reset link."
              : "Enter your email and we'll send you a reset link."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {submitted ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                If an account exists for that email address, you will receive a
                password reset link shortly.
              </p>
              <Link href="/reset-password">
                <Button className="w-full">Reset password</Button>
              </Link>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSubmitted(false)}
              >
                Try a different email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Send reset link
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground mt-4">
            Remembered it?{" "}
            <Link
              href="/login"
              className="text-foreground font-medium hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
