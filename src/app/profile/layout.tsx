"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, MapPin, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarNavItems = [
  {
    title: "Profile Overview",
    href: "/profile",
    icon: <User className="w-5 h-5" />,
  },
  {
    title: "My Orders",
    href: "/profile/orders",
    icon: <Package className="w-5 h-5" />,
  },
  {
    title: "Saved Addresses",
    href: "/profile/addresses",
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    title: "Get Help",
    href: "/profile/help",
    icon: <LifeBuoy className="w-5 h-5" />,
  },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
            {sidebarNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex-1 w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
