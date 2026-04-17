"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Check, X, Scale, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/useCartStore";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Custom slider logic
  const [weight, setWeight] = useState(1000); // Default to 1kg (1000g)

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWeight(1000); // Reset
    setIsAdded(false);
    setModalOpen(true);
  };

  const handleConfirmAdd = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setIsAdding(true);

    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice ?? null,
        image: product.image,
        weightGrams: weight
      });

      setIsAdding(false);
      setIsAdded(true);

      setTimeout(() => {
        setModalOpen(false);
        setIsAdded(false);
      }, 700);
    }, 400);
  };
  
  const basePrice = product.discountPrice ?? product.price;
  const currentCalculatedPrice = (basePrice * (weight / 1000)).toFixed(2);

  const ModalContent = (
    <AnimatePresence>
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { e.stopPropagation(); setModalOpen(false); }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            {/* Header Product Info */}
            <div className="p-6 pb-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950/20">
              <button 
                onClick={(e) => { e.stopPropagation(); setModalOpen(false); }}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex gap-4 items-center">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                  <p className="text-emerald-600 font-medium text-sm">₹{basePrice}/kg Base</p>
                </div>
              </div>
            </div>

            {/* Slider Section */}
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Scale className="w-4 h-4" /> Select Weight
                </label>
                <div className="text-2xl font-bold text-emerald-600">
                  {weight >= 1000 ? `${weight/1000}kg` : `${weight}g`}
                </div>
              </div>

              <div className="relative">
                <input 
                  onClick={(e) => e.stopPropagation()}
                  type="range" 
                  min="100" 
                  max="1000" 
                  step="100" 
                  value={weight}
                  onChange={(e) => {
                     e.stopPropagation();
                     setWeight(parseInt(e.target.value));
                  }}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs font-medium text-slate-400 mt-2">
                  <span>100g</span>
                  <span>500g</span>
                  <span>1kg</span>
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl flex items-center justify-between border border-emerald-100 dark:border-emerald-900/30">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Final Price</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">₹{currentCalculatedPrice}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <Button 
                onClick={handleConfirmAdd} 
                disabled={isAdding || isAdded}
                className={`w-full h-14 rounded-xl text-lg font-semibold transition-all ${isAdded ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
              >
                {isAdded ? (
                  <><Check className="mr-2 w-5 h-5" /> Added to Cart</>
                ) : isAdding ? (
                  <><Loader2 className="mr-2 w-5 h-5 animate-spin" /> Processing</>
                ) : (
                  <><ShoppingCart className="mr-2 w-5 h-5" /> Add to Cart</>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <Button
        size="icon"
        className={`h-10 w-10 shrink-0 rounded-full shadow-sm relative transition-all duration-300 hover:scale-105`}
        onClick={handleOpenModal}
      >
        <ShoppingCart className="w-4 h-4" />
      </Button>

      {/* Render Modal via Portal to avoid stacking context / overflow issues */}
      {mounted && createPortal(ModalContent, document.body)}
    </>
  );
}
