import Icon from "./Icon.jsx";

export default function Modal({ title, children, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position:       "fixed",
        inset:          0,
        background:     "rgba(0,0,0,.75)",
        zIndex:         1000,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background:   "var(--surface)",
          border:       "1px solid var(--border)",
          borderTop:    "1px solid var(--gold)",
          borderRadius: 20,
          padding:      32,
          width:        "100%",
          maxWidth:     440,
          animation:    "fadeUp .25s ease",
          boxShadow:    "0 24px 80px rgba(0,0,0,.6)",
          margin:       "0 16px",
        }}
      >
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            marginBottom:   24,
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize:   22,
              fontWeight: 600,
              color:      "var(--gold2)",
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border:     "none",
              color:      "var(--muted)",
              cursor:     "pointer",
            }}
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
