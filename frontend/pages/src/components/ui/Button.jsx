import Spinner from "./Spinner.jsx";

const VARIANTS = {
  primary: {
    background: "linear-gradient(135deg, var(--gold), #a8752a)",
    color:      "#080c14",
    fontWeight: 700,
    border:     "none",
  },
  outline: {
    background: "transparent",
    border:     "1px solid var(--gold)",
    color:      "var(--gold)",
  },
  ghost: {
    background: "rgba(255,255,255,.05)",
    border:     "1px solid var(--border)",
    color:      "var(--text)",
  },
  danger: {
    background: "rgba(239,68,68,.1)",
    border:     "1px solid var(--danger)",
    color:      "var(--danger)",
  },
};

export default function Button({
  children,
  variant  = "primary",
  loading  = false,
  icon     = null,
  fullWidth = false,
  style: extra = {},
  ...props
}) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        justifyContent: "center",
        gap:            8,
        padding:        "11px 20px",
        borderRadius:   10,
        cursor:         loading ? "wait" : "pointer",
        fontSize:       13,
        letterSpacing:  "0.04em",
        transition:     "all .2s",
        fontFamily:     "var(--font-mono)",
        width:          fullWidth ? "100%" : undefined,
        opacity:        loading || props.disabled ? 0.6 : 1,
        ...VARIANTS[variant],
        ...extra,
      }}
    >
      {loading ? <Spinner size={15} /> : icon}
      {children}
    </button>
  );
}
