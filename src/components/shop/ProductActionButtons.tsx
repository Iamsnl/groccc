"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/useCartStore";

interface ProductActionButtonsProps {
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice?: number | null;
    image: string;
    stock: number;
  };
}

export function ProductActionButtons({ product }: ProductActionButtonsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    setIsAdding(true);

    // Simulate slight delay for animation effect
    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice ?? null,
        image: product.image,
      });
      // Add additional quantity manually if > 1
      for (let i = 1; i < quantity; i++) {
        addItem({ ...product, discountPrice: product.discountPrice ?? null });
      }

      setIsAdding(false);
      setIsAdded(true);

      // Reset button state
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }, 600);
  };

  return (
    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl h-12 w-32 bg-slate-50 dark:bg-slate-950">
        <button
          className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-emerald-600 outline-none"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="flex-1 text-center font-semibold text-slate-900 dark:text-white">{quantity}</span>
        <button
          className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-emerald-600 outline-none"
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <Button
        size="lg"
        className={`flex-1 h-12 text-lg font-bold relative overflow-hidden transition-all duration-300 ${isAdded ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
          }`}
        onClick={handleAddToCart}
        disabled={isAdding || isAdded}
      >
        <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isAdding || isAdded ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
          <ShoppingCart className="w-5 h-5 mr-3" /> Add to Cart
        </span>

        <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isAdding ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
          Adding...
        </span>

        <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isAdded ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
          <Check className="w-5 h-5 mr-3" /> Added to Cart!
        </span>
      </Button>

      <Button size="icon" variant="outline" className="h-12 w-12 shrink-0 rounded-xl text-slate-500 hover:text-red-500">
        <Heart className="w-5 h-5" />
      </Button>
    </div>
  );
}
