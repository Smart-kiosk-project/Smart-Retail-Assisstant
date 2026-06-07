import { useState, useCallback, useEffect } from "react";
import { useCart } from "../features/billing/hooks/useCart";
import { PRODUCTS } from "../features/billing/data/products";
import ScannedList from "../features/billing/components/ScannedList";
import SearchScanner from "../features/billing/components/SearchScanner";
import CartSummary from "../features/billing/components/CartSummary";
import WeightInputModal from "../features/billing/components/WeightInputModel";
import Toast from "../features/billing/components/Toast";
import type { ToastMessage } from "../features/billing/components/Toast";
import type { Product } from "../features/billing/types";

export default function BillingPage() {
  const { items, subtotal, discount, total, addItem, addItemByWeight, removeItem, clearCart } = useCart();
  const [weightProduct, setWeightProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const t = new Date();
      setClock(
        t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })
      );
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2800);
  }, []);

  const handleScan = (value: string) => {
    const found = PRODUCTS.find(
      (p) => p.barcode === value || p.name.toLowerCase().includes(value.toLowerCase())
    );
    if (!found) { showToast(`"${value}" not found`, "error"); return; }
    if (found.unit === "kg") {
      setWeightProduct(found);
    } else {
      addItem(found);
      showToast(`${found.name} added`, "success");
    }
  };

  const handleWeightConfirm = (weight: number) => {
    if (weightProduct) {
      addItemByWeight(weightProduct, weight);
      showToast(`${weightProduct.name} — ${weight} kg added`, "success");
      setWeightProduct(null);
    }
  };

  const handleAddById = (productId: number) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    if (product.unit === "kg") {
      setWeightProduct(product);
    } else {
      addItem(product);
      showToast(`${product.name} added`, "success");
    }
  };

  const handlePay = () => {
    showToast(`Payment of ₹${total} successful!`, "success");
    setTimeout(() => clearCart(), 1000);
  };

  const handleClear = () => {
    clearCart();
    showToast("Cart cleared", "error");
  };

  const itemCount = items.length;

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoBox}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Bag body */}
              <path
                d="M3.5 6.5h11l-1.2 7.5a1 1 0 01-.99.85H5.69a1 1 0 01-.99-.85L3.5 6.5z"
                fill="#4a4a54"
                fillOpacity="0.25"
                stroke="#4a4a54"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Handle */}
              <path
                d="M6.5 6.5V5a2.5 2.5 0 015 0v1.5"
                stroke="#4a4a54"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              {/* Scan lines */}
              <line x1="6.5" y1="10" x2="11.5" y2="10" stroke="#4a4a54" strokeWidth="1" strokeLinecap="round" />
              <line x1="7.5" y1="12" x2="10.5" y2="12" stroke="#4a4a54" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          <div style={{ textAlign: "left"}}>
            <div style={{ ...styles.headerTitle, paddingTop: 5 }}>Self Checkout</div>
            <div style={{ ...styles.headerSub, marginTop: -8 }}>Scan barcode or enter product name</div>
          </div>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.statusPill}>
            <span style={styles.statusDot} />
            <span style={styles.statusText}>Session active</span>
          </div>
          <span style={styles.terminalBadge}>Terminal 03</span>
          <span style={styles.clock}>{clock}</span>
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        <div style={styles.leftPanel}>
          <ScannedList items={items} onAdd={handleAddById} onRemove={removeItem} />
          <SearchScanner onScan={handleScan} />
        </div>

        <div style={styles.rightPanel}>
          <CartSummary
            itemCount={itemCount}
            subtotal={subtotal}
            discount={discount}
            total={total}
            onPay={handlePay}
            onClear={handleClear}
          />
        </div>
      </div>

      {weightProduct && (
        <WeightInputModal
          product={weightProduct}
          onConfirm={handleWeightConfirm}
          onCancel={() => setWeightProduct(null)}
        />
      )}

      <Toast toasts={toasts} />

      <style>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#0d0d0f",
    overflow: "hidden",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    height: 52,
    backgroundColor: "#141416",
    borderBottom: "1px solid #222228",
    flexShrink: 0,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  logoBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#1e1e24",
    border: "1px solid #2a2a2e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
  },

  headerTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#e8e8ec",
    letterSpacing: "-0.2px",
  },
  headerSub: {
    fontSize: 11,
    color: "#4a4a54",
    marginTop: 1,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  statusPill: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#1a2a1e",
    border: "1px solid #2d4a32",
    borderRadius: 20,
    padding: "4px 10px",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    backgroundColor: "#3db85a",
    display: "inline-block",
    animation: "statusPulse 2s ease-in-out infinite",
  },
  statusText: {
    fontSize: 11,
    fontWeight: 600,
    color: "#3db85a",
  },
  terminalBadge: {
    fontSize: 11,
    color: "#4a4a54",
    backgroundColor: "#1e1e22",
    border: "1px solid #2a2a2e",
    borderRadius: 6,
    padding: "3px 8px",
  },
  clock: {
    fontSize: 13,
    color: "#6b6b72",
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "0.02em",
  },
  body: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  leftPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  rightPanel: {
    width: 300,
    backgroundColor: "#141416",
    borderLeft: "1px solid #222228",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
};