"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const callback = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (callback?.error) {
      setError(callback.error);
      setLoading(false);
    }

    if (callback?.ok && !callback?.error) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center justify-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to log in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={loginUser} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center flex-col gap-2">
          <div className="text-sm text-slate-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-emerald-600 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
