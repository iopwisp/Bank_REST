const SEGMENTS = [
  { label:"Entertainment", pct:30, color:"#2d60ff" },
  { label:"Investment",    pct:20, color:"#16c784" },
  { label:"Bills & Fees",  pct:15, color:"#f8b84e" },
  { label:"Others",        pct:35, color:"#f4436c" },
];

function polarToXY(cx,cy,r,angle) {
  const rad = (angle-90)*Math.PI/180;
  return { x: cx+r*Math.cos(rad), y: cy+r*Math.sin(rad) };
}

export default function ExpenseDonut() {
  const cx=90, cy=90, R=70, r=42;
  let start=0;
  const arcs = SEGMENTS.map(seg=>{
    const angle = (seg.pct/100)*360;
    const s = polarToXY(cx,cy,R,start);
    const e = polarToXY(cx,cy,R,start+angle);
    const large = angle>180?1:0;
    const si= polarToXY(cx,cy,r,start);
    const ei= polarToXY(cx,cy,r,start+angle);
    const d=`M${s.x},${s.y} A${R},${R} 0 ${large},1 ${e.x},${e.y} L${ei.x},${ei.y} A${r},${r} 0 ${large},0 ${si.x},${si.y} Z`;
    start+=angle;
    return { ...seg, d };
  });

  return (
    <div style={{ display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
      <svg width={180} height={180}>
        {arcs.map((a,i)=>(
          <path key={i} d={a.d} fill={a.color} opacity={0.9}>
            <title>{a.label}: {a.pct}%</title>
          </path>
        ))}
        <text x={cx} y={cy-8} textAnchor="middle" fontSize={11} fill="var(--text-2)" fontWeight={600}>Total</text>
        <text x={cx} y={cy+10} textAnchor="middle" fontSize={17} fill="var(--text)" fontWeight={800}>3,460 ₸</text>
      </svg>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {SEGMENTS.map(s=>(
          <div key={s.label} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:10, height:10, borderRadius:3, background:s.color, flexShrink:0 }}/>
            <span style={{ fontSize:13, color:"var(--text-2)", fontWeight:500 }}>{s.label}</span>
            <span style={{ fontSize:13, fontWeight:700, color:"var(--text)", marginLeft:"auto", paddingLeft:12 }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
