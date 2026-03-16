import { useEffect } from "react";
import Icon from "./Icon.jsx";

const TYPE_COLOR = {
  success: "var(--success)",
  error:   "var(--danger)",
  info:    "var(--gold)",
};

export default function Toast({ msg, type = "info", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const color = TYPE_COLOR[type] ?? TYPE_COLOR.info;

  return (
    <div
      style={{
        position:   "fixed",
        bottom:     32,
        right:      32,
        zIndex:     9999,
        background: "var(--surface2)",
        border:     `1px solid ${color}`,
        borderRadius: 12,
        padding:    "14px 18px",
        display:    "flex",
        alignItems: "center",
        gap:        12,
        animation:  "fadeUp .3s ease",
        boxShadow:  "0 8px 32px rgba(0,0,0,.5)",
        maxWidth:   360,
        minWidth:   220,
      }}
    >
      <span style={{ color, fontSize: 13, flex: 1 }}>{msg}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border:     "none",
          color:      "var(--muted)",
          cursor:     "pointer",
          padding:    2,
        }}
      >
        <Icon name="x" size={14} />
      </button>
    </div>
  );
}
