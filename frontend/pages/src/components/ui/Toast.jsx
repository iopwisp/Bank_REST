import { useEffect } from "react";
import Icon from "./Icon.jsx";
const C = { success:"var(--success)", error:"var(--danger)", info:"var(--primary)" };
export default function Toast({ msg, type="info", onClose }) {
  useEffect(() => { const t=setTimeout(onClose,3500); return()=>clearTimeout(t); },[onClose]);
  return (
    <div style={{ position:"fixed", bottom:28, right:28, zIndex:9999, background:"#fff",
      border:`1.5px solid ${C[type]??C.info}`, borderRadius:14, padding:"14px 18px",
      display:"flex", alignItems:"center", gap:12, animation:"fadeUp .3s ease",
      boxShadow:"0 8px 32px rgba(0,0,0,.12)", maxWidth:360, minWidth:220 }}>
      <span style={{ fontSize:13, flex:1, color:"var(--text)", fontWeight:500 }}>{msg}</span>
      <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-3)", padding:2 }}>
        <Icon name="x" size={14}/>
      </button>
    </div>
  );
}
