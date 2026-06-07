export type ProductUnit = "kg" | "piece";

export interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string;
  emoji: string;
  image: string;
  category: string;
  unit: ProductUnit;
}

export interface CartItem {
  product: Product;
  quantity: number;  // pieces count OR weight in kg
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}