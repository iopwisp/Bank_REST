import TopBar from "../components/TopBar.jsx";
import { Icon } from "../components/ui/index.js";

const MOCK = [
  { id:1,  name:"Spotify Subscription", date:"28 Jan, 12:30 AM", amount:-2500,  icon:"🎵", cat:"Entertainment" },
  { id:2,  name:"Freelance Payment",     date:"27 Jan, 10:00 PM", amount:+7500,  icon:"💼", cat:"Income" },
  { id:3,  name:"Mobile Service",        date:"25 Jan, 04:40 PM", amount:-1500,  icon:"📱", cat:"Bills" },
  { id:4,  name:"Transfer Received",     date:"22 Jan, 11:20 AM", amount:+32000, icon:"↓",  cat:"Transfer" },
  { id:5,  name:"Netflix",               date:"20 Jan, 09:00 AM", amount:-1990,  icon:"🎬", cat:"Entertainment" },
  { id:6,  name:"Salary",                date:"15 Jan, 09:00 AM", amount:+180000,icon:"💰", cat:"Income" },
  { id:7,  name:"Groceries",             date:"12 Jan, 06:30 PM", amount:-4200,  icon:"🛒", cat:"Shopping" },
  { id:8,  name:"Electricity Bill",      date:"10 Jan, 02:00 PM", amount:-2800,  icon:"⚡", cat:"Bills" },
];

const TABS = ["All Transactions","Income","Expense"];

export default function TransactionsPage() {
  return (
    <div style={{ animation:"fadeUp .4s ease" }}>
      <TopBar title="Transactions" subtitle="Your full activity history"/>

      <div style={{ background:"#fff", borderRadius:20, border:"1.5px solid var(--border)",
        boxShadow:"var(--shadow-sm)", overflow:"hidden" }}>
        {/* Tabs */}
        <div style={{ display:"flex", borderBottom:"1.5px solid var(--border)", padding:"0 24px" }}>
          {TABS.map((t,i)=>(
            <button key={t} style={{ padding:"16px 20px 14px", border:"none", background:"none",
              fontSize:14, fontWeight:i===0?700:500, cursor:"pointer", fontFamily:"var(--font)",
              color:i===0?"var(--primary)":"var(--text-2)",
              borderBottom:i===0?"2.5px solid var(--primary)":"2.5px solid transparent",
              transition:"all .2s" }}>
              {t}
            </button>
          ))}
          <div style={{ marginLeft:"auto", padding:"12px 0", display:"flex", alignItems:"center" }}>
            <button style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
              border:"1.5px solid var(--border)", borderRadius:10, background:"var(--bg)",
              fontSize:12, fontWeight:600, cursor:"pointer", color:"var(--text-2)", fontFamily:"var(--font)" }}>
              <Icon name="refresh" size={13}/> Export
            </button>
          </div>
        </div>

        {/* Table header */}
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 120px", gap:16,
          padding:"12px 24px", background:"var(--bg)", borderBottom:"1.5px solid var(--border)" }}>
          {["Description","Category","Date","Amount"].map(h=>(
            <div key={h} style={{ fontSize:11, fontWeight:700, color:"var(--text-3)", letterSpacing:"0.06em" }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {MOCK.map((tx,i)=>(
          <div key={tx.id} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 120px", gap:16,
            padding:"16px 24px", borderBottom:"1.5px solid var(--border)",
            transition:"background .15s", cursor:"pointer",
            background: i%2===0?"#fff":"rgba(245,247,250,.5)" }}
            onMouseEnter={e=>e.currentTarget.style.background="var(--primary-lt)"}
            onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"#fff":"rgba(245,247,250,.5)"}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"var(--primary-lt)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                {tx.icon}
              </div>
              <span style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{tx.name}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center" }}>
              <span style={{ fontSize:12, fontWeight:600, padding:"4px 10px", borderRadius:20,
                background:"var(--bg)", color:"var(--text-2)", border:"1.5px solid var(--border)" }}>
                {tx.cat}
              </span>
            </div>
            <div style={{ fontSize:13, color:"var(--text-2)", display:"flex", alignItems:"center" }}>{tx.date}</div>
            <div style={{ fontSize:14, fontWeight:700, display:"flex", alignItems:"center",
              color:tx.amount>0?"var(--success)":"var(--danger)" }}>
              {tx.amount>0?"+":""}{(tx.amount/100).toLocaleString("en-US",{style:"currency",currency:"USD"})}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"14px 24px", background:"#fff" }}>
          <span style={{ fontSize:13, color:"var(--text-3)" }}>Showing {MOCK.length} transactions</span>
          <div style={{ display:"flex", gap:6 }}>
            {["‹","1","2","3","4","›"].map((p,i)=>(
              <button key={i} style={{ width:32, height:32, borderRadius:8,
                border:"1.5px solid "+(p==="1"?"var(--primary)":"var(--border)"),
                background:p==="1"?"var(--primary)":"#fff",
                color:p==="1"?"#fff":"var(--text-2)", fontSize:13, fontWeight:600,
                cursor:"pointer", fontFamily:"var(--font)" }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
