import { Icon } from "./ui/index.js";

const NAV = [
  { id:"dashboard",    label:"Dashboard",     icon:"dashboard" },
  { id:"cards",        label:"My Cards",      icon:"card" },
  { id:"transfer",     label:"Transfer",      icon:"transfer" },
  { id:"transactions", label:"Transactions",  icon:"transactions" },
  { id:"settings",     label:"Settings",      icon:"settings" },
];

export default function Sidebar({ activeTab, username, isAdmin, onTabChange, onLogout }) {
  return (
    <aside style={{ width:260, background:"#fff", borderRight:"1.5px solid var(--border)",
      display:"flex", flexDirection:"column", height:"100vh", position:"sticky", top:0,
      flexShrink:0, padding:"0" }}>

      {/* Logo */}
      <div style={{ padding:"28px 24px 20px", borderBottom:"1.5px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, background:"var(--primary)", borderRadius:12,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 4px 14px var(--primary-glow)" }}>
            <Icon name="card" size={18} color="#fff" strokeWidth={2}/>
          </div>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:"var(--text)", letterSpacing:"-0.02em" }}>VaultBank</div>
            {isAdmin && <div style={{ fontSize:10, color:"var(--primary)", fontWeight:600, letterSpacing:"0.08em" }}>ADMIN</div>}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"16px 12px", overflowY:"auto" }}>
        <div style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", letterSpacing:"0.1em",
          padding:"8px 12px 4px", marginBottom:4 }}>MENU</div>
        {NAV.map(item => {
          const active = activeTab === item.id;
          return (
            <button key={item.id} onClick={()=>onTabChange(item.id)} style={{
              display:"flex", alignItems:"center", gap:12, width:"100%", padding:"12px 16px",
              borderRadius:12, border:"none", cursor:"pointer", marginBottom:2, textAlign:"left",
              background: active?"var(--primary)":"transparent",
              color: active?"#fff":"var(--text-2)",
              fontWeight: active?700:500, fontSize:14, fontFamily:"var(--font)",
              transition:"all .2s",
            }}
            onMouseEnter={e=>{ if(!active){e.currentTarget.style.background="var(--primary-lt)";e.currentTarget.style.color="var(--primary)";} }}
            onMouseLeave={e=>{ if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--text-2)";} }}>
              <Icon name={item.icon} size={18} color={active?"#fff":"currentColor"} strokeWidth={active?2:1.8}/>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding:"16px 12px", borderTop:"1.5px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px",
          borderRadius:12, background:"var(--bg)", marginBottom:8 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"var(--primary)",
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <span style={{ color:"#fff", fontSize:14, fontWeight:700 }}>
              {(username||"U")[0].toUpperCase()}
            </span>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{username}</div>
            <div style={{ fontSize:11, color:"var(--text-3)" }}>{isAdmin?"Administrator":"User"}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ display:"flex", alignItems:"center", gap:10, width:"100%",
          padding:"10px 14px", background:"none", border:"none", color:"var(--danger)",
          cursor:"pointer", borderRadius:10, fontSize:13, fontWeight:600, fontFamily:"var(--font)",
          transition:"background .2s" }}
          onMouseEnter={e=>e.currentTarget.style.background="var(--danger-lt)"}
          onMouseLeave={e=>e.currentTarget.style.background="none"}>
          <Icon name="logout" size={16} color="var(--danger)"/>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
