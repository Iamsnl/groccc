"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || "Something went wrong");
      }

      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center justify-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={registerUser} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Email
              </label>
              <Input
                type="email"
                placeholder="m@example.com"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center flex-col gap-2">
          <div className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
