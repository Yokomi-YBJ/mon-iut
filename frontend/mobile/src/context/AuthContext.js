import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger la session stockée localement au démarrage
  useEffect(() => {
    const loadStoredSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@mon_iut_user');
        const token = await AsyncStorage.getItem('@mon_iut_access_token');

        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
          // Vérifier la validité auprès du serveur
          try {
            const res = await apiClient.get('/auth/me');
            if (res.data.success) {
              setUser(res.data.user);
              await AsyncStorage.setItem('@mon_iut_user', JSON.stringify(res.data.user));
            }
          } catch (netErr) {
            // Si le serveur est inaccessible temporairement, garder l'utilisateur local
          }
        }
      } catch (err) {
        // Ignorer
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredSession();
  }, []);

  // Fonction de connexion
  const login = async (matricule, password) => {
    // CORRECTION : utilisation de la route /auth/login et de la clé "identifiant"
    const response = await apiClient.post('/auth/login', {
      identifiant: matricule,
      password,
    });

    const { user: userData, accessToken, refreshToken } = response.data;

    await AsyncStorage.multiSet([
      ['@mon_iut_access_token', accessToken],
      ['@mon_iut_refresh_token', refreshToken],
      ['@mon_iut_user', JSON.stringify(userData)],
    ]);

    setUser(userData);
    return userData;
  };

  // Fonction de déconnexion complète
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        '@mon_iut_access_token',
        '@mon_iut_refresh_token',
        '@mon_iut_user',
      ]);
    } catch (e) {
      // Ignorer
    } finally {
      setUser(null);
    }
  };

  const updateUser = async (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    await AsyncStorage.setItem('@mon_iut_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

export default AuthContext;