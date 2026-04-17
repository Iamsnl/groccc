"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useCartStore } from "@/store/useCartStore";

import { useState, useEffect } from "react";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-48 h-48 mb-6 relative opacity-50 grayscale">
          <Image src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop" alt="Empty Cart" fill className="object-cover rounded-full" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Let's fix that!</p>
        <Link href="/">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  const subtotal = totalPrice();
  const deliveryInfo = subtotal > 99 ? 0 : 5.99;
  const finalTotal = subtotal + deliveryInfo;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Your Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4 sm:p-6 flex items-center gap-4 sm:gap-6">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {item.name} {item.weightGrams ? <span className="text-sm font-normal text-slate-500">({item.weightGrams >= 1000 ? `${item.weightGrams / 1000}kg` : `${item.weightGrams}g`})</span> : null}
                    </h3>
                    <div className="text-emerald-600 font-medium text-sm">In Stock</div>
                    <div className="mt-2 text-lg font-bold">
                      ₹{item.weightGrams ? ((item.discountPrice ?? item.price) * (item.weightGrams / 1000)).toFixed(2) : (item.discountPrice ?? item.price).toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full">
                    <div className="flex items-center border border-slate-200 rounded-lg h-10 w-28 text-sm">
                      <button
                        className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-emerald-600 outline-none"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="flex-1 text-center font-semibold">{item.quantity}</span>
                      <button
                        className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-emerald-600 outline-none"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[380px] shrink-0">
          <Card className="sticky top-24 border-emerald-100 dark:border-slate-800 shadow-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Items ({totalItems()})</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Delivery</span>
                  <span className="font-medium">{deliveryInfo === 0 ? "Free" : `₹${deliveryInfo.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Link href="/checkout" className="block">
                  <Button size="lg" className="w-full h-12 text-base shadow-lg shadow-emerald-500/20">
                    Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/" className="block">
                  <Button variant="outline" size="lg" className="w-full h-12">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
