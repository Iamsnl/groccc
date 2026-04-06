"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, LogOut, User, Menu, X, LayoutDashboard } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/Button";

import { useState, useEffect } from "react";

export function Navbar({ storeName = "FreshCart" }: { storeName?: string }) {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
              {session.user?.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20">
                    <LayoutDashboard className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}
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

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-4 gap-4 px-6 text-sm">
            <Link href="/" className="font-semibold text-slate-800 dark:text-slate-200" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link href="/category/fruits-and-vegetables" className="font-semibold text-slate-800 dark:text-slate-200" onClick={() => setIsMobileMenuOpen(false)}>Fruits & Veggies</Link>
            <Link href="/category/dairy-and-bakery" className="font-semibold text-slate-800 dark:text-slate-200" onClick={() => setIsMobileMenuOpen(false)}>Dairy & Bakery</Link>
            <hr className="border-slate-200 dark:border-slate-800 my-2" />
            {session ? (
              <div className="flex flex-col gap-3">
                {session.user?.role === "ADMIN" && (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full justify-start gap-3 h-12 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20">
                      <LayoutDashboard className="h-5 w-5" /> Admin Panel
                    </Button>
                  </Link>
                )}
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full justify-start gap-3 h-12">
                    <User className="h-5 w-5" /> My Profile
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="w-full justify-start gap-3 h-12 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30">
                  <LogOut className="h-5 w-5" /> Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-12">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full h-12">Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
