export default function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display:       "block",
            fontSize:      11,
            color:         "var(--muted)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom:  6,
          }}
        >
          {label}
        </label>
      )}
      <select
        {...props}
        style={{
          width:        "100%",
          background:   "var(--bg)",
          border:       "1px solid var(--border)",
          borderRadius: 10,
          padding:      "12px 14px",
          color:        "var(--text)",
          fontSize:     13,
          fontFamily:   "var(--font-mono)",
          outline:      "none",
          cursor:       "pointer",
          appearance:   "none",
        }}
      >
        {children}
      </select>
    </div>
  );
}
