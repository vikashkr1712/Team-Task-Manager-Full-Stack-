import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken } from "../api/client.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const applySession = (data) => {
    setUser(data?.user || null);
    const token = data?.accessToken || null;
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
    setAuthToken(token);
  };

  const refresh = async () => {
    try {
      const { data } = await api.post("/api/auth/refresh");
      applySession(data);
    } catch (error) {
      applySession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAuthToken(token);
    }
    refresh();
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post("/api/auth/login", credentials);
    applySession(data);
  };

  const signup = async (payload) => {
    const { data } = await api.post("/api/auth/signup", payload);
    applySession(data);
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    applySession(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, signup, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
