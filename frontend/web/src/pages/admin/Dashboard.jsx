import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { Users, GraduationCap, FileText, Bell, PlusCircle, ArrowRight } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/web/admin/stats');
        setStats(response.data.data);
      } catch (err) {
        setError('Impossible de charger les statistiques du tableau de bord.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader label="Chargement du tableau de bord..." />;

  const statCards = [
    {
      title: 'Étudiants Inscrits',
      value: stats?.totalEtudiants || 0,
      subvalue: `${stats?.etudiantsActifs || 0} actifs`,
      icon: Users,
      link: '/admin/etudiants',
      color: 'border-l-4 border-l-iut-blue',
    },
    {
      title: 'Corps Enseignant',
      value: stats?.totalProfesseurs || 0,
      subvalue: 'Professeurs & Responsables',
      icon: GraduationCap,
      link: '/admin/professeurs',
      color: 'border-l-4 border-l-iut-orange',
    },
    {
      title: 'Documents Diffusés',
      value: stats?.totalDocuments || 0,
      subvalue: 'Circulaires, EDT, Cours',
      icon: FileText,
      link: '/admin/documents',
      color: 'border-l-4 border-l-iut-blue',
    },
    {
      title: 'Annonces Publiées',
      value: stats?.totalNotifications || 0,
      subvalue: 'Communications actives',
      icon: Bell,
      link: '/admin/annonces',
      color: 'border-l-4 border-l-iut-orange',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Tableau de bord Administrateur"
        subtitle="Vue globale de la gestion pédagogique et administrative de l'IUT"
      />

      {error && <Alert type="error" className="mb-6">{error}</Alert>}

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link
              key={i}
              to={stat.link}
              className={`bg-white p-5 rounded-lg border border-iut-border shadow-sm hover:shadow transition-shadow flex items-center justify-between ${stat.color}`}
            >
              <div>
                <span className="text-xs font-semibold text-iut-text-grey uppercase tracking-wider">
                  {stat.title}
                </span>
                <p className="text-2xl font-bold text-iut-blue mt-1">
                  {stat.value}
                </p>
                <p className="text-xs text-iut-text-grey mt-0.5">
                  {stat.subvalue}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-iut-blue">
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Raccourcis et Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Gestion Administrative">
          <p className="text-xs text-iut-text-grey mb-4">
            Accédez rapidement aux modules de gestion de l'établissement :
          </p>
          <div className="space-y-3">
            <Link
              to="/admin/etudiants"
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded hover:border-iut-orange transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-iut-blue" />
                <div>
                  <h4 className="text-sm font-semibold text-iut-text-dark">
                    Gestion des Étudiants
                  </h4>
                  <p className="text-xs text-iut-text-grey">
                    Inscriptions, affectations de parcours, statuts
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-iut-text-grey" />
            </Link>

            <Link
              to="/admin/professeurs"
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded hover:border-iut-orange transition-colors"
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-iut-blue" />
                <div>
                  <h4 className="text-sm font-semibold text-iut-text-dark">
                    Gestion des Enseignants
                  </h4>
                  <p className="text-xs text-iut-text-grey">
                    Affectations des matières et désignation des responsables
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-iut-text-grey" />
            </Link>
          </div>
        </Card>

        <Card title="Communication & Diffusion">
          <p className="text-xs text-iut-text-grey mb-4">
            Diffuser des informations et des documents officiels :
          </p>
          <div className="space-y-3">
            <Link
              to="/admin/annonces"
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded hover:border-iut-orange transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-iut-orange" />
                <div>
                  <h4 className="text-sm font-semibold text-iut-text-dark">
                    Diffuser une Annonce
                  </h4>
                  <p className="text-xs text-iut-text-grey">
                    Envoyer des notifications ciblées par cycle, filière ou parcours
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-iut-text-grey" />
            </Link>

            <Link
              to="/admin/documents"
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded hover:border-iut-orange transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-iut-orange" />
                <div>
                  <h4 className="text-sm font-semibold text-iut-text-dark">
                    Téléverser des Documents
                  </h4>
                  <p className="text-xs text-iut-text-grey">
                    Circulaires, emplois du temps et règlements officiels (PDF)
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-iut-text-grey" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
