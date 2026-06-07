import { useState } from "react";
import type { Product, CartItem } from "../types";
import { DISCOUNT_PERCENT } from "../data/products";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  // For piece items — adds 1 quantity
  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // For kg items — adds exact weight entered by cashier
  const addItemByWeight = (product: Product, weight: number) => {
    if (weight <= 0) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.round((i.quantity + weight) * 100) / 100 }
            : i
        );
      }
      return [...prev, { product, quantity: weight }];
    });
  };

  const removeItem = (productId: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.product.id !== productId) return i;
          // For kg items, decrease by 0.5kg; for piece, decrease by 1
          const step = i.product.unit === "kg" ? 0.5 : 1;
          return { ...i, quantity: Math.round((i.quantity - step) * 100) / 100 };
        })
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = Math.round(
    items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  );
  const discount = Math.round(subtotal * (DISCOUNT_PERCENT / 100));
  const total = subtotal - discount;

  return {
    items,
    subtotal,
    discount,
    total,
    addItem,
    addItemByWeight,
    removeItem,
    clearCart,
  };
}