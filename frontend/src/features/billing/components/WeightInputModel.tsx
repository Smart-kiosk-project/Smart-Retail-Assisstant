import { useState } from "react";
import type { Product } from "../types";
import { CATEGORY_COLORS } from "../data/products";
import { Apple, Carrot, Milk, Croissant, Wheat, Cookie, GlassWater, Droplets } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Fruits:     <Apple size={22} color="#34c759" />,
  Vegetables: <Carrot size={22} color="#30d158" />,
  Dairy:      <Milk size={22} color="#007aff" />,
  Bakery:     <Croissant size={22} color="#ff9500" />,
  Staples:    <Wheat size={22} color="#af52de" />,
  Snacks:     <Cookie size={22} color="#ff2d55" />,
  Drinks:     <GlassWater size={22} color="#5ac8fa" />,
  Oils:       <Droplets size={22} color="#ffcc00" />,
};


interface Props {
  product: Product;
  onConfirm: (weight: number) => void;
  onCancel: () => void;
}

export default function WeightInputModal({ product, onConfirm, onCancel }: Props) {
  const [weight, setWeight] = useState("");
  const categoryColor = CATEGORY_COLORS[product.category] ?? "#378ADD";
  const parsed = parseFloat(weight);
  const isValid = !isNaN(parsed) && parsed > 0;
  const total = isValid ? Math.round(parsed * product.price) : 0;

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm(parsed);
  };

  const quickWeights = [0.25, 0.5, 0.75, 1, 1.5, 2];

  return (
    <>
      <style>{`
        .weight-input-field:focus { outline: none; }
        .weight-input-field::placeholder { color: #3a3a46; }
        .quick-btn:hover { border-color: #378ADD !important; color: #378ADD !important; }
        .confirm-btn-active:hover { background-color: #185FA5 !important; }
        .cancel-btn-inner:hover { background-color: #222228 !important; }
      `}</style>

      {/* Dark overlay */}
      <div style={styles.overlay} onClick={onCancel}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

          {/* Product row */}
          <div style={styles.productRow}>
            <div
              style={{
                ...styles.iconBox,
                backgroundColor: categoryColor + "18",
                border: `1px solid ${categoryColor}30`,
              }}
            >
              {CATEGORY_ICONS[product.category]}
            </div>
            <div style={styles.productInfo}>
              <span style={styles.productName}>{product.name}</span>
              <span style={{ ...styles.priceTag, color: categoryColor }}>
                ₹{product.price} / kg
              </span>
            </div>
          </div>

          <div style={styles.divider} />

          {/* Title */}
          <div>
            <div style={styles.modalTitle}>Enter weight</div>
            <div style={styles.modalSubtitle}>How many kilograms?</div>
          </div>

          {/* Weight input */}
          <div style={styles.inputWrap}>
            <input
              className="weight-input-field"
              style={styles.input}
              type="number"
              placeholder="0.00"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              autoFocus
              min="0"
              step="0.01"
            />
            <span style={styles.unit}>kg</span>
          </div>

          {/* Quick weights */}
          <div style={styles.quickGrid}>
            {quickWeights.map((w) => (
              <button
                key={w}
                className="quick-btn"
                style={{
                  ...styles.quickBtn,
                  ...(parseFloat(weight) === w ? styles.quickBtnActive : {}),
                }}
                onClick={() => setWeight(w.toString())}
              >
                {w} kg
              </button>
            ))}
          </div>

          {/* Price preview */}
          {isValid && (
            <div style={styles.pricePreview}>
              <span style={styles.previewLabel}>Total for {parsed} kg</span>
              <span style={styles.previewAmount}>₹{total}</span>
            </div>
          )}

          <div style={styles.divider} />

          {/* Buttons */}
          <div style={styles.btnRow}>
            <button
              className="cancel-btn-inner"
              style={styles.cancelBtn}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className={isValid ? "confirm-btn-active" : ""}
              style={{
                ...styles.confirmBtn,
                ...(isValid ? {} : styles.confirmBtnDisabled),
              }}
              onClick={handleConfirm}
              disabled={!isValid}
            >
              Add to cart
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    backgroundColor: "#141416",
    border: "1px solid #2a2a2e",
    borderRadius: 16,
    padding: "22px",
    width: 340,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  productRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  emoji: {
    fontSize: 24,
    lineHeight: 1,
  },
  productInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  productName: {
    fontSize: 15,
    fontWeight: 700,
    color: "#e8e8ec",
    letterSpacing: "-0.2px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
  },
  priceTag: {
    fontSize: 12,
    fontWeight: 600,
  },
  divider: {
    height: 1,
    backgroundColor: "#222228",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: "#e8e8ec",
    letterSpacing: "-0.2px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
  },
  modalSubtitle: {
    fontSize: 12,
    color: "#4a4a54",
    marginTop: 2,
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1e1e24",
    border: "1px solid #2a2a2e",
    borderRadius: 10,
    padding: "0 16px",
    gap: 8,
  },
  input: {
    flex: 1,
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: 26,
    fontWeight: 700,
    color: "#e8e8ec",
    padding: "12px 0",
    letterSpacing: "-0.5px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
    fontVariantNumeric: "tabular-nums",
  },
  unit: {
    fontSize: 16,
    fontWeight: 600,
    color: "#4a4a54",
  },
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 6,
  },
  quickBtn: {
    padding: "9px 0",
    backgroundColor: "#1e1e24",
    border: "1px solid #2a2a2e",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    color: "#6b6b72",
    cursor: "pointer",
    transition: "border-color 0.15s ease, color 0.15s ease",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  quickBtnActive: {
    borderColor: "#378ADD",
    color: "#378ADD",
  },
  pricePreview: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a2a3a",
    border: "1px solid #1e3a52",
    borderRadius: 10,
    padding: "11px 14px",
  },
  previewLabel: {
    fontSize: 12,
    color: "#6b9fc8",
  },
  previewAmount: {
    fontSize: 17,
    fontWeight: 700,
    color: "#e8e8ec",
    letterSpacing: "-0.3px",
    fontVariantNumeric: "tabular-nums",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
  },
  btnRow: {
    display: "flex",
    gap: 8,
  },
  cancelBtn: {
    flex: 1,
    padding: "13px",
    backgroundColor: "#1e1e24",
    border: "1px solid #2a2a2e",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    color: "#6b6b72",
    cursor: "pointer",
    transition: "background-color 0.15s ease",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  confirmBtn: {
    flex: 2,
    padding: "13px",
    backgroundColor: "#378ADD",
    border: "none",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    color: "#ffffff",
    cursor: "pointer",
    transition: "background-color 0.15s ease",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  confirmBtnDisabled: {
    backgroundColor: "#1e1e24",
    color: "#3a3a42",
    cursor: "not-allowed",
  },
};