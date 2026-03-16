import { useState } from "react";
import { authApi } from "../api/index.js";

/** Decode JWT payload (base64url → JSON) without verifying signature */
function parseJwtPayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

export function useAuth() {
  const [token,    setToken]    = useState(null);
  const [username, setUsername] = useState("");
  const [userId,   setUserId]   = useState(null);
  const [isAdmin,  setIsAdmin]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const _applyAuth = (data) => {
    const jwt     = data.token;
    const payload = parseJwtPayload(jwt);

    // Backend stores roles as Set<String> like "ADMIN", "USER" in user_roles table.
    // The JWT claims don't include roles (JwtService adds none), but Spring Security
    // authorities are prefixed with ROLE_. We check both forms.
    const authorities = payload.authorities || payload.roles || [];
    const admin = authorities.some(
      (a) => a === "ROLE_ADMIN" || a === "ADMIN"
    );

    setToken(jwt);
    setUsername(data.username);
    setUserId(data.userId);
    setIsAdmin(admin);
  };

  const login = async (credentials) => {
    setError(""); setLoading(true);
    try {
      const data = await authApi.login(credentials);
      _applyAuth(data);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setError(""); setLoading(true);
    try {
      await authApi.register(userData);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUsername("");
    setUserId(null);
    setIsAdmin(false);
  };

  return { token, username, userId, isAdmin, loading, error, setError, login, register, logout };
}
