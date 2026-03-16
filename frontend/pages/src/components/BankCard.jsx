function fmtBalance(b) {
  return b != null ? `${Number(b).toLocaleString("en-US", {minimumFractionDigits:2})} ₸` : "0.00 ₸";
}
function fmtExpiry(d) {
  if (!d) return "MM/YY";
  const dt = new Date(d);
  return `${String(dt.getMonth()+1).padStart(2,"0")}/${String(dt.getFullYear()).slice(-2)}`;
}

const GRADIENTS = [
  "linear-gradient(135deg, #2d60ff 0%, #539bff 100%)",
  "linear-gradient(135deg, #4c49ed 0%, #9795f9 100%)",
  "linear-gradient(135deg, #16c784 0%, #39d98a 100%)",
  "linear-gradient(135deg, #1e2a4a 0%, #3b4d80 100%)",
];

export default function BankCard({ card, selected, onClick, compact=false }) {
  const grad   = GRADIENTS[card.id % GRADIENTS.length] ?? GRADIENTS[0];
  const blocked = card.status === "BLOCKED";
  const expired = card.status === "EXPIRED";
  const masked  = card.maskedCardNumber || "•••• •••• •••• ••••";

  return (
    <div onClick={onClick} style={{
      background: grad, borderRadius:20, padding: compact?"22px 20px":"28px 26px",
      cursor:"pointer", position:"relative", overflow:"hidden", userSelect:"none",
      border: selected?"2px solid rgba(255,255,255,0.8)":"2px solid transparent",
      boxShadow: selected?"0 8px 32px rgba(45,96,255,0.35)":"0 4px 20px rgba(45,96,255,0.2)",
      transition:"all .25s", opacity: expired?0.7:1,
      minWidth: compact?220:280,
    }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(45,96,255,0.3)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=selected?"0 8px 32px rgba(45,96,255,0.35)":"0 4px 20px rgba(45,96,255,0.2)";}}>

      {/* bg circles */}
      <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120,
        borderRadius:"50%", background:"rgba(255,255,255,0.08)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:-40, left:-10, width:140, height:140,
        borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }}/>

      {/* top row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:compact?16:24 }}>
        <div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", letterSpacing:"0.06em", marginBottom:4 }}>BALANCE</div>
          <div style={{ fontSize: compact?20:26, fontWeight:800, color:"#fff", letterSpacing:"-0.02em" }}>
            {fmtBalance(card.balance)}
          </div>
        </div>
        {/* chip icon */}
        <div style={{ width:36, height:28, background:"linear-gradient(135deg,#f0d080,#c9a84c)",
          borderRadius:6, position:"relative", flexShrink:0 }}>
          <div style={{ position:"absolute", top:"30%", bottom:"30%", left:0, right:0, background:"rgba(0,0,0,.15)" }}/>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"28%", background:"rgba(0,0,0,.1)" }}/>
        </div>
      </div>

      {/* card number */}
      <div style={{ fontSize: compact?13:15, letterSpacing:"0.12em", color:"rgba(255,255,255,0.9)",
        fontFamily:"'Courier New',monospace", marginBottom: compact?14:20 }}>
        {masked}
      </div>

      {/* bottom row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.55)", letterSpacing:"0.06em", marginBottom:2 }}>CARD HOLDER</div>
          <div style={{ fontSize:13, fontWeight:600, color:"#fff" }}>{card.cardHolder || "—"}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.55)", letterSpacing:"0.06em", marginBottom:2 }}>VALID THRU</div>
          <div style={{ fontSize:13, fontWeight:600, color:"#fff" }}>{fmtExpiry(card.expirationDate)}</div>
        </div>
      </div>

      {/* blocked overlay */}
      {blocked && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", borderRadius:20,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ background:"rgba(244,67,108,0.9)", color:"#fff", fontSize:11,
            padding:"5px 12px", borderRadius:20, fontWeight:700, letterSpacing:"0.08em" }}>BLOCKED</span>
        </div>
      )}
    </div>
  );
}
