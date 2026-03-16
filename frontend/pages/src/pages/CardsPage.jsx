import { useEffect, useState } from "react";
import BankCard    from "../components/BankCard.jsx";
import CardDetail  from "../components/CardDetail.jsx";
import TopBar      from "../components/TopBar.jsx";
import { Button, Icon, Input, Modal, Spinner } from "../components/ui/index.js";

export default function CardsPage({ cards, page, loading, actionLoading, isAdmin, userId, onLoad, onCreate, onDelete, onBlock, onUnblock, onTransferFrom }) {
  const [selId,     setSelId]    = useState(null);
  const [showCreate,setShow]     = useState(false);
  const [cf,        setCf]       = useState({ cardHolder:"", userId:"", initialBalance:"0" });
  const [cLoading,  setCL]       = useState(false);
  const [cErr,      setCErr]     = useState("");

  useEffect(()=>{ onLoad(0); },[]);

  const sel = cards.find(c=>c.id===selId)??null;
  const setSF = k=>e=>setCf(f=>({...f,[k]:e.target.value}));

  const handleCreate = async()=>{
    setCErr("");
    if(!cf.cardHolder.trim()){setCErr("Card holder name required");return;}
    if(!cf.userId){setCErr("User ID required");return;}
    setCL(true);
    const res=await onCreate({ cardHolder:cf.cardHolder.trim(), userId:Number(cf.userId), initialBalance:Number(cf.initialBalance)||0 });
    setCL(false);
    if(res.ok){setShow(false);setCf({cardHolder:"",userId:"",initialBalance:"0"});}
    else setCErr(res.message);
  };

  const statusColor = s => s==="ACTIVE"?"var(--success)":s==="BLOCKED"?"var(--danger)":"var(--text-3)";
  const statusBg    = s => s==="ACTIVE"?"var(--success-lt)":s==="BLOCKED"?"var(--danger-lt)":"var(--bg)";

  return (
    <div style={{ animation:"fadeUp .4s ease" }}>
      <TopBar title="My Cards" subtitle={`${page.totalElements} card${page.totalElements!==1?"s":""} total`}/>

      {/* Controls */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, gap:12, flexWrap:"wrap" }}>
        <div style={{ display:"flex", gap:8 }}>
          {["ALL","ACTIVE","BLOCKED"].map(f=>(
            <button key={f} style={{ padding:"7px 16px", borderRadius:10, border:"1.5px solid var(--border)",
              background:"#fff", fontSize:12, fontWeight:600, cursor:"pointer",
              color:"var(--text-2)", fontFamily:"var(--font)" }}>
              {f}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <Button variant="soft" icon={<Icon name="refresh" size={15}/>} loading={loading} onClick={()=>onLoad(page.number)}>Refresh</Button>
          {isAdmin && <Button icon={<Icon name="plus" size={15}/>} onClick={()=>setShow(true)}>Issue Card</Button>}
        </div>
      </div>

      {!isAdmin && (
        <div style={{ background:"var(--primary-lt)", border:"1.5px solid rgba(45,96,255,.15)",
          borderRadius:12, padding:"10px 16px", marginBottom:20, fontSize:13, color:"var(--primary)", fontWeight:500 }}>
          💡 Card issuance and deletion require Admin privileges.
        </div>
      )}

      {/* Grid */}
      {loading && cards.length===0 ? (
        <div style={{ display:"flex", justifyContent:"center", padding:80 }}><Spinner size={32}/></div>
      ) : cards.length===0 ? (
        <div style={{ textAlign:"center", padding:"60px 0", color:"var(--text-3)" }}>
          <Icon name="card" size={48} color="var(--border2)"/>
          <p style={{ marginTop:12, fontSize:15, fontWeight:500 }}>No cards found</p>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20, marginBottom:24 }}>
          {cards.map((card,i)=>(
            <div key={card.id} style={{ animationDelay:`${i*.06}s` }}>
              <BankCard card={card} selected={selId===card.id} onClick={()=>setSelId(selId===card.id?null:card.id)}/>
              {/* status badge below card */}
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:10, padding:"0 4px" }}>
                <span style={{ fontSize:12, fontWeight:600, color:statusColor(card.status),
                  background:statusBg(card.status), padding:"3px 10px", borderRadius:20 }}>
                  {card.status}
                </span>
                <span style={{ fontSize:12, color:"var(--text-3)", fontWeight:500 }}>
                  #{card.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {page.totalPages>1 && (
        <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:24 }}>
          <Button variant="soft" disabled={page.number===0} onClick={()=>onLoad(page.number-1)} style={{ padding:"9px 14px" }}>‹</Button>
          {Array.from({length:page.totalPages},(_,i)=>(
            <Button key={i} variant={i===page.number?"primary":"soft"} onClick={()=>onLoad(i)} style={{ padding:"9px 14px" }}>{i+1}</Button>
          ))}
          <Button variant="soft" disabled={page.number>=page.totalPages-1} onClick={()=>onLoad(page.number+1)} style={{ padding:"9px 14px" }}>›</Button>
        </div>
      )}

      {sel && (
        <CardDetail card={sel} actionLoading={actionLoading} isAdmin={isAdmin}
          onBlock={onBlock} onUnblock={onUnblock}
          onDelete={async id=>{ const r=await onDelete(id); if(r.ok)setSelId(null); return r; }}
          onTransfer={id=>{onTransferFrom(id);}}
          onClose={()=>setSelId(null)}/>
      )}

      {showCreate && (
        <Modal title="Issue New Card" onClose={()=>{setShow(false);setCErr("");}}>
          <p style={{ color:"var(--text-2)", fontSize:13, marginBottom:20, lineHeight:1.6 }}>
            Admin only. Specify the card holder name and user account ID.
          </p>
          <Input label="Card Holder Name *" placeholder="IVAN IVANOV" value={cf.cardHolder} onChange={setSF("cardHolder")}/>
          <Input label="User ID *" type="number" placeholder="1" value={cf.userId} onChange={setSF("userId")}/>
          <Input label="Initial Balance ($)" type="number" placeholder="0.00" min="0" value={cf.initialBalance} onChange={setSF("initialBalance")}/>
          {cErr && <div style={{ fontSize:13, color:"var(--danger)", padding:"10px 12px",
            background:"var(--danger-lt)", borderRadius:8, marginBottom:14 }}>{cErr}</div>}
          <div style={{ display:"flex", gap:10, marginTop:4 }}>
            <Button variant="soft" style={{ flex:1 }} onClick={()=>{setShow(false);setCErr("");}}>Cancel</Button>
            <Button style={{ flex:1 }} icon={<Icon name="card" size={15}/>} loading={cLoading} onClick={handleCreate}>Issue Card</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
