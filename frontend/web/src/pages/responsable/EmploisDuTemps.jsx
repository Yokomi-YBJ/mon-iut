import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Alert from '../../components/common/Alert';
import { UploadCloud, Calendar, FileText } from 'lucide-react';

export const ResponsableEDT = () => {
  const [parcoursList, setParcoursList] = useState([]);
  const [titre, setTitre] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedParcours, setSelectedParcours] = useState('');
  const [niveau, setNiveau] = useState('ALL');
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await apiClient.get('/web/responsable/overview');
        setParcoursList(res.data.data.parcours || []);
      } catch (err) {
        setAlert({ type: 'error', message: 'Erreur lors du chargement des parcours.' });
      }
    };
    fetchOverview();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setAlert({ type: 'error', message: 'Seuls les fichiers PDF sont acceptés.' });
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      if (!titre) {
        setTitre(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setAlert({ type: 'error', message: 'Veuillez sélectionner un fichier PDF.' });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('fichier', selectedFile);
      formData.append('titre', titre);
      if (selectedParcours) formData.append('id_parcours', selectedParcours);
      formData.append('niveau', niveau);

      const res = await apiClient.post('/web/responsable/edt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAlert({ type: 'success', message: res.data.message });
      setSelectedFile(null);
      setTitre('');
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Erreur lors de la publication de l\'emploi du temps.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Publication des Emplois du Temps (EDT)"
        subtitle="Mise à disposition des plannings de cours hebdomadaires pour les étudiants"
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

      <Card title="Téléverser un nouvel Emploi du Temps">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 hover:border-iut-orange bg-gray-50 rounded-lg p-6 text-center transition-colors cursor-pointer relative">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <Calendar className="w-10 h-10 mx-auto text-iut-orange mb-2" />
            <span className="text-sm font-semibold text-iut-text-dark block">
              {selectedFile ? selectedFile.name : 'Sélectionner le planning en format PDF'}
            </span>
            <span className="text-xs text-iut-text-grey mt-1 block">
              Format PDF (Max 15 Mo)
            </span>
          </div>

          <Input
            label="Intitulé de l'emploi du temps"
            placeholder="Ex : Emploi du temps S3 - Semaine du 10 Mars"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Parcours spécifique"
              value={selectedParcours}
              onChange={(e) => setSelectedParcours(e.target.value)}
              options={parcoursList.map((p) => ({
                value: p.id,
                label: p.nom_parcours,
              }))}
              placeholder="Tous les parcours de la filière"
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

          <div className="pt-2 text-right">
            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
              icon={UploadCloud}
            >
              Publier l'emploi du temps
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ResponsableEDT;
