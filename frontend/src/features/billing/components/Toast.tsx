import { useEffect, useState } from "react";

export type ToastType = "success" | "error";

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface Props {
  toasts: ToastMessage[];
}

export default function Toast({ toasts }: Props) {
  return (
    <div style={styles.wrapper}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: ToastMessage }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const isSuccess = toast.type === "success";

  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { transform: translateY(-12px) translateX(-50%); opacity: 0; }
          to   { transform: translateY(0) translateX(-50%);     opacity: 1; }
        }
        @keyframes progressShrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
      <div
        style={{
          ...styles.toast,
          borderColor: isSuccess ? "#2d4a32" : "#3a1e1e",
          animation: visible
            ? "toastIn 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards"
            : "none",
        }}
      >
        <div
          style={{
            ...styles.iconBox,
            backgroundColor: isSuccess ? "#1a2a1e" : "#2a1a1a",
          }}
        >
          <span style={{ ...styles.iconChar, color: isSuccess ? "#3db85a" : "#d9534f" }}>
            {isSuccess ? "✓" : "✕"}
          </span>
        </div>
        <span style={styles.message}>{toast.message}</span>
        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressBar,
              backgroundColor: isSuccess ? "#3db85a" : "#d9534f",
              animation: "progressShrink 2.5s linear forwards",
            }}
          />
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: "fixed",
    top: 62,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    zIndex: 999,
    pointerEvents: "none",
    minWidth: 260,
  },
  toast: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    backgroundColor: "#1e1e24",
    border: "1px solid",
    borderRadius: 12,
    position: "relative",
    overflow: "hidden",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  iconBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconChar: {
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1,
  },
  message: {
    fontSize: 13,
    fontWeight: 500,
    color: "#c8c8d0",
    letterSpacing: "-0.1px",
  },
  progressTrack: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  progressBar: {
    height: "100%",
  },
};