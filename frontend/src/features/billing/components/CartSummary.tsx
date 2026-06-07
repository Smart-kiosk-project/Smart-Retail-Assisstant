import { useEffect, useRef, useState } from "react";
import { DISCOUNT_PERCENT } from "../data/products";

interface Props {
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  onPay: () => void;
  onClear: () => void;
}

// Smoothly counts a number up/down from current displayed value to target
function useCountUp(target: number, duration = 400) {
  const [displayed, setDisplayed] = useState(target);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(target);

  useEffect(() => {
    if (target === displayed) return;
    const from = fromRef.current;
    startRef.current = null;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(from + (target - from) * eased);
      setDisplayed(value);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        fromRef.current = target;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target]);

  return displayed;
}

type PaymentMethod = "upi" | "card" | "cash";

const PAYMENT_METHODS: { id: PaymentMethod; label: string; sub: string }[] = [
  { id: "upi",  label: "UPI",  sub: "Instant transfer" },
  { id: "card", label: "Card", sub: "Debit / Credit"   },
  { id: "cash", label: "Cash", sub: "Pay at counter"   },
];

export default function CartSummary({
  itemCount,
  subtotal,
  discount,
  total,
  onPay,
  onClear,
}: Props) {
  const isEmpty = itemCount === 0;

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");

  // Count-up animated values
  const animatedSubtotal = useCountUp(subtotal);
  const animatedDiscount = useCountUp(discount);
  const animatedTotal    = useCountUp(total);

  // Scale bounce on total when it changes
  const [totalBounce, setTotalBounce] = useState(false);
  const prevTotal = useRef(total);
  useEffect(() => {
    if (total !== prevTotal.current) {
      setTotalBounce(true);
      const t = setTimeout(() => setTotalBounce(false), 350);
      prevTotal.current = total;
      return () => clearTimeout(t);
    }
  }, [total]);

  // Pay button success pulse
  const [payPulse, setPayPulse] = useState(false);
  const handlePay = () => {
    if (isEmpty) return;
    setPayPulse(true);
    setTimeout(() => setPayPulse(false), 600);
    onPay();
  };

  return (
    <>
      <style>{`
        @keyframes totalBounce {
          0%   { transform: scale(1); }
          35%  { transform: scale(1.12); }
          65%  { transform: scale(0.96); }
          100% { transform: scale(1); }
        }
        @keyframes paySuccess {
          0%   { box-shadow: 0 0 0 0px rgba(55,138,221,0.6); }
          50%  { box-shadow: 0 0 0 8px rgba(55,138,221,0); }
          100% { box-shadow: 0 0 0 0px rgba(55,138,221,0); }
        }
        .pay-btn-active:hover { background-color: #185FA5 !important; }
        .pay-btn-active:active { transform: scale(0.98); }
        .clear-btn-inner:hover { background-color: #2a1a1a !important; }
        .pm-btn:hover { border-color: #3a3a4e !important; background-color: #1a1a22 !important; }
      `}</style>

      <div style={styles.wrapper}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.title}>Order summary</div>
            <div style={styles.subtitle}>
              {isEmpty
                ? "No items scanned"
                : `${itemCount} product${itemCount !== 1 ? "s" : ""} in cart`}
            </div>
          </div>
          {!isEmpty && (
            <button className="clear-btn-inner" style={styles.clearBtn} onClick={onClear}>
              Clear all
            </button>
          )}
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Empty state */}
        {isEmpty ? (
          <div style={styles.empty}>
            <div style={styles.emptyIconBox}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                d="M6 2H3L1 6v2h1l1.5 10a1 1 0 001 .9h13a1 1 0 001-.9L20 8h1V6l-2-4h-3"
                fill="#4a4a54"
                fillOpacity="0.15"
                stroke="#4a4a54"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                />
                <circle cx="9" cy="21" r="1" fill="#4a4a54" />
                <circle cx="15" cy="21" r="1" fill="#4a4a54" />
                <line x1="6" y1="11" x2="18" y2="11" stroke="#4a4a54" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
                <line x1="7" y1="14" x2="17" y2="14" stroke="#4a4a54" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
            </svg>
            </div>
            <span style={styles.emptyText}>No items yet</span>
            <span style={styles.emptySubtext}>Scan a product to begin</span>
          </div>
        ) : (
          <div style={styles.rows}>
            <div style={styles.row}>
              <span style={styles.rowLabel}>Subtotal</span>
              <span style={styles.rowValue}>₹{animatedSubtotal}</span>
            </div>
            <div style={styles.row}>
              <div style={styles.discountLabel}>
                <span style={styles.discountBadge}>{DISCOUNT_PERCENT}% off</span>
                <span style={styles.rowLabel}>Discount</span>
              </div>
              <span style={styles.discountValue}>− ₹{animatedDiscount}</span>
            </div>
          </div>
        )}

        {/* Total box */}
        <div style={styles.totalBox}>
          <div style={styles.totalLabel}>Total payable</div>
          <div
            style={{
              ...styles.totalAmount,
              animation: totalBounce ? "totalBounce 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none",
              display: "inline-block",
            }}
          >
            ₹{animatedTotal}
          </div>
        </div>

        {/* Payment method selector */}
        <div style={styles.pmSection}>
          <div style={styles.pmLabel}>Payment method</div>
          <div style={styles.pmGrid}>
            {PAYMENT_METHODS.map((m) => {
              const isActive = paymentMethod === m.id;
              return (
                <button
                  key={m.id}
                  className={isActive ? "" : "pm-btn"}
                  style={{
                    ...styles.pmBtn,
                    ...(isActive ? styles.pmBtnActive : {}),
                  }}
                  onClick={() => setPaymentMethod(m.id)}
                >
                  <span style={{ ...styles.pmBtnLabel, color: isActive ? "#e8e8ec" : "#6b6b72" }}>
                    {m.label}
                  </span>
                  <span style={{ ...styles.pmBtnSub, color: isActive ? "#6b9fc8" : "#3a3a42" }}>
                    {m.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pay button */}
        <button
          className={isEmpty ? "" : "pay-btn-active"}
          style={{
            ...styles.payBtn,
            ...(isEmpty ? styles.payBtnDisabled : {}),
            ...(payPulse ? { animation: "paySuccess 0.6s ease-out forwards" } : {}),
          }}
          onClick={handlePay}
          disabled={isEmpty}
        >
          {isEmpty ? (
            <span>Scan items to pay</span>
          ) : (
            <>
              <span>Pay via {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}</span>
              <span style={styles.payBtnAmount}>₹{animatedTotal}</span>
            </>
          )}
        </button>

        {/* Footer */}
        <div style={styles.footer}>🔒 Secure checkout · Taxes included</div>

      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    padding: "18px 16px",
    height: "100%",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: "#e8e8ec",
    letterSpacing: "-0.2px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
  },
  subtitle: {
    fontSize: 11,
    color: "#4a4a54",
    marginTop: 2,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  clearBtn: {
    background: "none",
    border: "1px solid #3a1e1e",
    borderRadius: 6,
    color: "#d9534f",
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 9px",
    cursor: "pointer",
    transition: "background-color 0.15s ease",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  divider: {
    height: 1,
    backgroundColor: "#222228",
  },
  empty: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingBottom: 32,
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#1e1e24",
    border: "1px solid #2a2a2e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyIcon: {
    fontSize: 22,
    lineHeight: 1,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: 600,
    color: "#4a4a54",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  emptySubtext: {
    fontSize: 11,
    color: "#2a2a32",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
    textAlign: "center",
  },
  rows: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: {
    fontSize: 13,
    color: "#6b6b72",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  rowValue: {
    fontSize: 13,
    color: "#c8c8d0",
    fontVariantNumeric: "tabular-nums",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  discountLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  discountBadge: {
    fontSize: 10,
    fontWeight: 700,
    color: "#3db85a",
    backgroundColor: "#1a2a1e",
    border: "1px solid #2d4a32",
    borderRadius: 4,
    padding: "1px 5px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  discountValue: {
    fontSize: 13,
    color: "#3db85a",
    fontVariantNumeric: "tabular-nums",
    fontWeight: 600,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  totalBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0d0d0f",
    border: "1px solid #222228",
    borderRadius: 12,
    padding: "14px 16px",
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 11,
    color: "#4a4a54",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 700,
    color: "#f2f2f3",
    letterSpacing: "-0.8px",
    fontVariantNumeric: "tabular-nums",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
    transformOrigin: "right center",
  },
  payBtn: {
    marginTop: "auto",
    width: "100%",
    padding: "13px 16px",
    backgroundColor: "#378ADD",
    color: "#ffffff",
    border: "none",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "background-color 0.15s ease, transform 0.1s ease",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  payBtnDisabled: {
    backgroundColor: "#1e1e24",
    color: "#3a3a42",
    cursor: "not-allowed",
    justifyContent: "center",
  },
  payBtnAmount: {
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: "-0.3px",
    fontVariantNumeric: "tabular-nums",
  },
  footer: {
    textAlign: "center",
    fontSize: 10,
    color: "#3a3a42",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  pmSection: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  pmLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: "#3a3a42",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  pmGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 6,
  },
  pmBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    padding: "9px 4px",
    backgroundColor: "#141416",
    border: "1px solid #222228",
    borderRadius: 10,
    cursor: "pointer",
    transition: "border-color 0.15s ease, background-color 0.15s ease",
  },
  pmBtnActive: {
    backgroundColor: "#0e2540",
    border: "1px solid #185FA5",
  },
  pmBtnLabel: {
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  pmBtnSub: {
    fontSize: 9,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
    textAlign: "center" as const,
    lineHeight: 1.2,
  },
};