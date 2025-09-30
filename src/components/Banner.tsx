import { useEffect, useState } from "react";

type Props = {
  message?: string | null;
  onClose?: () => void;
  /** milliseconds to auto-dismiss (default: 4000). Set 0 to disable */
  autoMs?: number;
};

export default function Banner({ message, onClose, autoMs = 4000 }: Props) {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    setVisible(Boolean(message));
  }, [message]);

  // Auto-dismiss after autoMs
  useEffect(() => {
    if (!message || autoMs <= 0) return;
    const t = setTimeout(() => setVisible(false), autoMs);
    return () => clearTimeout(t);
  }, [message, autoMs]);

  // After fade-out, call onClose to actually unmount (clear parent state)
  useEffect(() => {
    if (!visible && message) {
      const t = setTimeout(() => onClose?.(), 300); // match CSS transition
      return () => clearTimeout(t);
    }
  }, [visible, message, onClose]);

  if (!message) return null;

  return (
    <div
      className="banner"
      role="status"
      aria-live="polite"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-6px)",
        transition: "opacity .3s ease, transform .3s ease",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span>{message}</span>
      <button
        aria-label="Dismiss"
        onClick={() => setVisible(false)}
        className="btn btn-ghost"
        style={{
          marginLeft: "auto",
          padding: "4px 8px",
          lineHeight: 1,
          borderRadius: 8,
        }}
      >
        ×
      </button>
    </div>
  );
}
