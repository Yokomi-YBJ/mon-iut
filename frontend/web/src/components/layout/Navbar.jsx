import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getNavLinks = () => {
    if (!user) return [];

    if (user.role === 'admin') {
      return [
        { label: 'Tableau de bord', to: '/admin' },
        { label: 'Gestion Étudiants', to: '/admin/etudiants' },
        { label: 'Gestion Enseignants', to: '/admin/professeurs' },
        { label: 'Annonces', to: '/admin/annonces' },
        { label: 'Documents', to: '/admin/documents' },
      ];
    }

    if (user.role === 'responsable') {
      return [
        { label: 'Vue d\'ensemble', to: '/responsable' },
        { label: 'Suivi Étudiants', to: '/responsable/etudiants' },
        { label: 'Synthèse des Notes', to: '/responsable/notes' },
        { label: 'Emplois du Temps', to: '/responsable/edt' },
        { label: 'Circulaires', to: '/responsable/notifs' },
      ];
    }

    if (user.role === 'enseignant') {
      return [
        { label: 'Mes Cours', to: '/enseignant' },
        { label: 'Saisie des Notes', to: '/enseignant/notes' },
        { label: 'Communiqués', to: '/enseignant/communiques' },
        { label: 'Supports de Cours', to: '/enseignant/documents' },
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'admin':
        return 'Administrateur';
      case 'responsable':
        return `Resp. Pédagogique (${user.nom_filiere || 'Filière'})`;
      case 'enseignant':
        return 'Enseignant';
      case 'etudiant':
        return 'Étudiant';
      default:
        return 'Utilisateur';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-iut-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Titre */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Logo IUT"
              className="h-10 w-10 object-contain rounded-full border border-gray-100"
            />
            <span className="text-xl font-bold text-iut-blue">
              Mon <span className="text-iut-orange">IUT</span>
            </span>
          </Link>

          {/* Navigation centrale */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin' || link.to === '/enseignant' || link.to === '/responsable'}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-semibold rounded transition-colors ${
                    isActive
                      ? 'text-iut-orange border-b-2 border-iut-orange'
                      : 'text-iut-text-dark hover:text-iut-orange'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Profil & Déconnexion */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-iut-blue leading-tight">
                    {user.nom} {user.prenom}
                  </span>
                  <span className="text-[11px] text-iut-text-grey">
                    {getRoleLabel()}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-iut-blue border border-iut-blue rounded hover:bg-iut-blue hover:text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-iut-blue"
                  title="Se déconnecter"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-white bg-iut-orange hover:bg-iut-orange-hover rounded transition-colors"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
