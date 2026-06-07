import type { Product } from "../types";

export const PRODUCTS: Product[] = [
  // Fruits — by kg
  { id: 1,  name: "Apple",        price: 80,  barcode: "001", emoji: "🍎", category: "Fruits",     unit: "kg",    image: "" },
  { id: 2,  name: "Banana",       price: 40,  barcode: "002", emoji: "🍌", category: "Fruits",     unit: "kg",    image: "" },
  { id: 3,  name: "Grapes",       price: 120, barcode: "003", emoji: "🍇", category: "Fruits",     unit: "kg",    image: "" },
  { id: 4,  name: "Mango",        price: 100, barcode: "004", emoji: "🥭", category: "Fruits",     unit: "kg",    image: "" },
  { id: 5,  name: "Watermelon",   price: 30,  barcode: "005", emoji: "🍉", category: "Fruits",     unit: "kg",    image: "" },

  // Vegetables — by kg
  { id: 6,  name: "Tomato",       price: 40,  barcode: "006", emoji: "🍅", category: "Vegetables", unit: "kg",    image: "" },
  { id: 7,  name: "Onion",        price: 35,  barcode: "007", emoji: "🧅", category: "Vegetables", unit: "kg",    image: "" },
  { id: 8,  name: "Potato",       price: 30,  barcode: "008", emoji: "🥔", category: "Vegetables", unit: "kg",    image: "" },
  { id: 9,  name: "Carrot",       price: 50,  barcode: "009", emoji: "🥕", category: "Vegetables", unit: "kg",    image: "" },

  // Dairy — by piece
  { id: 10, name: "Milk 500ml",   price: 45,  barcode: "010", emoji: "🥛", category: "Dairy",      unit: "piece", image: "" },
  { id: 11, name: "Butter 100g",  price: 55,  barcode: "011", emoji: "🧈", category: "Dairy",      unit: "piece", image: "" },
  { id: 12, name: "Eggs (6)",     price: 60,  barcode: "012", emoji: "🥚", category: "Dairy",      unit: "piece", image: "" },
  { id: 13, name: "Curd 200g",    price: 30,  barcode: "013", emoji: "🍶", category: "Dairy",      unit: "piece", image: "" },

  // Bakery — by piece
  { id: 14, name: "Bread",        price: 35,  barcode: "014", emoji: "🍞", category: "Bakery",     unit: "piece", image: "" },
  { id: 15, name: "Bun (4pcs)",   price: 20,  barcode: "015", emoji: "🥖", category: "Bakery",     unit: "piece", image: "" },

  // Staples — by kg
  { id: 16, name: "Rice",         price: 60,  barcode: "016", emoji: "🍚", category: "Staples",    unit: "kg",    image: "" },
  { id: 17, name: "Sugar",        price: 42,  barcode: "017", emoji: "🍚", category: "Staples",    unit: "kg",    image: "" },
  { id: 18, name: "Dal",          price: 90,  barcode: "018", emoji: "🫘", category: "Staples",    unit: "kg",    image: "" },

  // Snacks — by piece
  { id: 19, name: "Lays Chips",   price: 20,  barcode: "019", emoji: "🥔", category: "Snacks",     unit: "piece", image: "" },
  { id: 20, name: "Biscuits",     price: 30,  barcode: "020", emoji: "🍪", category: "Snacks",     unit: "piece", image: "" },
  { id: 21, name: "Chocolate",    price: 40,  barcode: "021", emoji: "🍫", category: "Snacks",     unit: "piece", image: "" },
  { id: 22, name: "Namkeen",      price: 25,  barcode: "022", emoji: "🥜", category: "Snacks",     unit: "piece", image: "" },

  // Drinks — by piece
  { id: 23, name: "Water 1L",     price: 20,  barcode: "023", emoji: "💧", category: "Drinks",     unit: "piece", image: "" },
  { id: 24, name: "Coca Cola",    price: 40,  barcode: "024", emoji: "🥤", category: "Drinks",     unit: "piece", image: "" },
  { id: 25, name: "Juice 200ml",  price: 25,  barcode: "025", emoji: "🧃", category: "Drinks",     unit: "piece", image: "" },

  // Oils — by piece
  { id: 26, name: "Olive Oil",    price: 120, barcode: "026", emoji: "🫒", category: "Oils",       unit: "piece", image: "" },
  { id: 27, name: "Coconut Oil",  price: 80,  barcode: "027", emoji: "🥥", category: "Oils",       unit: "piece", image: "" },
];

export const DISCOUNT_PERCENT = 10;

export const CATEGORY_COLORS: Record<string, string> = {
  Fruits:     "#34c759",
  Vegetables: "#30d158",
  Dairy:      "#007aff",
  Bakery:     "#ff9500",
  Staples:    "#af52de",
  Snacks:     "#ff2d55",
  Drinks:     "#5ac8fa",
  Oils:       "#ffcc00",
};