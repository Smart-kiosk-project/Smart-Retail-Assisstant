import { useEffect, useState } from "react";
import type { CartItem } from "../types";
import { CATEGORY_COLORS } from "../data/products";
import { Apple, Carrot, Milk, Croissant, Wheat, Cookie, GlassWater, Droplets } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Fruits:     <Apple size={18} color="#34c759" />,
  Vegetables: <Carrot size={18} color="#30d158" />,
  Dairy:      <Milk size={18} color="#007aff" />,
  Bakery:     <Croissant size={18} color="#ff9500" />,
  Staples:    <Wheat size={18} color="#af52de" />,
  Snacks:     <Cookie size={18} color="#ff2d55" />,
  Drinks:     <GlassWater size={18} color="#5ac8fa" />,
  Oils:       <Droplets size={18} color="#ffcc00" />,
};

interface Props {
  item: CartItem;
  onAdd: () => void;
  onRemove: () => void;
  isNew?: boolean;
}

export default function ScannedItem({ item, onAdd, onRemove, isNew = false }: Props) {
  const [flash, setFlash] = useState(false);
  const categoryColor = CATEGORY_COLORS[item.product.category] ?? "#378ADD";
  const lineTotal = Math.round(item.product.price * item.quantity);
  const qtyLabel =
    item.product.unit === "kg" ? `${item.quantity} kg` : `${item.quantity} pc`;

  useEffect(() => {
    if (isNew) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 600);
      return () => clearTimeout(t);
    }
  }, [isNew]);

  return (
    <>
      <style>{`
        @keyframes itemIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .item-card { transition: border-color 0.15s ease; }
        .item-card:hover { border-color: #3a3a46 !important; }
        .step-btn-inner:hover { background-color: #1a2a3a !important; }
      `}</style>

      <div
        className="item-card"
        style={{
          ...styles.card,
          borderColor: flash ? "#185FA5" : "#222228",
          animation: "itemIn 0.2s ease-out forwards",
        }}
      >
        {/* Emoji icon */}
        <div style={styles.emojiBox}>
        {CATEGORY_ICONS[item.product.category]}
        </div>

        {/* Main info */}
        <div style={styles.content}>
          <div style={styles.name}>{item.product.name}</div>
          <div style={styles.meta}>
            <span
              style={{ ...styles.catDot, backgroundColor: categoryColor }}
            />
            <span style={styles.catText}>{item.product.category}</span>
            <span style={styles.metaSep}>·</span>
            <span style={styles.priceUnit}>
              ₹{item.product.price}/{item.product.unit}
            </span>
          </div>
        </div>

        {/* Right: total + stepper */}
        <div style={styles.right}>
          <span style={styles.lineTotal}>₹{lineTotal}</span>
          <div style={styles.stepper}>
            <button
              className="step-btn-inner"
              style={styles.stepBtn}
              onClick={onRemove}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span style={styles.stepQty}>{qtyLabel}</span>
            <button
              className="step-btn-inner"
              style={styles.stepBtn}
              onClick={onAdd}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#141416",
    border: "1px solid #222228",
    borderRadius: 12,
    padding: "10px 12px",
  },
  emojiBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#1e1e24",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  emoji: {
    fontSize: 18,
    lineHeight: 1,
  },
  content: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  name: {
    fontSize: 13,
    fontWeight: 600,
    color: "#e8e8ec",
    letterSpacing: "-0.1px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "left",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  catDot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    flexShrink: 0,
  },
  catText: {
    fontSize: 11,
    color: "#6b6b72",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  metaSep: {
    fontSize: 10,
    color: "#3a3a42",
  },
  priceUnit: {
    fontSize: 11,
    color: "#4a4a54",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  lineTotal: {
    fontSize: 14,
    fontWeight: 600,
    color: "#e8e8ec",
    minWidth: 48,
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "-0.2px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
  },
  stepper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1e1e24",
    border: "1px solid #2a2a2e",
    borderRadius: 8,
    overflow: "hidden",
  },
  stepBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 700,
    color: "#378ADD",
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.1s ease",
    padding: 0,
  },
  stepQty: {
    fontSize: 11,
    fontWeight: 600,
    color: "#c8c8d0",
    minWidth: 36,
    textAlign: "center",
    borderLeft: "1px solid #2a2a2e",
    borderRight: "1px solid #2a2a2e",
    height: 28,
    lineHeight: "28px",
    fontVariantNumeric: "tabular-nums",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
};