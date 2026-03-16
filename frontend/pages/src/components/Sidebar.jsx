import { Icon } from "./ui/index.js";

const NAV_ITEMS = [
  { id: "cards",    label: "Мои карты",  icon: "card" },
  { id: "transfer", label: "Переводы",   icon: "send" },
];

export default function Sidebar({ activeTab, username, isAdmin, onTabChange, onLogout }) {
  return (
    <aside
      style={{
        width:          240,
        background:     "var(--surface)",
        borderRight:    "1px solid var(--border)",
        display:        "flex",
        flexDirection:  "column",
        padding:        "28px 16px",
        position:       "sticky",
        top:            0,
        height:         "100vh",
        flexShrink:     0,
      }}
    >
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:40, paddingLeft:8 }}>
        <div
          style={{
            width:        36,
            height:       36,
            background:   "linear-gradient(135deg, var(--gold), #8a6520)",
            borderRadius: 10,
            display:      "flex",
            alignItems:   "center",
            justifyContent:"center",
            boxShadow:    "0 4px 16px var(--gold-glow)",
          }}
        >
          <Icon name="card" size={16} color="#080c14" />
        </div>
        <div>
          <div style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:600, color:"var(--gold2)", lineHeight:1 }}>VAULT</div>
          <div style={{ fontSize:9, color:"var(--muted)", letterSpacing:"0.15em" }}>BANKING</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display:"flex", flexDirection:"column", gap:4 }}>
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display:        "flex",
                alignItems:     "center",
                gap:            12,
                padding:        "12px 14px",
                borderRadius:   12,
                border:         "none",
                borderLeft:     active ? "2px solid var(--gold)" : "2px solid transparent",
                background:     active ? "var(--gold-glow)" : "transparent",
                color:          active ? "var(--gold)"      : "var(--muted)",
                cursor:         "pointer",
                fontSize:       13,
                fontFamily:     "var(--font-mono)",
                letterSpacing:  "0.04em",
                transition:     "all .2s",
                fontWeight:     active ? 700 : 400,
                textAlign:      "left",
              }}
            >
              <Icon name={item.icon} size={16} color={active ? "var(--gold)" : "var(--muted)"} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ marginTop:"auto" }}>
        <div
          style={{
            padding:      "12px 14px",
            borderRadius: 12,
            background:   "var(--bg)",
            border:       "1px solid var(--border)",
            marginBottom: 8,
          }}
        >
          <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:"0.1em", marginBottom:4 }}>ПОЛЬЗОВАТЕЛЬ</div>
          <div style={{ fontSize:13, color:"var(--text)", display:"flex", alignItems:"center", gap:8 }}>
            <Icon name="user" size={14} color="var(--gold)" />
            {username}
          </div>
          {isAdmin && (
            <div style={{ marginTop:6, fontSize:10, color:"var(--gold)", letterSpacing:"0.1em", background:"rgba(201,168,76,.1)", padding:"2px 6px", borderRadius:4, display:"inline-block" }}>
              ADMIN
            </div>
          )}
        </div>

        <button
          onClick={onLogout}
          style={{
            display:     "flex",
            alignItems:  "center",
            gap:         10,
            width:       "100%",
            padding:     "11px 14px",
            background:  "none",
            border:      "none",
            color:       "var(--muted)",
            cursor:      "pointer",
            borderRadius: 10,
            fontSize:    12,
            fontFamily:  "var(--font-mono)",
            transition:  "color .2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--danger)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
        >
          <Icon name="logout" size={15} />
          Выйти
        </button>
      </div>
    </aside>
  );
}
