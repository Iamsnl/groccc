"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, LogOut, User, Menu } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/Button";

import { useState, useEffect } from "react";

export function Navbar({ storeName = "FreshCart" }: { storeName?: string }) {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">
              {storeName}.
            </span>
          </Link>

          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <Link href="/category/fruits-and-vegetables" className="hover:text-emerald-600 transition-colors">Fruits & Veggies</Link>
            <Link href="/category/dairy-and-bakery" className="hover:text-emerald-600 transition-colors">Dairy</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-300 dark:hover:bg-emerald-950">
              <ShoppingCart className="h-5 w-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {session ? (
            <div className="hidden md:flex items-center gap-3">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="gap-2 text-slate-600 dark:text-slate-300">
                  <User className="h-4 w-4" />
                  <span className="truncate max-w-[100px]">{session.user?.name || 'Profile'}</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut()} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
