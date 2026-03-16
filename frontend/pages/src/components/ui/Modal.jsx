import Icon from "./Icon.jsx";
export default function Modal({ title, children, onClose }) {
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(30,42,74,0.4)",
      zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:20, padding:32,
        width:"100%", maxWidth:460, animation:"fadeUp .25s ease", boxShadow:"0 24px 80px rgba(45,96,255,.15)",
        margin:"0 16px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
          <h3 style={{ fontSize:18, fontWeight:700, color:"var(--text)" }}>{title}</h3>
          <button onClick={onClose} style={{ background:"var(--bg)", border:"none", borderRadius:8,
            width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <Icon name="x" size={16} color="var(--text-2)"/>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
