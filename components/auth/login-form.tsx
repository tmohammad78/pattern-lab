"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { login, getSession } from "@/lib/auth";
import type { User } from "@/lib/types";

interface LoginPageProps {
  users: User[];
}

export function LoginForm({ users }: LoginPageProps) {
  const router = useRouter();

  useEffect(() => {
    if (getSession()) router.replace("/");
  }, [router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const session = await login(email, password, users);
    setLoading(false);
    if (session) {
      router.push("/");
    } else {
      setError("Incorrect password for this email");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/snapppay-logo.svg"
            alt="Snapp Pay"
            width={64}
            height={64}
            className="mb-4"
          />
          <h1 className="text-2xl font-bold">Pattern Lab</h1>
          <p className="text-sm text-muted-foreground">by Snapp Pay</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@snapppay.ir"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : "Login / Sign Up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          New users are registered automatically. Existing demo: demo@snapppay.ir / patternlab123
        </p>
      </Card>
    </div>
  );
}
