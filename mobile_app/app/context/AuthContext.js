import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fonction de connexion
  const login = (userData) => {
    setUser(userData);
  };

  // Fonction de déconnexion complète
  const logout = () => {
    setUser(null);
    // Ici, si tu utilises AsyncStorage pour garder la session active,
    // tu devrais ajouter : await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};