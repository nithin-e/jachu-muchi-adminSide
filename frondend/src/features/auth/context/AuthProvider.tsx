import { useState, ReactNode, useEffect } from "react";
import { loginApi } from "../api/authApi";
import { setUnauthorizedHandler } from "@lib/apiClient";
import { AuthContext } from "./AuthContext";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const ADMIN_EMAIL_KEY = "adminEmail";

const getStoredAuthState = () => {
  try {
    const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY) ?? "";
    const adminEmail = window.localStorage.getItem(ADMIN_EMAIL_KEY) ?? "";
    return {
      isAuthenticated: Boolean(accessToken),
      adminEmail,
    };
  } catch {
    return { isAuthenticated: false, adminEmail: "" };
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => getStoredAuthState().isAuthenticated);
  const [adminEmail, setAdminEmail] = useState(() => getStoredAuthState().adminEmail);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi({ email, password });
      if (!response.accessToken || !response.user?.email) {
        return false;
      }

      try {
        window.localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
        window.localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
        window.localStorage.setItem(ADMIN_EMAIL_KEY, response.user.email);
      } catch {
      }
      setIsAuthenticated(true);
      setAdminEmail(response.user.email);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    try {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
      window.localStorage.removeItem(ADMIN_EMAIL_KEY);
    } catch {
    }
    setIsAuthenticated(false);
    setAdminEmail("");
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      window.location.replace('/admin/login');
    };
    setUnauthorizedHandler(handleUnauthorized);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
