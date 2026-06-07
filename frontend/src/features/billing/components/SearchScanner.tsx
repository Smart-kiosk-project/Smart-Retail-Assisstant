import { useRef } from "react";

interface Props {
  onScan: (value: string) => void;
}

export default function SearchScanner({ onScan }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const value = inputRef.current?.value.trim() ?? "";
    if (!value) return;
    onScan(value);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <style>{`
        @keyframes scanPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .scan-input-field::placeholder { color: #3a3a46; }
        .scan-input-field:focus { outline: none; }
        .scan-add-btn:hover { background-color: #185FA5 !important; }
        .scan-add-btn:active { transform: scale(0.97); }
      `}</style>

      <form style={styles.wrapper} onSubmit={handleSubmit}>
        {/* Status indicator */}
        <div style={styles.statusGroup}>
          <span style={styles.dot} />
          <span style={styles.statusLabel}>Ready</span>
        </div>

        {/* Input */}
        <div style={styles.inputWrap}>
          <span style={styles.scanIcon}>▦</span>
          <input
            ref={inputRef}
            className="scan-input-field"
            style={styles.input}
            type="text"
            placeholder="Barcode or product name..."
            autoFocus
            autoComplete="off"
          />
        </div>

        <button type="submit" className="scan-add-btn" style={styles.addBtn}>
          Add
        </button>
      </form>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
    backgroundColor: "#141416",
    borderTop: "1px solid #222228",
    flexShrink: 0,
  },
  statusGroup: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    flexShrink: 0,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    backgroundColor: "#3db85a",
    display: "inline-block",
    boxShadow: "none",
    animation: "scanPulse 1.4s ease-in-out infinite",
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#3db85a",
    whiteSpace: "nowrap",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  inputWrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1e1e24",
    border: "1px solid #2a2a2e",
    borderRadius: 8,
    padding: "0 12px",
    height: 36,
  },
  scanIcon: {
    fontSize: 15,
    color: "#4a4a54",
    userSelect: "none",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: 13,
    color: "#c8c8d0",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
    padding: "0",
    height: "100%",
  },
  addBtn: {
    height: 36,
    padding: "0 16px",
    backgroundColor: "#378ADD",
    color: "#ffffff",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    flexShrink: 0,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
    transition: "background-color 0.15s ease",
  },
};