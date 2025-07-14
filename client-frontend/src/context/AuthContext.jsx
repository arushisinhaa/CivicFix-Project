import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false,
    userEmail: "",
    loading: true,
  });

  const verifySession = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/test`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAuthState({
          isAuthenticated: true,
          isAdmin: data.isAdmin,
          userEmail: data.email,
          loading: false,
        });
      } else {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error("Session verification error:", error);
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    verifySession();
  }, []);

  const login = (email, isAdmin) => {
    setAuthState({
      isAuthenticated: true,
      isAdmin,
      userEmail: email,
      loading: false,
    });
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setAuthState({
        isAuthenticated: false,
        isAdmin: false,
        userEmail: "",
        loading: false,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{ ...authState, login, logout, verifySession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
