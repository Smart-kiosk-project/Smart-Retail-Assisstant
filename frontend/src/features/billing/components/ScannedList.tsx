import { useEffect, useRef, useState } from "react";
import type { CartItem } from "../types";
import ScannedItem from "./ScannedItem";

interface Props {
  items: CartItem[];
  onAdd: (productId: number) => void;
  onRemove: (productId: number) => void;
}

export default function ScannedList({ items, onAdd, onRemove }: Props) {
  const [newestId, setNewestId] = useState<number | null>(null);
  const prevCountRef = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (items.length > prevCountRef.current) {
      const newest = items[items.length - 1];
      setNewestId(newest.product.id);
      setTimeout(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
      }, 50);
      setTimeout(() => setNewestId(null), 600);
    }
    prevCountRef.current = items.length;
  }, [items]);

  if (items.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIconBox}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
            d="M2 8l10-5 10 5v10l-10 5L2 18V8z"
            fill="#4a4a54"
            fillOpacity="0.15"
            stroke="#4a4a54"
            strokeWidth="1.4"
            strokeLinejoin="round"
            />
            <path
            d="M12 3v19"
            stroke="#4a4a54"
            strokeWidth="1.2"
            strokeLinecap="round"
            />
            <path
            d="M2 8l10 5 10-5"
            stroke="#4a4a54"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            />
            <line x1="7" y1="5.5" x2="17" y2="10.5" stroke="#4a4a54" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </svg>
        </div>
        <span style={styles.emptyTitle}>No items scanned</span>
        <span style={styles.emptySub}>Scan a barcode or type a product name below</span>
      </div>
    );
  }

  return (
    <div ref={listRef} style={styles.list}>
      <div style={styles.listLabel}>
        {items.length} item{items.length !== 1 ? "s" : ""} in cart
      </div>
      {items.map((item) => (
        <ScannedItem
          key={item.product.id}
          item={item}
          isNew={newestId === item.product.id}
          onAdd={() => onAdd(item.product.id)}
          onRemove={() => onRemove(item.product.id)}
        />
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  list: {
    flex: 1,
    overflowY: "auto",
    backgroundColor: "#0d0d0f",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: "12px",
  },
  listLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: "#3a3a42",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    paddingBottom: 4,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  empty: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0d0d0f",
  },
  emptyIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#141416",
    border: "1px solid #222228",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#4a4a54",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  emptySub: {
    fontSize: 12,
    color: "#2a2a32",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
    textAlign: "center",
    maxWidth: 200,
  },
};