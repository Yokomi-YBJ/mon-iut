import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-iut-bg">
        <Loader label="Vérification de la session..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Si des rôles spécifiques sont requis, vérifier l'autorisation
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirection automatique selon le rôle de l'utilisateur
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'responsable') return <Navigate to="/responsable" replace />;
    if (user.role === 'enseignant') return <Navigate to="/enseignant" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
