import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  discountPrice: number | null;
  image: string;
  quantity: number;
  weightGrams?: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = get().items;
        // The id includes weightGrams to make variants globally unique.
        const variantId = item.weightGrams ? `${item.id}-${item.weightGrams}` : item.id;
        const existingItemIndex = currentItems.findIndex((i) => i.id === variantId);

        if (existingItemIndex !== -1) {
          const newItems = [...currentItems];
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + 1,
          };
          set({ items: newItems });
        } else {
          set({ items: [...currentItems, { ...item, id: variantId, quantity: 1 }] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () =>
        get().items.reduce((acc, item) => {
          const basePrice = item.discountPrice ?? item.price;
          const actualPrice = item.weightGrams ? basePrice * (item.weightGrams / 1000) : basePrice;
          return acc + actualPrice * item.quantity;
        }, 0),
    }),
    {
      name: 'grocery-cart-storage',
    }
  )
);
