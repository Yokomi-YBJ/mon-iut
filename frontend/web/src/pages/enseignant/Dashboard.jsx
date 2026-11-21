import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { BookOpen, Edit3, MessageSquare, FileText, ArrowRight } from 'lucide-react';

export const EnseignantDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await apiClient.get('/web/enseignant/assignments');
        setAssignments(res.data.data);
      } catch (err) {
        setError('Impossible de charger vos matières affectées.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) return <Loader label="Chargement de votre espace enseignant..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Espace Enseignant"
        subtitle="Gestion pédagogique de vos enseignements et saisie des évaluations"
      />

      {error && <Alert type="error" className="mb-6">{error}</Alert>}

      {/* Cartes d'accès rapide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/enseignant/notes"
          className="bg-white p-5 rounded-lg border border-iut-border border-l-4 border-l-iut-orange shadow-sm hover:shadow transition-shadow flex items-center justify-between"
        >
          <div>
            <h3 className="text-base font-bold text-iut-blue">Saisie des Notes</h3>
            <p className="text-xs text-iut-text-grey mt-1">
              Contrôles continus, TP et examens de synthèse
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-iut-orange">
            <Edit3 className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/enseignant/communiques"
          className="bg-white p-5 rounded-lg border border-iut-border border-l-4 border-l-iut-blue shadow-sm hover:shadow transition-shadow flex items-center justify-between"
        >
          <div>
            <h3 className="text-base font-bold text-iut-blue">Communiqués</h3>
            <p className="text-xs text-iut-text-grey mt-1">
              Informer vos classes et étudiants
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-iut-blue">
            <MessageSquare className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/enseignant/documents"
          className="bg-white p-5 rounded-lg border border-iut-border border-l-4 border-l-iut-orange shadow-sm hover:shadow transition-shadow flex items-center justify-between"
        >
          <div>
            <h3 className="text-base font-bold text-iut-blue">Supports de Cours</h3>
            <p className="text-xs text-iut-text-grey mt-1">
              Téléverser des polycopiés et travaux dirigés (PDF)
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-iut-orange">
            <FileText className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* Liste des cours affectés */}
      <Card title={`Matières et Cours Attribués (${assignments.length})`}>
        {assignments.length === 0 ? (
          <p className="text-xs text-iut-text-grey italic py-4">
            Aucune matière ne vous a été affectée pour le moment. Veuillez contacter la scolarité.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-iut-blue transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-sm text-iut-blue">
                      {item.code_matiere}
                    </span>
                    <Badge variant="primary" size="sm">{item.semestre}</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-iut-text-dark mb-1">
                    {item.nom_matiere}
                  </h4>
                  <p className="text-xs text-iut-text-grey">
                    {item.niveau} - {item.nom_parcours || item.nom_filiere || 'Tous parcours'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
                  <Link
                    to={`/enseignant/notes?matiere=${item.id_matiere}&parcours=${item.id_parcours}&niveau=${item.niveau}&semestre=${item.semestre}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-iut-orange hover:text-iut-orange-hover"
                  >
                    <span>Saisir les notes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default EnseignantDashboard;
