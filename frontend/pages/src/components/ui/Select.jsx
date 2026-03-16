export default function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom:16 }}>
      {label && <label style={{ display:"block", fontSize:13, fontWeight:600, color:"var(--text-2)", marginBottom:6 }}>{label}</label>}
      <select {...props} style={{ width:"100%", background:"var(--bg)", border:"1.5px solid var(--border)",
        borderRadius:10, padding:"12px 16px", color:"var(--text)", fontSize:14,
        fontFamily:"var(--font)", outline:"none", cursor:"pointer", appearance:"none" }}>
        {children}
      </select>
    </div>
  );
}
