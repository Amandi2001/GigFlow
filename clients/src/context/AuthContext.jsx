import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check local storage on load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("gigflowUser"));
    if (storedUser) setUser(storedUser);
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("gigflowUser", JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("gigflowUser");
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
