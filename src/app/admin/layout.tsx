"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PackageSearch,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  LogOut,
  LifeBuoy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { signOut } from "next-auth/react";

const sidebarNavItems = [
  { title: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
  { title: "Products", href: "/admin/products", icon: <PackageSearch className="w-5 h-5" /> },
  { title: "Orders", href: "/admin/orders", icon: <ShoppingCart className="w-5 h-5" /> },
  { title: "Customers", href: "/admin/customers", icon: <Users className="w-5 h-5" /> },
  { title: "Coupons", href: "/admin/coupons", icon: <Tag className="w-5 h-5" /> },
  { title: "Support", href: "/admin/support", icon: <LifeBuoy className="w-5 h-5" /> },
  { title: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="text-xl font-black bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">
            Store Admin
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col gap-1 px-4">
            {sidebarNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-slate-900 text-white dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={() => signOut()}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-8">
          <h1 className="text-xl font-semibold capitalize text-slate-800 dark:text-slate-100">
            {pathname === "/admin" ? "Dashboard Overview" : pathname.split('/').pop()}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
