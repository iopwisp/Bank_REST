const DAYS = ["Sat","Sun","Mon","Tue","Wed","Thu","Fri"];
const DEPOSIT  = [320,180,460,280,390,440,210];
const WITHDRAW = [180,290,140,360,210,300,420];

export default function WeeklyBarChart() {
  const maxVal = Math.max(...DEPOSIT, ...WITHDRAW);
  const H = 160, W_BAR = 18, GAP = 8, GROUP = W_BAR*2+GAP+16;
  const svgW = GROUP * DAYS.length + 20;

  return (
    <div>
      {/* Legend */}
      <div style={{ display:"flex", gap:20, marginBottom:16, justifyContent:"flex-end" }}>
        {[["var(--primary)","Deposit"],["var(--success)","Withdraw"]].map(([c,l])=>(
          <div key={l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--text-2)", fontWeight:500 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:c }}/>
            {l}
          </div>
        ))}
      </div>
      <div style={{ overflowX:"auto" }}>
        <svg width={svgW} height={H+40} style={{ display:"block", minWidth:"100%" }}>
          {/* Y gridlines */}
          {[0,125,250,375,500].map(v=>{
            const y = H - (v/maxVal)*H + 10;
            return <g key={v}>
              <line x1={10} y1={y} x2={svgW-10} y2={y} stroke="var(--border)" strokeWidth={1}/>
              <text x={0} y={y+4} fontSize={10} fill="var(--text-3)" textAnchor="start">{v}</text>
            </g>;
          })}
          {/* Bars */}
          {DAYS.map((day,i)=>{
            const x = i*GROUP + 30;
            const depH = (DEPOSIT[i]/maxVal) * H;
            const witH = (WITHDRAW[i]/maxVal) * H;
            return (
              <g key={day}>
                {/* Deposit bar */}
                <rect x={x} y={H-depH+10} width={W_BAR} height={depH}
                  rx={6} fill="var(--primary)" opacity={0.85}/>
                {/* Withdraw bar */}
                <rect x={x+W_BAR+GAP} y={H-witH+10} width={W_BAR} height={witH}
                  rx={6} fill="var(--success)" opacity={0.85}/>
                {/* Label */}
                <text x={x+W_BAR+GAP/2} y={H+28} fontSize={11}
                  fill="var(--text-3)" textAnchor="middle" fontWeight={500}>{day}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
