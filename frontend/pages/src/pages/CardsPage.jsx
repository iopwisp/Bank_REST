import { useEffect, useState } from "react";
import BankCard     from "../components/BankCard.jsx";
import CardDetail   from "../components/CardDetail.jsx";
import { Button, Icon, Input, Modal, Select, Spinner } from "../components/ui/index.js";

export default function CardsPage({
  cards, page, loading, actionLoading,
  isAdmin, userId,
  onLoad, onCreate, onDelete, onBlock, onUnblock, onTransferFrom,
}) {
  const [selectedId,   setSelectedId]   = useState(null);
  const [showCreate,   setShowCreate]   = useState(false);
  const [createForm,   setCreateForm]   = useState({ cardHolder: "", userId: "", initialBalance: "0" });
  const [createLoading,setCreateLoading]= useState(false);
  const [createError,  setCreateError]  = useState("");

  useEffect(() => { onLoad(0); }, []);

  const selected = cards.find((c) => c.id === selectedId) ?? null;

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    const res = await onDelete(id);
    if (res.ok) setSelectedId(null);
    return res;
  };

  const handleCreate = async () => {
    setCreateError("");
    if (!createForm.cardHolder.trim()) { setCreateError("Укажите имя держателя карты"); return; }
    if (!createForm.userId)            { setCreateError("Укажите ID пользователя");     return; }

    setCreateLoading(true);
    const res = await onCreate({
      cardHolder:     createForm.cardHolder.trim(),
      userId:         Number(createForm.userId),
      initialBalance: Number(createForm.initialBalance) || 0,
    });
    setCreateLoading(false);
    if (res.ok) {
      setShowCreate(false);
      setCreateForm({ cardHolder:"", userId:"", initialBalance:"0" });
    } else {
      setCreateError(res.message);
    }
  };

  const setCreate = (k) => (e) => setCreateForm((f) => ({ ...f, [k]: e.target.value }));

  // ── render ──────────────────────────────────────────────────────────────
  return (
    <div style={{ animation:"fadeUp .4s ease" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:32, flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:32, fontWeight:400, color:"var(--text)" }}>Мои карты</h2>
          <p style={{ color:"var(--muted)", fontSize:12, marginTop:4 }}>
            {page.totalElements} {pluralCards(page.totalElements)} · страница {page.number + 1} из {page.totalPages}
          </p>
        </div>

        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <Button variant="ghost" icon={<Icon name="refresh" size={15} />} onClick={() => onLoad(page.number)} loading={loading}>
            Обновить
          </Button>
          {/* Create card — admin only */}
          {isAdmin && (
            <Button icon={<Icon name="plus" size={15} />} onClick={() => setShowCreate(true)}>
              Выпустить карту
            </Button>
          )}
        </div>
      </div>

      {/* Admin hint for non-admins */}
      {!isAdmin && (
        <div style={{ background:"rgba(201,168,76,.05)", border:"1px solid rgba(201,168,76,.15)", borderRadius:12, padding:"10px 16px", marginBottom:24, fontSize:12, color:"var(--muted)" }}>
          💡 Выпуск и удаление карт доступны только администратору.
        </div>
      )}

      {/* Cards grid */}
      {loading && cards.length === 0 ? (
        <div style={{ display:"flex", justifyContent:"center", padding:80 }}><Spinner size={32} /></div>
      ) : cards.length === 0 ? (
        <EmptyState isAdmin={isAdmin} onCreateClick={() => setShowCreate(true)} />
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:20, marginBottom:28 }}>
          {cards.map((card, i) => (
            <div key={card.id} style={{ animationDelay:`${i * 0.07}s` }}>
              <BankCard
                card={card}
                selected={selectedId === card.id}
                onClick={() => setSelectedId(selectedId === card.id ? null : card.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {page.totalPages > 1 && (
        <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:24 }}>
          <Button variant="ghost" disabled={page.number === 0} onClick={() => onLoad(page.number - 1)}>←</Button>
          {Array.from({ length: page.totalPages }, (_, i) => (
            <Button key={i} variant={i === page.number ? "primary" : "ghost"} onClick={() => onLoad(i)} style={{ minWidth:40, padding:"11px 0" }}>
              {i + 1}
            </Button>
          ))}
          <Button variant="ghost" disabled={page.number >= page.totalPages - 1} onClick={() => onLoad(page.number + 1)}>→</Button>
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <CardDetail
          card={selected}
          actionLoading={actionLoading}
          isAdmin={isAdmin}
          onBlock={onBlock}
          onUnblock={(id) => onUnblock(id)}
          onDelete={handleDelete}
          onTransfer={(id) => onTransferFrom(id)}
          onClose={() => setSelectedId(null)}
        />
      )}

      {/* Create card modal — admin only */}
      {showCreate && (
        <Modal title="Выпустить карту" onClose={() => { setShowCreate(false); setCreateError(""); }}>
          <p style={{ color:"var(--muted)", fontSize:12, marginBottom:20, lineHeight:1.6 }}>
            Только администратор может создавать карты. Укажите держателя и ID пользователя.
          </p>

          <Input label="Имя держателя *" placeholder="IVAN IVANOV" value={createForm.cardHolder} onChange={setCreate("cardHolder")} />
          <Input label="ID пользователя *" type="number" placeholder="1" value={createForm.userId} onChange={setCreate("userId")} />
          <Input label="Начальный баланс (₸)" type="number" placeholder="0.00" min="0" value={createForm.initialBalance} onChange={setCreate("initialBalance")} />

          {createError && (
            <div style={{ fontSize:12, color:"var(--danger)", padding:"8px 12px", background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)", borderRadius:8, marginBottom:14 }}>
              {createError}
            </div>
          )}

          <div style={{ display:"flex", gap:10, marginTop:4 }}>
            <Button variant="ghost" style={{ flex:1 }} onClick={() => { setShowCreate(false); setCreateError(""); }}>Отмена</Button>
            <Button style={{ flex:1 }} icon={<Icon name="card" size={15} />} loading={createLoading} onClick={handleCreate}>Выпустить</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function EmptyState({ isAdmin, onCreateClick }) {
  return (
    <div style={{ textAlign:"center", padding:"80px 0", color:"var(--muted)" }}>
      <div style={{ marginBottom:12 }}><Icon name="card" size={48} color="rgba(255,255,255,.08)" /></div>
      <p style={{ fontSize:14, marginBottom:isAdmin ? 20 : 0 }}>
        {isAdmin ? "Нет карт. Выпустите первую!" : "Карты отсутствуют."}
      </p>
      {isAdmin && (
        <Button icon={<Icon name="plus" size={15} />} onClick={onCreateClick} style={{ margin:"0 auto" }}>
          Выпустить карту
        </Button>
      )}
    </div>
  );
}

function pluralCards(n) {
  if (n === 1) return "карта";
  if (n >= 2 && n <= 4) return "карты";
  return "карт";
}
