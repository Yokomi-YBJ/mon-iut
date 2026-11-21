import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';

// Espace Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminEtudiants from './pages/admin/Etudiants';
import AdminProfesseurs from './pages/admin/Professeurs';
import AdminAnnonces from './pages/admin/Annonces';
import AdminDocuments from './pages/admin/Documents';

// Espace Enseignant
import EnseignantDashboard from './pages/enseignant/Dashboard';
import EnseignantSaisieNotes from './pages/enseignant/SaisieNotes';
import EnseignantCommuniques from './pages/enseignant/Communiques';
import EnseignantDocuments from './pages/enseignant/Documents';

// Espace Responsable Pédagogique
import ResponsableDashboard from './pages/responsable/Dashboard';
import ResponsableSuiviEtudiants from './pages/responsable/SuiviEtudiants';
import ResponsableValidationNotes from './pages/responsable/ValidationNotes';
import ResponsableEDT from './pages/responsable/EmploisDuTemps';
import ResponsableCirculaires from './pages/responsable/Circulaires';

// Layout principal avec Navbar
const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-iut-bg">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-iut-border py-4 text-center text-xs text-iut-text-grey">
        <p>Mon IUT - Plateforme de gestion académique et administrative unifiée</p>
      </footer>
    </div>
  );
};

// Redirection automatique selon le profil
const HomeRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'responsable') return <Navigate to="/responsable" replace />;
  if (user.role === 'enseignant') return <Navigate to="/enseignant" replace />;

  return <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Route publique de connexion */}
          <Route path="/login" element={<Login />} />

          {/* Redirection racine */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Routes protégées dans le layout applicatif */}
          <Route element={<AppLayout />}>
            {/* Espace Administrateur */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/etudiants" element={<AdminEtudiants />} />
              <Route path="/admin/professeurs" element={<AdminProfesseurs />} />
              <Route path="/admin/annonces" element={<AdminAnnonces />} />
              <Route path="/admin/documents" element={<AdminDocuments />} />
            </Route>

            {/* Espace Enseignant */}
            <Route element={<ProtectedRoute allowedRoles={['enseignant', 'responsable', 'admin']} />}>
              <Route path="/enseignant" element={<EnseignantDashboard />} />
              <Route path="/enseignant/notes" element={<EnseignantSaisieNotes />} />
              <Route path="/enseignant/communiques" element={<EnseignantCommuniques />} />
              <Route path="/enseignant/documents" element={<EnseignantDocuments />} />
            </Route>

            {/* Espace Responsable Pédagogique */}
            <Route element={<ProtectedRoute allowedRoles={['responsable', 'admin']} />}>
              <Route path="/responsable" element={<ResponsableDashboard />} />
              <Route path="/responsable/etudiants" element={<ResponsableSuiviEtudiants />} />
              <Route path="/responsable/notes" element={<ResponsableValidationNotes />} />
              <Route path="/responsable/edt" element={<ResponsableEDT />} />
              <Route path="/responsable/notifs" element={<ResponsableCirculaires />} />
            </Route>
          </Route>

          {/* Route 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
