import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export function Footer({ storeName = "FreshCart" }: { storeName?: string }) {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 dark:bg-slate-950 dark:border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">
                {storeName}.
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              The premium grocery shopping experience delivered right to your door in 30 minutes.
            </p>
            <div className="flex gap-4 mt-6">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">
                <Facebook className="h-4 w-4" />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">
                <Twitter className="h-4 w-4" />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer">
                <Instagram className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-slate-100">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/about" className="hover:text-emerald-600 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-600 transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-emerald-600 transition-colors">Careers</Link></li>
              <li><Link href="/stores" className="hover:text-emerald-600 transition-colors">Store Locations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-slate-100">Customer Service</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/faq" className="hover:text-emerald-600 transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-emerald-600 transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-emerald-600 transition-colors">Returns</Link></li>
              <li><Link href="/track" className="hover:text-emerald-600 transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-slate-100">Newsletter</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <div className="flex">
              <input type="email" placeholder="Enter your email" className="h-11 w-full rounded-l-xl border border-r-0 border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900" />
              <button className="h-11 px-4 bg-emerald-500 text-white rounded-r-xl text-sm font-medium hover:bg-emerald-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
