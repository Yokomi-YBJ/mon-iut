import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Alert from '../../components/common/Alert';
import { Send, MessageSquare } from 'lucide-react';

export const EnseignantCommuniques = () => {
  const [assignments, setAssignments] = useState([]);
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [selectedParcours, setSelectedParcours] = useState('');
  const [niveau, setNiveau] = useState('ALL');
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await apiClient.get('/web/enseignant/assignments');
        setAssignments(res.data.data);
      } catch (err) {
        setAlert({ type: 'error', message: 'Erreur lors du chargement de vos classes.' });
      }
    };

    fetchAssignments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiClient.post('/web/enseignant/communiques', {
        titre,
        contenu,
        id_parcours: selectedParcours ? parseInt(selectedParcours, 10) : null,
        niveau,
      });

      setAlert({ type: 'success', message: res.data.message });
      setTitre('');
      setContenu('');
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Erreur lors de l\'envoi du communiqué.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Communiqués aux Étudiants"
        subtitle="Informer vos étudiants d'un devoir, rattrapage, changement de salle ou consigne de projet"
      />

      {alert && (
        <Alert
          type={alert.type}
          className="mb-6"
          onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}

      <Card title="Nouveau Communiqué">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Objet du communiqué"
            placeholder="Ex : Rattrapage TD Circuits Logiques"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Classe / Parcours destinataire"
              value={selectedParcours}
              onChange={(e) => setSelectedParcours(e.target.value)}
              options={assignments.map((a) => ({
                value: a.id_parcours,
                label: `${a.nom_matiere} - ${a.nom_parcours} (${a.niveau})`,
              }))}
              placeholder="Tous mes étudiants affectés"
            />

            <Select
              label="Niveau"
              value={niveau}
              onChange={(e) => setNiveau(e.target.value)}
              options={[
                { value: 'ALL', label: 'Tous niveaux' },
                { value: '1', label: 'Niveau 1' },
                { value: '2', label: 'Niveau 2' },
                { value: '3', label: 'Niveau 3' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-semibold text-iut-text-dark uppercase tracking-wider">
              Message détaillé <span className="text-iut-danger">*</span>
            </label>
            <textarea
              rows={6}
              required
              placeholder="Rédigez ici les consignes, dates et détails à l'attention des étudiants..."
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-iut-border rounded text-sm text-iut-text-dark focus:outline-none focus:border-iut-orange focus:ring-2 focus:ring-iut-orange/20"
            />
          </div>

          <div className="pt-2 text-right">
            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
              icon={Send}
            >
              Diffuser le communiqué
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EnseignantCommuniques;
