import TopBar from "../components/TopBar.jsx";
import BankCard from "../components/BankCard.jsx";
import WeeklyBarChart from "../components/charts/WeeklyBarChart.jsx";
import ExpenseDonut from "../components/charts/ExpenseDonut.jsx";
import BalanceLineChart from "../components/charts/BalanceLineChart.jsx";
import { Icon } from "../components/ui/index.js";

// ── mock transactions (replace with real API data) ────────────────────────
const MOCK_TX = [
  { id:1, name:"Spotify Subscription", date:"28 Jan, 12:30 AM", amount:-2500, icon:"🎵", color:"#2d60ff" },
  { id:2, name:"Freelance Payment",     date:"27 Jan, 10:00 PM", amount:+7500, icon:"💼", color:"#16c784" },
  { id:3, name:"Mobile Service",        date:"25 Jan, 04:40 PM", amount:-1500, icon:"📱", color:"#f8b84e" },
  { id:4, name:"Transfer Received",     date:"22 Jan, 11:20 AM", amount:+3200, icon:"↓",  color:"#16c784" },
  { id:5, name:"Netflix",               date:"20 Jan, 09:00 AM", amount:-1990, icon:"🎬", color:"#f4436c" },
];

const STAT_CARDS = [
  { label:"Total Balance",    value:"12,450 ₸",  change:"+8.2%", up:true,  color:"var(--primary)", bg:"var(--primary-lt)" },
  { label:"Monthly Income",   value:"4,200 ₸",   change:"+12%",  up:true,  color:"var(--success)",  bg:"var(--success-lt)" },
  { label:"Monthly Expenses", value:"2,340 ₸",   change:"-4.1%", up:false, color:"var(--danger)",   bg:"var(--danger-lt)" },
  { label:"Savings",          value:"1,860 ₸",   change:"+6.5%", up:true,  color:"var(--warning)",  bg:"var(--warning-lt)" },
];

function Card({ children, style={} }) {
  return (
    <div style={{ background:"#fff", borderRadius:20, padding:24, boxShadow:"var(--shadow-sm)",
      border:"1.5px solid var(--border)", ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
      <h3 style={{ fontSize:16, fontWeight:700, color:"var(--text)" }}>{children}</h3>
      {action && <button style={{ fontSize:13, fontWeight:600, color:"var(--primary)", background:"none",
        border:"none", cursor:"pointer" }}>{action}</button>}
    </div>
  );
}

export default function DashboardPage({ cards, onTabChange }) {
  const totalBalance = cards.reduce((s,c)=>s+Number(c.balance||0),0);

  return (
    <div style={{ animation:"fadeUp .4s ease" }}>
      <TopBar title="Overview" subtitle="Welcome back 👋" />

      {/* Stat cards row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginBottom:24 }}>
        {STAT_CARDS.map(s=>(
          <Card key={s.label} style={{ padding:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:12, color:"var(--text-2)", fontWeight:600, marginBottom:8 }}>{s.label}</div>
                <div style={{ fontSize:22, fontWeight:800, color:"var(--text)", letterSpacing:"-0.02em" }}>
                  {s.label==="Total Balance" && cards.length>0
                    ? `${totalBalance.toLocaleString("en-US",{minimumFractionDigits:2})} ₸`
                    : s.value}
                </div>
              </div>
              <div style={{ background:s.bg, borderRadius:10, padding:"6px 10px",
                fontSize:12, fontWeight:700, color:s.color, whiteSpace:"nowrap" }}>
                {s.up ? "↑" : "↓"} {s.change}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main 2-col */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20, marginBottom:20 }}>
        {/* My Cards */}
        <Card>
          <SectionTitle action="See All" >My Cards</SectionTitle>
          {cards.length === 0 ? (
            <div style={{ textAlign:"center", padding:"32px 0", color:"var(--text-3)" }}>
              <Icon name="card" size={40} color="var(--border2)"/>
              <p style={{ marginTop:12, fontSize:14 }}>No cards yet</p>
            </div>
          ) : (
            <div style={{ display:"flex", gap:16, overflowX:"auto", paddingBottom:4 }}>
              {cards.slice(0,3).map(c=>(
                <div key={c.id} style={{ flexShrink:0 }} onClick={()=>onTabChange("cards")}>
                  <BankCard card={c} compact/>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Transactions */}
        <Card>
          <SectionTitle>Recent Transactions</SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {MOCK_TX.slice(0,4).map(tx=>(
              <div key={tx.id} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:`${tx.color}18`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                  {tx.icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"var(--text)",
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{tx.name}</div>
                  <div style={{ fontSize:11, color:"var(--text-3)", marginTop:1 }}>{tx.date}</div>
                </div>
                <div style={{ fontSize:13, fontWeight:700, flexShrink:0,
                  color: tx.amount>0?"var(--success)":"var(--danger)" }}>
                  {tx.amount>0?"+":" "}{Math.abs(tx.amount/100).toLocaleString("en-US",{minimumFractionDigits:2})} ₸
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts row */}
      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:20, marginBottom:20 }}>
        <Card>
          <SectionTitle>Weekly Activity</SectionTitle>
          <WeeklyBarChart/>
        </Card>
        <Card>
          <SectionTitle>Expense Statistics</SectionTitle>
          <ExpenseDonut/>
        </Card>
      </div>

      {/* Quick Transfer + Balance History */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:20 }}>
        {/* Quick Transfer */}
        <Card>
          <SectionTitle>Quick Transfer</SectionTitle>
          {cards.length < 2 ? (
            <p style={{ fontSize:13, color:"var(--text-3)", textAlign:"center", padding:"16px 0" }}>
              Need at least 2 cards to transfer
            </p>
          ) : (
            <>
              <div style={{ display:"flex", gap:12, marginBottom:20 }}>
                {cards.slice(0,3).map(c=>(
                  <div key={c.id} style={{ flex:1, textAlign:"center" }}>
                    <div style={{ width:48, height:48, borderRadius:"50%", background:"var(--primary)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      margin:"0 auto 6px", fontSize:18, fontWeight:700, color:"#fff" }}>
                      {(c.cardHolder||"?")[0]}
                    </div>
                    <div style={{ fontSize:11, color:"var(--text-2)", fontWeight:500,
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      ···{c.maskedCardNumber?.slice(-4)||"••••"}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={()=>onTabChange("transfer")} style={{ width:"100%", padding:"13px",
                background:"var(--primary)", color:"#fff", border:"none", borderRadius:12,
                fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 15px var(--primary-glow)" }}>
                Send Transfer →
              </button>
            </>
          )}
        </Card>

        {/* Balance History */}
        <Card>
          <SectionTitle>Balance History</SectionTitle>
          <BalanceLineChart/>
        </Card>
      </div>
    </div>
  );
}
