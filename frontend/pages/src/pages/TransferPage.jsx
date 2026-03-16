import { useState } from "react";
import { Button, Input, Select, Icon } from "../components/ui/index.js";
import { transferApi } from "../api/index.js";

export default function TransferPage({ cards, token, notify, preselectedFromId = null }) {
  const [form, setForm] = useState({
    fromCardId:  preselectedFromId ? String(preselectedFromId) : "",
    toCardId:    "",
    amount:      "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null); // last successful transfer

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Only ACTIVE cards can be the source
  const activeCards = cards.filter((c) => c.status === "ACTIVE");
  const fromCard    = cards.find((c) => String(c.id) === form.fromCardId);
  const canSubmit   = form.fromCardId && form.toCardId && Number(form.amount) > 0
                      && form.fromCardId !== form.toCardId;

  const handleTransfer = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await transferApi.send(form, token);
      setResult(res);
      notify(`Переведено ${Number(form.amount).toLocaleString("ru-RU")} ₸`, "success");
      setForm((f) => ({ ...f, toCardId:"", amount:"", description:"" }));
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation:"fadeUp .4s ease", maxWidth:520 }}>
      <h2 style={{ fontFamily:"var(--font-display)", fontSize:32, fontWeight:400, color:"var(--text)", marginBottom:8 }}>
        Перевод средств
      </h2>
      <p style={{ color:"var(--muted)", fontSize:12, marginBottom:32, letterSpacing:"0.04em" }}>
        Мгновенный перевод между вашими картами · комиссия 0 ₸
      </p>

      <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:20, padding:32, marginBottom:24 }}>
        {/* From */}
        <Select label="С карты *" value={form.fromCardId} onChange={set("fromCardId")}>
          <option value="">— Выберите карту —</option>
          {activeCards.map((c) => (
            <option key={c.id} value={c.id}>
              {c.maskedCardNumber}  ·  {Number(c.balance || 0).toLocaleString("ru-RU")} ₸
            </option>
          ))}
        </Select>

        {/* Arrow divider */}
        <div style={{ display:"flex", justifyContent:"center", margin:"4px 0 20px" }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"var(--gold-glow)", border:"1px solid var(--gold)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="send" size={14} color="var(--gold)" />
          </div>
        </div>

        {/* To */}
        <Select label="На карту *" value={form.toCardId} onChange={set("toCardId")}>
          <option value="">— Выберите карту —</option>
          {cards
            .filter((c) => String(c.id) !== form.fromCardId)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.maskedCardNumber}
                {c.status !== "ACTIVE" ? ` · ${c.status}` : ""}
              </option>
            ))}
        </Select>

        <Input label="Сумма (₸) *" type="number" placeholder="0.00" value={form.amount} onChange={set("amount")} min="0.01" step="0.01" />
        <Input label="Описание (необязательно)" placeholder="За что перевод..." value={form.description} onChange={set("description")} maxLength={500} />

        {/* Summary */}
        {canSubmit && fromCard && (
          <div style={{ background:"var(--bg)", borderRadius:12, padding:"14px 16px", border:"1px solid var(--border)", marginBottom:20 }}>
            <SummaryRow label="Доступно на карте"  value={`${Number(fromCard.balance || 0).toLocaleString("ru-RU")} ₸`} />
            <SummaryRow label="Сумма перевода"      value={`${Number(form.amount).toLocaleString("ru-RU")} ₸`} />
            <SummaryRow label="Комиссия"            value="0 ₸" valueColor="var(--success)" />
            {Number(form.amount) > Number(fromCard.balance) && (
              <div style={{ marginTop:8, fontSize:12, color:"var(--danger)" }}>
                ⚠ Недостаточно средств на карте
              </div>
            )}
          </div>
        )}

        <Button
          fullWidth
          icon={<Icon name="send" size={15} />}
          loading={loading}
          disabled={!canSubmit || Number(form.amount) > Number(fromCard?.balance ?? Infinity)}
          onClick={handleTransfer}
        >
          ВЫПОЛНИТЬ ПЕРЕВОД
        </Button>
      </div>

      {/* Last transaction result */}
      {result && (
        <div style={{ background:"var(--surface)", border:"1px solid rgba(34,197,94,.2)", borderRadius:20, padding:24, animation:"fadeUp .3s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(34,197,94,.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="check" size={14} color="var(--success)" />
            </div>
            <div>
              <div style={{ fontSize:13, color:"var(--success)", fontWeight:700 }}>Перевод выполнен</div>
              <div style={{ fontSize:11, color:"var(--muted)" }}>Транзакция #{result.transactionId}</div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <InfoBox label="Откуда"  value={result.fromCardMasked} />
            <InfoBox label="Куда"    value={result.toCardMasked} />
            <InfoBox label="Сумма"   value={`${Number(result.amount).toLocaleString("ru-RU")} ₸`} />
            <InfoBox label="Статус"  value={result.status} color="var(--success)" />
          </div>
          {result.description && (
            <div style={{ marginTop:12, fontSize:12, color:"var(--muted)" }}>
              {result.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value, valueColor = "var(--text)" }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:13, color:"var(--muted)" }}>
      <span>{label}</span>
      <span style={{ color:valueColor }}>{value}</span>
    </div>
  );
}

function InfoBox({ label, value, color = "var(--text)" }) {
  return (
    <div style={{ background:"var(--bg)", borderRadius:10, padding:"10px 14px", border:"1px solid var(--border)" }}>
      <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:"0.1em", marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:13, color }}>{value}</div>
    </div>
  );
}
