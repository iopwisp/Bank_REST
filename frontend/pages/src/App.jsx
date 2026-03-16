import { useEffect, useState } from "react";
import "./styles/globals.css";

import { useAuth }  from "./hooks/useAuth.js";
import { useCards } from "./hooks/useCards.js";
import { useToast } from "./hooks/useToast.js";

import AuthPage     from "./pages/AuthPage.jsx";
import CardsPage    from "./pages/CardsPage.jsx";
import TransferPage from "./pages/TransferPage.jsx";

import Sidebar from "./components/Sidebar.jsx";
import { Toast } from "./components/ui/index.js";

export default function App() {
  const {
    token, username, userId, isAdmin,
    login, register, logout,
  } = useAuth();

  const {
    cards, page, loading, actionLoading,
    load, create, remove, block, updateStatus,
  } = useCards(token);

  const { toast, notify, dismiss } = useToast();

  const [activeTab,      setActiveTab]      = useState("cards");
  const [transferFromId, setTransferFromId] = useState(null);

  // Initial load after login
  useEffect(() => {
    if (token) load(0);
  }, [token]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const handleAuth = async (mode, form) => {
    if (mode === "login") {
      const ok = await login(form);
      if (!ok) throw new Error("Неверный логин или пароль");
    } else {
      const ok = await register(form);
      if (!ok) throw new Error("Ошибка регистрации");
    }
  };

  // ── Card operations ───────────────────────────────────────────────────────
  const handleCreate = async (params) => {
    const res = await create(params);
    if (res.ok) notify("Карта успешно выпущена", "success");
    else        notify(res.message, "error");
    return res;
  };

  const handleDelete = async (id) => {
    const res = await remove(id);
    if (res.ok) notify("Карта удалена", "success");
    else        notify(res.message, "error");
    return res;
  };

  /**
   * Block: POST /api/cards/{id}/block  — requires reason body
   */
  const handleBlock = async (id, reason) => {
    const res = await block(id, reason);
    if (res.ok) notify("Карта заблокирована", "success");
    else        notify(res.message, "error");
    return res;
  };

  /**
   * Unblock: PUT /api/cards/{id}/status { status: "ACTIVE" }
   * Only admin can do this via updateStatus.
   */
  const handleUnblock = async (id) => {
    const res = await updateStatus(id, "ACTIVE");
    if (res.ok) notify("Карта разблокирована", "success");
    else        notify(res.message, "error");
    return res;
  };

  const handleTransferFrom = (id) => {
    setTransferFromId(id);
    setActiveTab("transfer");
  };

  // ── Not authenticated ─────────────────────────────────────────────────────
  if (!token) {
    return (
      <>
        <AuthPage onAuth={handleAuth} />
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={dismiss} />}
      </>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      <Sidebar
        activeTab={activeTab}
        username={username}
        isAdmin={isAdmin}
        onTabChange={setActiveTab}
        onLogout={logout}
      />

      <main style={{ flex:1, padding:"36px 40px", overflowY:"auto", maxWidth:"calc(100vw - 240px)" }}>
        {activeTab === "cards" && (
          <CardsPage
            cards={cards}
            page={page}
            loading={loading}
            actionLoading={actionLoading}
            isAdmin={isAdmin}
            userId={userId}
            onLoad={load}
            onCreate={handleCreate}
            onDelete={handleDelete}
            onBlock={handleBlock}
            onUnblock={handleUnblock}
            onTransferFrom={handleTransferFrom}
          />
        )}

        {activeTab === "transfer" && (
          <TransferPage
            cards={cards}
            token={token}
            notify={notify}
            preselectedFromId={transferFromId}
          />
        )}
      </main>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={dismiss} />}
    </div>
  );
}
