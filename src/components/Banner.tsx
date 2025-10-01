import { useEffect, useState } from "react";

type Props = {
  message?: string | null;
  onClose?: () => void;
  autoMs?: number;
};

export default function Banner({ message, onClose, autoMs = 4000 }: Props) {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    setVisible(Boolean(message));
  }, [message]);

  useEffect(() => {
    if (!message || autoMs <= 0) return;
    const t = setTimeout(() => setVisible(false), autoMs);
    return () => clearTimeout(t);
  }, [message, autoMs]);

  useEffect(() => {
    if (!visible && message) {
      const t = setTimeout(() => onClose?.(), 300); 
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
