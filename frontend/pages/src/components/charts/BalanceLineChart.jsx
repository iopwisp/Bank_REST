const MONTHS = ["Jul","Aug","Sep","Oct","Nov","Dec","Jan"];
const DATA   = [1800,2400,1900,3100,2600,4200,3800];

export default function BalanceLineChart() {
  const W=380, H=100, pad=16;
  const max=Math.max(...DATA), min=Math.min(...DATA)-200;
  const pts = DATA.map((v,i)=>({
    x: pad + (i/(DATA.length-1))*(W-pad*2),
    y: pad + (1-(v-min)/(max-min))*(H-pad*2)
  }));
  const line = pts.map((p,i)=>(i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`)).join(" ");
  const area = line + ` L${pts[pts.length-1].x},${H} L${pts[0].x},${H} Z`;

  return (
    <div style={{ overflowX:"auto" }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H+24}`} style={{ minWidth:280 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={area} fill="url(#areaGrad)"/>
        <path d={line} fill="none" stroke="var(--primary)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((p,i)=>(
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill="#fff" stroke="var(--primary)" strokeWidth={2}/>
            <text x={p.x} y={H+18} textAnchor="middle" fontSize={10} fill="var(--text-3)" fontWeight={500}>{MONTHS[i]}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
