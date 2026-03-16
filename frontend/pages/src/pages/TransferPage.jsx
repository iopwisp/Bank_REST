import { useState } from "react";
import { Button, Input, Select, Icon } from "../components/ui/index.js";
import { transferApi } from "../api/index.js";
import BankCard from "../components/BankCard.jsx";
import TopBar from "../components/TopBar.jsx";

export default function TransferPage({ cards, token, notify, preselectedFromId=null }) {
  const [form, setForm] = useState({
    fromCardId: preselectedFromId?String(preselectedFromId):"",
    toCardId:"", amount:"", description:"",
  });
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const set = k=>e=>setForm(f=>({...f,[k]:e.target.value}));

  const activeCards = cards.filter(c=>c.status==="ACTIVE");
  const fromCard    = cards.find(c=>String(c.id)===form.fromCardId);
  const toCard      = cards.find(c=>String(c.id)===form.toCardId);
  const canSubmit   = form.fromCardId&&form.toCardId&&Number(form.amount)>0&&form.fromCardId!==form.toCardId;

  const doTransfer = async()=>{
    setLoading(true); setResult(null);
    try {
      const res = await transferApi.send(form, token);
      setResult(res);
      notify(`Transferred $${Number(form.amount).toLocaleString("en-US",{minimumFractionDigits:2})}`, "success");
      setForm(f=>({...f, toCardId:"", amount:"", description:""}));
    } catch(e){ notify(e.message,"error"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ animation:"fadeUp .4s ease" }}>
      <TopBar title="Transfer Money" subtitle="Send between your cards instantly"/>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 400px", gap:24, alignItems:"start" }}>
        {/* Form */}
        <div style={{ background:"#fff", borderRadius:20, padding:28,
          border:"1.5px solid var(--border)", boxShadow:"var(--shadow-sm)" }}>

          {/* From card */}
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:13, fontWeight:600, color:"var(--text-2)", display:"block", marginBottom:8 }}>FROM CARD</label>
            <select value={form.fromCardId} onChange={set("fromCardId")} style={{ width:"100%", background:"var(--bg)",
              border:"1.5px solid var(--border)", borderRadius:12, padding:"12px 16px", fontSize:14,
              color:"var(--text)", fontFamily:"var(--font)", outline:"none", cursor:"pointer" }}>
              <option value="">— Select source card —</option>
              {activeCards.map(c=>(
                <option key={c.id} value={c.id}>
                  {c.maskedCardNumber}  ·  ${Number(c.balance||0).toLocaleString("en-US",{minimumFractionDigits:2})}
                </option>
              ))}
            </select>
          </div>

          {/* Arrow */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ flex:1, height:"1.5px", background:"var(--border)" }}/>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"var(--primary)",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 4px 12px var(--primary-glow)" }}>
              <Icon name="send" size={16} color="#fff"/>
            </div>
            <div style={{ flex:1, height:"1.5px", background:"var(--border)" }}/>
          </div>

          {/* To card */}
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:13, fontWeight:600, color:"var(--text-2)", display:"block", marginBottom:8 }}>TO CARD</label>
            <select value={form.toCardId} onChange={set("toCardId")} style={{ width:"100%", background:"var(--bg)",
              border:"1.5px solid var(--border)", borderRadius:12, padding:"12px 16px", fontSize:14,
              color:"var(--text)", fontFamily:"var(--font)", outline:"none", cursor:"pointer" }}>
              <option value="">— Select destination card —</option>
              {cards.filter(c=>String(c.id)!==form.fromCardId).map(c=>(
                <option key={c.id} value={c.id}>{c.maskedCardNumber}{c.status!=="ACTIVE"?` (${c.status})`:""}</option>
              ))}
            </select>
          </div>

          <Input label="AMOUNT ($)" type="number" placeholder="0.00" value={form.amount} onChange={set("amount")} min="0.01" step="0.01"/>
          <Input label="DESCRIPTION (OPTIONAL)" placeholder="What's this transfer for?" value={form.description} onChange={set("description")} maxLength={500}/>

          {/* Balance check */}
          {fromCard && Number(form.amount)>0 && (
            <div style={{ background: Number(form.amount)>Number(fromCard.balance)?"var(--danger-lt)":"var(--success-lt)",
              border:`1.5px solid ${Number(form.amount)>Number(fromCard.balance)?"rgba(244,67,108,.2)":"rgba(22,199,132,.2)"}`,
              borderRadius:10, padding:"10px 14px", marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13 }}>
                <span style={{ color:"var(--text-2)", fontWeight:500 }}>Available balance</span>
                <span style={{ fontWeight:700, color:"var(--text)" }}>
                  ${Number(fromCard.balance||0).toLocaleString("en-US",{minimumFractionDigits:2})}
                </span>
              </div>
              {Number(form.amount)>Number(fromCard.balance) && (
                <div style={{ fontSize:12, color:"var(--danger)", fontWeight:600, marginTop:4 }}>
                  ⚠ Insufficient funds
                </div>
              )}
            </div>
          )}

          <Button fullWidth icon={<Icon name="send" size={16}/>} loading={loading}
            disabled={!canSubmit||Number(form.amount)>Number(fromCard?.balance??Infinity)} onClick={doTransfer}>
            Send Transfer
          </Button>
        </div>

        {/* Preview & result */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Card previews */}
          {(fromCard||toCard) && (
            <div style={{ background:"#fff", borderRadius:20, padding:24, border:"1.5px solid var(--border)", boxShadow:"var(--shadow-sm)" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"var(--text-2)", marginBottom:14 }}>PREVIEW</div>
              {fromCard && <div style={{ marginBottom:fromCard&&toCard?14:0 }}>
                <div style={{ fontSize:11, color:"var(--text-3)", fontWeight:600, letterSpacing:"0.06em", marginBottom:8 }}>FROM</div>
                <BankCard card={fromCard} compact/>
              </div>}
              {toCard && <div>
                <div style={{ fontSize:11, color:"var(--text-3)", fontWeight:600, letterSpacing:"0.06em", marginBottom:8 }}>TO</div>
                <BankCard card={toCard} compact/>
              </div>}
            </div>
          )}

          {/* Success result */}
          {result && (
            <div style={{ background:"#fff", border:"1.5px solid rgba(22,199,132,.3)", borderRadius:20,
              padding:24, animation:"fadeUp .3s ease", boxShadow:"0 4px 16px rgba(22,199,132,.1)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:"var(--success-lt)",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="check" size={16} color="var(--success)" strokeWidth={2.5}/>
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:"var(--success)" }}>Transfer Complete</div>
                  <div style={{ fontSize:12, color:"var(--text-3)" }}>Transaction #{result.transactionId}</div>
                </div>
              </div>
              {[
                ["From", result.fromCardMasked],
                ["To",   result.toCardMasked],
                ["Amount", `$${Number(result.amount).toLocaleString("en-US",{minimumFractionDigits:2})}`],
                ["Status", result.status],
              ].map(([l,v])=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0",
                  borderBottom:"1px solid var(--border)", fontSize:13 }}>
                  <span style={{ color:"var(--text-2)", fontWeight:500 }}>{l}</span>
                  <span style={{ fontWeight:700, color:l==="Status"?"var(--success)":"var(--text)" }}>{v}</span>
                </div>
              ))}
              {result.description && (
                <div style={{ marginTop:10, fontSize:12, color:"var(--text-2)" }}>{result.description}</div>
              )}
            </div>
          )}

          {/* Info card */}
          <div style={{ background:"var(--primary-lt)", borderRadius:16, padding:18, border:"1.5px solid rgba(45,96,255,.12)" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"var(--primary)", marginBottom:8 }}>ℹ Transfer Info</div>
            {[["Fee","0.00 ₸ — Free"],["Speed","Instant"],["Limit","Own cards only"]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                <span style={{ color:"var(--text-2)" }}>{k}</span>
                <span style={{ fontWeight:600, color:"var(--text)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
