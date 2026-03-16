import { useState } from "react";
import { Button, Input, Icon } from "../components/ui/index.js";

const INITIAL_FORM = {
  username:    "",
  password:    "",
  email:       "",
  firstName:   "",
  lastName:    "",
  phoneNumber: "",
};

export default function AuthPage({ onAuth }) {
  const [mode,    setMode]    = useState("login");
  const [form,    setForm]    = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    setMessage({ text: "", type: "" });
    setLoading(true);
    try {
      await onAuth(mode, form);
      if (mode === "register") {
        setMessage({ text: "✓ Аккаунт создан — выполните вход", type: "success" });
        setMode("login");
        setForm(INITIAL_FORM);
      }
    } catch (e) {
      setMessage({ text: e.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--bg)", position:"relative", overflow:"hidden" }}>
      {/* grid bg */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)", backgroundSize:"60px 60px", pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:500, height:500, background:"radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:440, padding:24, animation:"fadeUp .5s ease" }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:64, height:64, background:"linear-gradient(135deg, var(--gold), #8a6520)", borderRadius:18, marginBottom:16, boxShadow:"0 8px 32px var(--gold-glow)" }}>
            <Icon name="card" size={28} color="#080c14" />
          </div>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:36, fontWeight:300, color:"var(--text)", letterSpacing:"0.04em" }}>VAULT</h1>
          <p style={{ color:"var(--muted)", fontSize:12, letterSpacing:"0.15em", marginTop:4 }}>BANKING MANAGEMENT</p>
        </div>

        <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:20, padding:32 }}>
          {/* Tabs */}
          <div style={{ display:"flex", background:"var(--bg)", borderRadius:10, padding:3, marginBottom:24 }}>
            {["login", "register"].map((m) => (
              <button key={m} onClick={() => { setMode(m); setMessage({ text:"", type:"" }); }}
                style={{ flex:1, padding:"9px 0", borderRadius:8, border:"none", background:mode===m?"var(--surface)":"transparent", color:mode===m?"var(--gold)":"var(--muted)", fontSize:12, cursor:"pointer", fontFamily:"var(--font-mono)", letterSpacing:"0.08em", transition:"all .2s", fontWeight:mode===m?700:400 }}>
                {m === "login" ? "ВХОД" : "РЕГИСТРАЦИЯ"}
              </button>
            ))}
          </div>

          {/* Login fields */}
          {mode === "login" && (
            <>
              <Input label="Логин" value={form.username} onChange={setField("username")} placeholder="username" onKeyDown={handleKeyDown} autoComplete="username" />
              <Input label="Пароль" type="password" value={form.password} onChange={setField("password")} placeholder="••••••••" onKeyDown={handleKeyDown} autoComplete="current-password" />
            </>
          )}

          {/* Register fields */}
          {mode === "register" && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 14px" }}>
                <Input label="Имя *" value={form.firstName} onChange={setField("firstName")} placeholder="Иван" onKeyDown={handleKeyDown} />
                <Input label="Фамилия *" value={form.lastName} onChange={setField("lastName")} placeholder="Иванов" onKeyDown={handleKeyDown} />
              </div>
              <Input label="Логин *" value={form.username} onChange={setField("username")} placeholder="username" onKeyDown={handleKeyDown} autoComplete="username" />
              <Input label="Email *" type="email" value={form.email} onChange={setField("email")} placeholder="mail@example.com" onKeyDown={handleKeyDown} />
              <Input label="Пароль * (мин. 8 символов)" type="password" value={form.password} onChange={setField("password")} placeholder="••••••••" onKeyDown={handleKeyDown} autoComplete="new-password" />
              <Input label="Телефон" value={form.phoneNumber} onChange={setField("phoneNumber")} placeholder="+7 (999) 000-00-00" onKeyDown={handleKeyDown} />
            </>
          )}

          {/* Message */}
          {message.text && (
            <div style={{ fontSize:12, color:message.type==="success"?"var(--success)":"var(--danger)", padding:"10px 12px", background:message.type==="success"?"rgba(34,197,94,.08)":"rgba(239,68,68,.08)", border:`1px solid ${message.type==="success"?"rgba(34,197,94,.2)":"rgba(239,68,68,.2)"}`, borderRadius:8, marginBottom:14 }}>
              {message.text}
            </div>
          )}

          <Button fullWidth loading={loading} onClick={handleSubmit} style={{ marginTop:4 }}>
            {mode === "login" ? "ВОЙТИ" : "СОЗДАТЬ АККАУНТ"}
          </Button>
        </div>
      </div>
    </div>
  );
}
