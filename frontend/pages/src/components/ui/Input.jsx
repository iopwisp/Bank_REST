import { useState } from "react";
export default function Input({ label, style:extra={}, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom:16 }}>
      {label && <label style={{ display:"block", fontSize:13, fontWeight:600,
        color: focused?"var(--primary)":"var(--text-2)", marginBottom:6, transition:"color .2s" }}>
        {label}
      </label>}
      <input {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e  => { setFocused(false); props.onBlur?.(e); }}
        style={{ width:"100%", background:"var(--bg)", border:`1.5px solid ${focused?"var(--primary)":"var(--border)"}`,
          borderRadius:10, padding:"12px 16px", color:"var(--text)", fontSize:14,
          fontFamily:"var(--font)", outline:"none", transition:"border-color .2s",
          "::placeholder": { color:"var(--text-3)" }, ...extra }} />
    </div>
  );
}
