"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/useCartStore";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice?: number | null;
    image: string;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding || isAdded) return;

    setIsAdding(true);

    // Simulate short processing delay
    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice ?? null,
        image: product.image,
      });

      setIsAdding(false);
      setIsAdded(true);

      // Auto-reset state
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }, 600);
  };

  return (
    <Button
      size="icon"
      className={`h-10 w-10 shrink-0 rounded-full shadow-sm relative overflow-hidden transition-all duration-300 ${isAdded ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
        }`}
      onClick={handleAddToCart}
      disabled={isAdding || isAdded}
    >
      <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isAdding || isAdded ? "scale-50 opacity-0" : "scale-100 opacity-100"}`}>
        <ShoppingCart className="w-4 h-4" />
      </span>

      <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isAdding ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </span>

      <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isAdded ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
        <Check className="w-4 h-4" />
      </span>
    </Button>
  );
}
