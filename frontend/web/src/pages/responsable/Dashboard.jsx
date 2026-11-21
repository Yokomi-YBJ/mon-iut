import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { Users, BookOpen, Calendar, CheckSquare, Bell, ArrowRight } from 'lucide-react';

export const ResponsableDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await apiClient.get('/web/responsable/overview');
        setOverview(res.data.data);
      } catch (err) {
        setError('Impossible de charger les données de votre département.');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) return <Loader label="Chargement de l'espace Responsable Pédagogique..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title={`Département : ${overview?.nom_filiere || 'Filière'}`}
        subtitle="Supervision pédagogique, suivi des effectifs et validation des résultats"
      />

      {error && <Alert type="error" className="mb-6">{error}</Alert>}

      {/* KPI Stats Filière */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg border border-iut-border border-l-4 border-l-iut-blue shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-iut-text-grey uppercase tracking-wider">
              Étudiants du département
            </span>
            <p className="text-2xl font-bold text-iut-blue mt-1">
              {overview?.totalEtudiants || 0}
            </p>
            <p className="text-xs text-iut-text-grey">
              {overview?.etudiantsActifs || 0} inscrits actifs
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-iut-blue">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-iut-border border-l-4 border-l-iut-orange shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-iut-text-grey uppercase tracking-wider">
              Parcours de formation
            </span>
            <p className="text-2xl font-bold text-iut-orange mt-1">
              {overview?.totalParcours || 0}
            </p>
            <p className="text-xs text-iut-text-grey">Options spécialisées</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-iut-orange">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-iut-border border-l-4 border-l-iut-blue shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-iut-text-grey uppercase tracking-wider">
              Statut Pédagogique
            </span>
            <p className="text-base font-bold text-iut-blue mt-1">
              Semestre en cours
            </p>
            <p className="text-xs text-iut-success font-medium">Session Normale</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-iut-success">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Modules de direction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card title="Gestion Académique">
          <div className="space-y-3">
            <Link
              to="/responsable/etudiants"
              className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded hover:border-iut-orange transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-iut-blue" />
                <div>
                  <h4 className="text-sm font-semibold text-iut-text-dark">
                    Effectifs et Suivi des Étudiants
                  </h4>
                  <p className="text-xs text-iut-text-grey">
                    Listes d'appel par parcours et par niveau
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-iut-text-grey" />
            </Link>

            <Link
              to="/responsable/notes"
              className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded hover:border-iut-orange transition-colors"
            >
              <div className="flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-iut-blue" />
                <div>
                  <h4 className="text-sm font-semibold text-iut-text-dark">
                    Synthèse & Validation des Notes
                  </h4>
                  <p className="text-xs text-iut-text-grey">
                    Moyennes de classe, notes minimales et maximales par UE
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-iut-text-grey" />
            </Link>
          </div>
        </Card>

        <Card title="Organisation & Diffusion">
          <div className="space-y-3">
            <Link
              to="/responsable/edt"
              className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded hover:border-iut-orange transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-iut-orange" />
                <div>
                  <h4 className="text-sm font-semibold text-iut-text-dark">
                    Emplois du Temps (EDT)
                  </h4>
                  <p className="text-xs text-iut-text-grey">
                    Publier et actualiser les plannings de cours hebdomadaires
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-iut-text-grey" />
            </Link>

            <Link
              to="/responsable/notifs"
              className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded hover:border-iut-orange transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-iut-orange" />
                <div>
                  <h4 className="text-sm font-semibold text-iut-text-dark">
                    Circulaires et Avis de Département
                  </h4>
                  <p className="text-xs text-iut-text-grey">
                    Diffuser les consignes officielles aux étudiants de la filière
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-iut-text-grey" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Parcours rattachés */}
      <Card title="Parcours rattachés à votre département">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {overview?.parcours?.map((p) => (
            <div key={p.id} className="p-3 bg-gray-50 border border-gray-200 rounded">
              <span className="font-semibold text-xs text-iut-blue block">
                {p.nom_parcours}
              </span>
              <span className="text-[11px] text-iut-text-grey">
                Code ID : #{p.id}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ResponsableDashboard;
