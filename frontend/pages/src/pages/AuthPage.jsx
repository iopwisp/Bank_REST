import { useState } from "react";
import { Button, Input, Icon } from "../components/ui/index.js";

const INIT = { username:"", password:"", email:"", firstName:"", lastName:"", phoneNumber:"" };

export default function AuthPage({ onAuth }) {
  const [mode,    setMode]    = useState("login");
  const [form,    setForm]    = useState(INIT);
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState({ text:"", type:"" });

  const sf = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const submit = async () => {
    setMsg({ text:"", type:"" });
    setLoading(true);
    try {
      await onAuth(mode, form);
      if (mode==="register") { setMsg({ text:"✓ Account created — please sign in", type:"success" }); setMode("login"); setForm(INIT); }
    } catch(e) { setMsg({ text:e.message, type:"error" }); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"var(--bg)" }}>
      {/* Left panel */}
      <div style={{ flex:"0 0 480px", background:"var(--primary)", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", padding:48, position:"relative", overflow:"hidden" }}>
        {/* Decorative circles */}
        <div style={{ position:"absolute", top:-80, right:-80, width:280, height:280,
          borderRadius:"50%", background:"rgba(255,255,255,.07)" }}/>
        <div style={{ position:"absolute", bottom:-60, left:-60, width:220, height:220,
          borderRadius:"50%", background:"rgba(255,255,255,.05)" }}/>
        <div style={{ position:"relative", textAlign:"center" }}>
          <div style={{ width:64, height:64, background:"rgba(255,255,255,.2)", borderRadius:20,
            display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
            <Icon name="card" size={30} color="#fff" strokeWidth={2}/>
          </div>
          <h1 style={{ fontFamily:"var(--font)", fontSize:32, fontWeight:800, color:"#fff",
            letterSpacing:"-0.03em", marginBottom:12 }}>VaultBank</h1>
          <p style={{ color:"rgba(255,255,255,.7)", fontSize:15, lineHeight:1.6 }}>
            Your modern banking<br/>management platform
          </p>
          <div style={{ marginTop:40, display:"flex", flexDirection:"column", gap:16 }}>
            {["Bank-grade security","Instant transfers","Real-time analytics"].map(t=>(
              <div key={t} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background:"rgba(255,255,255,.2)",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="check" size={11} color="#fff" strokeWidth={2.5}/>
                </div>
                <span style={{ color:"rgba(255,255,255,.85)", fontSize:14, fontWeight:500 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:48, overflowY:"auto" }}>
        <div style={{ width:"100%", maxWidth:400, animation:"fadeUp .5s ease" }}>
          <h2 style={{ fontSize:26, fontWeight:800, color:"var(--text)", marginBottom:6, letterSpacing:"-0.02em" }}>
            {mode==="login" ? "Welcome back 👋" : "Create account"}
          </h2>
          <p style={{ color:"var(--text-2)", fontSize:14, marginBottom:32 }}>
            {mode==="login" ? "Sign in to your account" : "Fill in the details below"}
          </p>

          {/* Tabs */}
          <div style={{ display:"flex", background:"var(--bg)", borderRadius:12, padding:4,
            marginBottom:28, border:"1.5px solid var(--border)" }}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setMsg({text:"",type:""}); }}
                style={{ flex:1, padding:"9px 0", borderRadius:9, border:"none",
                  background:mode===m?"#fff":"transparent", color:mode===m?"var(--primary)":"var(--text-3)",
                  fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"var(--font)",
                  boxShadow:mode===m?"var(--shadow-sm)":"none", transition:"all .2s" }}>
                {m==="login"?"Sign In":"Register"}
              </button>
            ))}
          </div>

          {mode==="login" && <>
            <Input label="Username" value={form.username} onChange={sf("username")} placeholder="your_username" onKeyDown={e=>e.key==="Enter"&&submit()} autoComplete="username"/>
            <Input label="Password" type="password" value={form.password} onChange={sf("password")} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&submit()} autoComplete="current-password"/>
          </>}

          {mode==="register" && <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 14px" }}>
              <Input label="First Name *" value={form.firstName} onChange={sf("firstName")} placeholder="Ivan"/>
              <Input label="Last Name *" value={form.lastName} onChange={sf("lastName")} placeholder="Ivanov"/>
            </div>
            <Input label="Username *" value={form.username} onChange={sf("username")} placeholder="username" autoComplete="username"/>
            <Input label="Email *" type="email" value={form.email} onChange={sf("email")} placeholder="mail@example.com"/>
            <Input label="Password * (min 8)" type="password" value={form.password} onChange={sf("password")} placeholder="••••••••" autoComplete="new-password"/>
            <Input label="Phone" value={form.phoneNumber} onChange={sf("phoneNumber")} placeholder="+7 (999) 000-00-00"/>
          </>}

          {msg.text && (
            <div style={{ fontSize:13, fontWeight:500, padding:"11px 14px", borderRadius:10, marginBottom:16,
              background:msg.type==="success"?"var(--success-lt)":"var(--danger-lt)",
              color:msg.type==="success"?"var(--success)":"var(--danger)",
              border:`1.5px solid ${msg.type==="success"?"rgba(22,199,132,.25)":"rgba(244,67,108,.25)"}` }}>
              {msg.text}
            </div>
          )}

          <Button fullWidth loading={loading} onClick={submit}>
            {mode==="login" ? "Sign In" : "Create Account"}
          </Button>
        </div>
      </div>
    </div>
  );
}
