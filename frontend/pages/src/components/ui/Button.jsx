import Spinner from "./Spinner.jsx";

const VARIANTS = {
  primary: { background:"var(--primary)", color:"#fff", border:"none", boxShadow:"0 4px 15px var(--primary-glow)" },
  outline: { background:"transparent", border:"1.5px solid var(--primary)", color:"var(--primary)" },
  ghost:   { background:"var(--primary-lt)", border:"none", color:"var(--primary)" },
  danger:  { background:"var(--danger-lt)", border:"1.5px solid var(--danger)", color:"var(--danger)" },
  soft:    { background:"var(--bg)", border:"1.5px solid var(--border)", color:"var(--text-2)" },
};

export default function Button({ children, variant="primary", loading=false, icon=null, fullWidth=false, style:extra={}, ...props }) {
  return (
    <button {...props} disabled={loading||props.disabled}
      style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8,
        padding:"11px 22px", borderRadius: "var(--radius-sm, 10px)", cursor: loading?"wait":"pointer",
        fontSize:14, fontWeight:600, fontFamily:"var(--font)", transition:"all .2s",
        width:fullWidth?"100%":undefined, opacity:(loading||props.disabled)?0.6:1,
        letterSpacing:"0.01em", ...VARIANTS[variant], ...extra }}
      onMouseEnter={e => { if (!loading && !props.disabled) e.currentTarget.style.filter="brightness(1.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.filter=""; }}>
      {loading ? <Spinner size={15}/> : icon}
      {children}
    </button>
  );
}
