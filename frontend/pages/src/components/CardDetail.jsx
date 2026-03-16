import { useState } from "react";
import { Button, Icon, Input, Modal } from "./ui/index.js";

function InfoGrid({ card }) {
  const fields = [
    { label: "ID карты",        value: `#${card.id}` },
    { label: "Держатель",       value: card.cardHolder || "—" },
    { label: "Баланс",          value: `${Number(card.balance || 0).toLocaleString("ru-RU")} ₸` },
    { label: "Статус",          value: card.status || "—" },
    { label: "Действует до",    value: card.expirationDate ? new Date(card.expirationDate).toLocaleDateString("ru-RU", { month:"2-digit", year:"numeric" }) : "—" },
    { label: "Владелец (ID)",   value: card.userId ? `#${card.userId}` : "—" },
  ];

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:12, marginBottom:24 }}>
      {fields.map(({ label, value }) => (
        <div key={label} style={{ background:"var(--bg)", borderRadius:12, padding:"12px 14px", border:"1px solid var(--border)" }}>
          <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:"0.1em", marginBottom:4 }}>{label}</div>
          <div style={{ fontSize:13, color:"var(--text)", wordBreak:"break-all" }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

/**
 * CardDetail — panel shown below the selected card.
 *
 * Props:
 *  card          — CardDTO.Response from backend
 *  actionLoading — string key of the in-progress action
 *  isAdmin       — bool, controls delete & updateStatus visibility
 *  onBlock       — (id, reason) => Promise<{ok,message}>
 *  onUnblock     — (id) => Promise<{ok,message}>  (admin: PUT status=ACTIVE)
 *  onDelete      — (id) => Promise<{ok,message}>  (admin only)
 *  onTransfer    — (id) => void
 *  onClose       — () => void
 */
export default function CardDetail({ card, actionLoading, isAdmin, onBlock, onUnblock, onDelete, onTransfer, onClose }) {
  const [showBlockModal,  setShowBlockModal]  = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blockReason,     setBlockReason]     = useState("");

  const isBlocked = card.status === "BLOCKED";
  const isExpired = card.status === "EXPIRED";
  const isActive  = card.status === "ACTIVE";
  const canTransfer = isActive;

  const handleBlock = async () => {
    if (!blockReason.trim()) return;
    const res = await onBlock(card.id, blockReason.trim());
    if (res.ok) {
      setShowBlockModal(false);
      setBlockReason("");
    }
  };

  const handleDelete = async () => {
    const res = await onDelete(card.id);
    if (res.ok) setShowDeleteModal(false);
  };

  return (
    <>
      <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderTop:"2px solid var(--gold)", borderRadius:20, padding:28, animation:"fadeUp .3s ease", marginTop:8 }}>
        {/* header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
          <h3 style={{ fontFamily:"var(--font-display)", fontSize:22, color:"var(--gold2)" }}>
            {card.maskedCardNumber || "•••• •••• •••• ••••"}
          </h3>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"var(--muted)", cursor:"pointer" }}>
            <Icon name="x" size={18} />
          </button>
        </div>

        <InfoGrid card={card} />

        {/* actions */}
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
          {/* Block — any user can request block of their own card */}
          {isActive && (
            <Button variant="outline" icon={<Icon name="lock" size={14} />} loading={actionLoading === `block-${card.id}`} onClick={() => setShowBlockModal(true)}>
              Заблокировать
            </Button>
          )}

          {/* Unblock — admin can restore via PUT /status */}
          {isBlocked && isAdmin && (
            <Button variant="ghost" icon={<Icon name="unlock" size={14} />} loading={actionLoading === `status-${card.id}`} onClick={() => onUnblock(card.id)}>
              Разблокировать
            </Button>
          )}

          {/* Transfer */}
          {canTransfer && (
            <Button variant="ghost" icon={<Icon name="send" size={14} />} onClick={() => onTransfer(card.id)}>
              Перевести
            </Button>
          )}

          {/* Admin badge */}
          {isAdmin && (
            <span style={{ fontSize:10, padding:"4px 8px", borderRadius:6, background:"rgba(201,168,76,.1)", color:"var(--gold)", border:"1px solid rgba(201,168,76,.2)", letterSpacing:"0.08em", marginLeft:4 }}>
              ADMIN
            </span>
          )}

          {/* Delete — admin only, card must have zero balance */}
          {isAdmin && (
            <Button variant="danger" icon={<Icon name="trash" size={14} />} loading={actionLoading === `del-${card.id}`} onClick={() => setShowDeleteModal(true)} style={{ marginLeft:"auto" }}>
              Удалить карту
            </Button>
          )}
        </div>
      </div>

      {/* Block modal — requires reason */}
      {showBlockModal && (
        <Modal title="Заблокировать карту" onClose={() => { setShowBlockModal(false); setBlockReason(""); }}>
          <p style={{ color:"var(--muted)", fontSize:13, marginBottom:18, lineHeight:1.6 }}>
            Укажите причину блокировки. Это действие нельзя отменить самостоятельно.
          </p>
          <Input
            label="Причина блокировки *"
            placeholder="Например: подозрительная активность"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            maxLength={500}
          />
          <div style={{ fontSize:11, color:"var(--muted)", textAlign:"right", marginTop:-8, marginBottom:16 }}>
            {blockReason.length}/500
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Button variant="ghost" style={{ flex:1 }} onClick={() => { setShowBlockModal(false); setBlockReason(""); }}>
              Отмена
            </Button>
            <Button
              variant="outline"
              style={{ flex:1, borderColor:"var(--danger)", color:"var(--danger)" }}
              icon={<Icon name="lock" size={14} />}
              loading={actionLoading === `block-${card.id}`}
              disabled={!blockReason.trim()}
              onClick={handleBlock}
            >
              Подтвердить
            </Button>
          </div>
        </Modal>
      )}

      {/* Delete modal */}
      {showDeleteModal && (
        <Modal title="Удалить карту" onClose={() => setShowDeleteModal(false)}>
          <p style={{ color:"var(--muted)", fontSize:13, marginBottom:8, lineHeight:1.6 }}>
            Карта <strong style={{ color:"var(--text)" }}>{card.maskedCardNumber}</strong> будет удалена навсегда.
          </p>
          {Number(card.balance) > 0 && (
            <div style={{ background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)", borderRadius:10, padding:"10px 14px", marginBottom:16, fontSize:12, color:"var(--danger)" }}>
              ⚠ Нельзя удалить карту с ненулевым балансом ({Number(card.balance).toLocaleString("ru-RU")} ₸)
            </div>
          )}
          <div style={{ display:"flex", gap:10, marginTop:16 }}>
            <Button variant="ghost" style={{ flex:1 }} onClick={() => setShowDeleteModal(false)}>Отмена</Button>
            <Button variant="danger" style={{ flex:1 }} loading={actionLoading === `del-${card.id}`} disabled={Number(card.balance) > 0} onClick={handleDelete} icon={<Icon name="trash" size={14} />}>
              Удалить
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
