import { useState } from "react";
import { Icon } from "./ui/index.js";

export default function TopBar({ title, subtitle }) {
  const [search, setSearch] = useState("");
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
      marginBottom:28, flexWrap:"wrap", gap:16 }}>
      <div>
        <h1 style={{ fontSize:24, fontWeight:800, color:"var(--text)", letterSpacing:"-0.02em" }}>{title}</h1>
        {subtitle && <p style={{ fontSize:13, color:"var(--text-2)", marginTop:2 }}>{subtitle}</p>}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        {/* Search */}
        <div style={{ display:"flex", alignItems:"center", gap:10, background:"#fff",
          border:"1.5px solid var(--border)", borderRadius:12, padding:"10px 16px",
          minWidth:220 }}>
          <Icon name="search" size={16} color="var(--text-3)"/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search..." style={{ border:"none", outline:"none", fontSize:13,
              color:"var(--text)", background:"transparent", fontFamily:"var(--font)", width:"100%" }}/>
        </div>
        <button style={{ width:42, height:42, borderRadius:12, border:"1.5px solid var(--border)",
          background:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", position:"relative", flexShrink:0 }}>
          <Icon name="bell" size={18} color="var(--text-2)"/>
          <span style={{ position:"absolute", top:8, right:8, width:8, height:8,
            background:"var(--danger)", borderRadius:"50%", border:"2px solid #fff" }}/>
        </button>
        {/* Settings */}
        <button style={{ width:42, height:42, borderRadius:12, border:"1.5px solid var(--border)",
          background:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", flexShrink:0 }}>
          <Icon name="settings" size={18} color="var(--text-2)"/>
        </button>
      </div>
    </div>
  );
}
