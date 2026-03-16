import { useEffect, useState } from "react";
import "./styles/globals.css";

import { useAuth }  from "./hooks/useAuth.js";
import { useCards } from "./hooks/useCards.js";
import { useToast } from "./hooks/useToast.js";

import AuthPage          from "./pages/AuthPage.jsx";
import DashboardPage     from "./pages/DashboardPage.jsx";
import CardsPage         from "./pages/CardsPage.jsx";
import TransferPage      from "./pages/TransferPage.jsx";
import TransactionsPage  from "./pages/TransactionsPage.jsx";

import Sidebar from "./components/Sidebar.jsx";
import { Toast } from "./components/ui/index.js";

export default function App() {
  const { token, username, userId, isAdmin, login, register, logout } = useAuth();
  const { cards, page, loading, actionLoading, load, create, remove, block, updateStatus } = useCards(token);
  const { toast, notify, dismiss } = useToast();

  const [activeTab,      setActiveTab]      = useState("dashboard");
  const [transferFromId, setTransferFromId] = useState(null);

  useEffect(() => { if (token) load(0); }, [token]);

  const handleAuth = async (mode, form) => {
    if (mode === "login") {
      const ok = await login(form);
      if (!ok) throw new Error("Invalid username or password");
    } else {
      const ok = await register(form);
      if (!ok) throw new Error("Registration failed");
    }
  };

  const handleCreate = async (p) => {
    const r = await create(p);
    r.ok ? notify("Card issued successfully", "success") : notify(r.message, "error");
    return r;
  };
  const handleDelete = async (id) => {
    const r = await remove(id);
    r.ok ? notify("Card deleted", "success") : notify(r.message, "error");
    return r;
  };
  const handleBlock = async (id, reason) => {
    const r = await block(id, reason);
    r.ok ? notify("Card blocked", "success") : notify(r.message, "error");
    return r;
  };
  const handleUnblock = async (id) => {
    const r = await updateStatus(id, "ACTIVE");
    r.ok ? notify("Card unblocked", "success") : notify(r.message, "error");
    return r;
  };
  const handleTransferFrom = (id) => {
    setTransferFromId(id);
    setActiveTab("transfer");
  };

  if (!token) return (
    <>
      <AuthPage onAuth={handleAuth}/>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={dismiss}/>}
    </>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg)" }}>
      <Sidebar activeTab={activeTab} username={username} isAdmin={isAdmin}
        onTabChange={setActiveTab} onLogout={logout}/>

      <main style={{ flex:1, padding:"32px 36px", overflowY:"auto",
        maxWidth:"calc(100vw - 260px)", minHeight:"100vh" }}>

        {activeTab==="dashboard" && (
          <DashboardPage cards={cards} onTabChange={setActiveTab}/>
        )}
        {activeTab==="cards" && (
          <CardsPage cards={cards} page={page} loading={loading} actionLoading={actionLoading}
            isAdmin={isAdmin} userId={userId} onLoad={load}
            onCreate={handleCreate} onDelete={handleDelete}
            onBlock={handleBlock} onUnblock={handleUnblock}
            onTransferFrom={handleTransferFrom}/>
        )}
        {activeTab==="transfer" && (
          <TransferPage cards={cards} token={token} notify={notify}
            preselectedFromId={transferFromId}/>
        )}
        {activeTab==="transactions" && <TransactionsPage/>}
        {activeTab==="settings" && (
          <div style={{ animation:"fadeUp .4s ease" }}>
            <h2 style={{ fontSize:24, fontWeight:800, color:"var(--text)", marginBottom:24 }}>Settings</h2>
            <div style={{ background:"#fff", borderRadius:20, padding:32,
              border:"1.5px solid var(--border)", textAlign:"center", color:"var(--text-3)" }}>
              <p style={{ fontSize:15 }}>Settings panel — coming soon</p>
            </div>
          </div>
        )}
      </main>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={dismiss}/>}
    </div>
  );
}
