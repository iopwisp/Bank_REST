const GRADIENTS = [
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  "linear-gradient(135deg, #1c1c0e 0%, #2d2d00 50%, #1a3300 100%)",
  "linear-gradient(135deg, #2d1b1b 0%, #3d1515 50%, #1a0a0a 100%)",
  "linear-gradient(135deg, #0d1f2d 0%, #0a2540 50%, #051520 100%)",
];

function formatBalance(balance) {
  return balance != null
    ? `${Number(balance).toLocaleString("ru-RU")} ₸`
    : "— ₸";
}

function formatExpiry(expirationDate) {
  if (!expirationDate) return "MM/YY";
  const d = new Date(expirationDate);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${yy}`;
}

export default function BankCard({ card, selected, onClick }) {
  const gradient  = GRADIENTS[card.id % GRADIENTS.length] ?? GRADIENTS[0];
  const isBlocked = card.status === "BLOCKED";
  const isExpired = card.status === "EXPIRED";

  // Backend returns maskedCardNumber: "**** **** **** 1234"
  const masked = card.maskedCardNumber || "•••• •••• •••• ••••";

  const statusLabel = isBlocked ? "ЗАБЛОКИРОВАНА" : isExpired ? "ИСТЕКЛА" : "АКТИВНА";
  const statusBg    = isBlocked
    ? "rgba(239,68,68,.2)"
    : isExpired
    ? "rgba(107,114,128,.2)"
    : "rgba(34,197,94,.15)";
  const statusColor = isBlocked ? "#ef4444" : isExpired ? "#9ca3af" : "#22c55e";
  const statusBorder = isBlocked
    ? "rgba(239,68,68,.3)"
    : isExpired
    ? "rgba(107,114,128,.3)"
    : "rgba(34,197,94,.3)";

  return (
    <div
      onClick={onClick}
      style={{
        background:   gradient,
        borderRadius: 20,
        padding:      "28px 28px 24px",
        cursor:       "pointer",
        position:     "relative",
        overflow:     "hidden",
        border:       selected
          ? "1px solid var(--gold)"
          : "1px solid rgba(255,255,255,0.08)",
        boxShadow:    selected
          ? "0 0 0 2px var(--gold-glow), 0 20px 60px rgba(0,0,0,.5)"
          : "0 8px 32px rgba(0,0,0,.4)",
        transition:   "all .3s",
        animation:    "fadeUp .4s ease both",
        userSelect:   "none",
        opacity:      isExpired ? 0.7 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px) scale(1.01)";
        e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = selected
          ? "0 0 0 2px var(--gold-glow), 0 20px 60px rgba(0,0,0,.5)"
          : "0 8px 32px rgba(0,0,0,.4)";
      }}
    >
      {/* shimmer */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)", pointerEvents:"none" }} />

      {/* chip */}
      <div style={{ width:42, height:32, background:"linear-gradient(135deg, var(--gold), #8a6520)", borderRadius:6, marginBottom:24, position:"relative" }}>
        <div style={{ position:"absolute", top:"30%", bottom:"30%", left:0, right:0, background:"rgba(0,0,0,.2)" }} />
        <div style={{ position:"absolute", left:0, right:0, bottom:0, height:"30%", background:"rgba(0,0,0,.2)" }} />
      </div>

      {/* masked number */}
      <div style={{ fontFamily:"var(--font-mono)", fontSize:17, letterSpacing:"0.15em", color:"rgba(255,255,255,.9)", marginBottom:20 }}>
        {masked}
      </div>

      {/* bottom row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", letterSpacing:"0.1em", marginBottom:2 }}>
            {card.cardHolder || "ДЕРЖАТЕЛЬ"}
          </div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", letterSpacing:"0.08em", marginBottom:6 }}>
            ДО {formatExpiry(card.expirationDate)}
          </div>
          <div style={{ fontSize:22, fontFamily:"var(--font-display)", fontWeight:600, color:"rgba(255,255,255,.95)" }}>
            {formatBalance(card.balance)}
          </div>
        </div>

        <div style={{ textAlign:"right" }}>
          <span style={{ fontSize:11, padding:"4px 10px", borderRadius:20, background:statusBg, color:statusColor, border:`1px solid ${statusBorder}`, letterSpacing:"0.08em" }}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* brand */}
      <div style={{ position:"absolute", top:24, right:24, fontFamily:"var(--font-display)", fontSize:22, fontWeight:600, color:"rgba(255,255,255,.18)", letterSpacing:"0.04em" }}>
        VAULT
      </div>
    </div>
  );
}
