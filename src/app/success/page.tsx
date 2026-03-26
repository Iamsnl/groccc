"use client";

import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SuccessPage() {
  const orderId = "ORD-" + Math.floor(Math.random() * 1000000);

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl shadow-emerald-500/10 border border-slate-100 dark:border-slate-800 max-w-lg w-full text-center">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-4">Order Successful!</h1>
        <p className="text-slate-500 mb-8 text-lg">
          Thank you for shopping with us! Your order <span className="font-bold text-slate-900 dark:text-white">{orderId}</span> has been confirmed and is being processed.
        </p>

        <div className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-950 rounded-2xl py-4 px-6 mb-8 border border-slate-200 dark:border-slate-800">
          <Package className="w-5 h-5 text-emerald-500" />
          <span className="font-medium">Estimated Delivery:</span>
          <span className="font-bold text-emerald-600">Tomorrow, before 9:00 PM</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/profile/orders" className="flex-1">
            <Button variant="outline" size="lg" className="w-full h-14">View Order</Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button size="lg" className="w-full h-14 shadow-lg shadow-emerald-500/20">
              Continue Shopping <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
