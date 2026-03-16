import { useState } from "react";

export default function Input({ label, style: extra = {}, ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display:       "block",
            fontSize:      11,
            color:         focused ? "var(--gold)" : "var(--muted)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom:  6,
            transition:    "color .2s",
          }}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e)  => { setFocused(false); props.onBlur?.(e); }}
        style={{
          width:       "100%",
          background:  "var(--bg)",
          border:      `1px solid ${focused ? "var(--gold)" : "var(--border)"}`,
          borderRadius: 10,
          padding:     "12px 14px",
          color:       "var(--text)",
          fontSize:    13,
          fontFamily:  "var(--font-mono)",
          outline:     "none",
          transition:  "border-color .2s",
          ...extra,
        }}
      />
    </div>
  );
}
