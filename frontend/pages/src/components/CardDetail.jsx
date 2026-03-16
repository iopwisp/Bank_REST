import { useState } from "react";
import { Button, Icon, Input, Modal } from "./ui/index.js";

export default function CardDetail({ card, actionLoading, isAdmin, onBlock, onUnblock, onDelete, onTransfer, onClose }) {
  const [showBlock,  setShowBlock]  = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [reason,     setReason]     = useState("");

  const isBlocked = card.status==="BLOCKED";
  const isExpired = card.status==="EXPIRED";

  const handleBlock = async () => {
    if (!reason.trim()) return;
    const res = await onBlock(card.id, reason.trim());
    if (res.ok) { setShowBlock(false); setReason(""); }
  };

  const fields = [
    { l:"Card Number",  v: card.maskedCardNumber||"—" },
    { l:"Card Holder",  v: card.cardHolder||"—" },
    { l:"Balance",      v: `$${Number(card.balance||0).toLocaleString("en-US",{minimumFractionDigits:2})}` },
    { l:"Status",       v: card.status||"—" },
    { l:"Valid Thru",   v: card.expirationDate ? new Date(card.expirationDate).toLocaleDateString("en-US",{month:"2-digit",year:"numeric"}) : "—" },
    { l:"Owner ID",     v: card.userId?`#${card.userId}`:"—" },
  ];

  return (
    <>
      <div style={{ background:"#fff", border:"1.5px solid var(--border)", borderTop:"3px solid var(--primary)",
        borderRadius:20, padding:24, animation:"fadeUp .3s ease", marginTop:8,
        boxShadow:"var(--shadow-sm)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <h3 style={{ fontSize:16, fontWeight:700, color:"var(--text)" }}>
            Card Details
          </h3>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:8, background:"var(--bg)",
            border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <Icon name="x" size={15} color="var(--text-2)"/>
          </button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12, marginBottom:20 }}>
          {fields.map(({l,v})=>(
            <div key={l} style={{ background:"var(--bg)", borderRadius:12, padding:"12px 14px",
              border:"1.5px solid var(--border)" }}>
              <div style={{ fontSize:11, fontWeight:600, color:"var(--text-3)", letterSpacing:"0.06em", marginBottom:4 }}>{l.toUpperCase()}</div>
              <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {!isBlocked && !isExpired && (
            <Button variant="outline" icon={<Icon name="lock" size={14}/>} loading={actionLoading===`block-${card.id}`} onClick={()=>setShowBlock(true)}>
              Block Card
            </Button>
          )}
          {isBlocked && isAdmin && (
            <Button variant="ghost" icon={<Icon name="unlock" size={14}/>} loading={actionLoading===`status-${card.id}`} onClick={()=>onUnblock(card.id)}>
              Unblock
            </Button>
          )}
          {!isBlocked && !isExpired && (
            <Button variant="ghost" icon={<Icon name="send" size={14}/>} onClick={()=>onTransfer(card.id)}>
              Transfer
            </Button>
          )}
          {isAdmin && (
            <Button variant="danger" icon={<Icon name="trash" size={14}/>} loading={actionLoading===`del-${card.id}`} onClick={()=>setShowDelete(true)} style={{ marginLeft:"auto" }}>
              Delete
            </Button>
          )}
        </div>
      </div>

      {showBlock && (
        <Modal title="Block Card" onClose={()=>{setShowBlock(false);setReason("");}}>
          <p style={{ color:"var(--text-2)", fontSize:14, marginBottom:18, lineHeight:1.6 }}>
            Please provide a reason for blocking this card.
          </p>
          <Input label="Reason *" placeholder="e.g. Suspicious activity" value={reason}
            onChange={e=>setReason(e.target.value)} maxLength={500}/>
          <div style={{ fontSize:12, color:"var(--text-3)", textAlign:"right", marginTop:-8, marginBottom:16 }}>{reason.length}/500</div>
          <div style={{ display:"flex", gap:10 }}>
            <Button variant="soft" style={{ flex:1 }} onClick={()=>{setShowBlock(false);setReason("");}}>Cancel</Button>
            <Button variant="danger" style={{ flex:1 }} loading={actionLoading===`block-${card.id}`}
              disabled={!reason.trim()} onClick={handleBlock} icon={<Icon name="lock" size={14}/>}>Confirm Block</Button>
          </div>
        </Modal>
      )}

      {showDelete && (
        <Modal title="Delete Card" onClose={()=>setShowDelete(false)}>
          <p style={{ color:"var(--text-2)", fontSize:14, marginBottom:8, lineHeight:1.6 }}>
            Permanently delete <strong style={{color:"var(--text)"}}>{card.maskedCardNumber}</strong>?
          </p>
          {Number(card.balance)>0 && (
            <div style={{ background:"var(--danger-lt)", border:"1.5px solid rgba(244,67,108,.2)",
              borderRadius:10, padding:"10px 14px", marginBottom:16, fontSize:13, color:"var(--danger)", fontWeight:500 }}>
              ⚠ Cannot delete card with balance: ${Number(card.balance).toLocaleString("en-US")}
            </div>
          )}
          <div style={{ display:"flex", gap:10, marginTop:16 }}>
            <Button variant="soft" style={{ flex:1 }} onClick={()=>setShowDelete(false)}>Cancel</Button>
            <Button variant="danger" style={{ flex:1 }} loading={actionLoading===`del-${card.id}`}
              disabled={Number(card.balance)>0} onClick={async()=>{ const r=await onDelete(card.id); if(r.ok)setShowDelete(false); }}
              icon={<Icon name="trash" size={14}/>}>Delete</Button>
          </div>
        </Modal>
      )}
    </>
  );
}
