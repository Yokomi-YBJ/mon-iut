import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Alert from '../../components/common/Alert';
import Table from '../../components/common/Table';
import { UploadCloud, FileText, Download } from 'lucide-react';

export const EnseignantDocuments = () => {
  const [assignments, setAssignments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [titre, setTitre] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedParcours, setSelectedParcours] = useState('');
  const [niveau, setNiveau] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assignmentsRes, docsRes] = await Promise.all([
        apiClient.get('/web/enseignant/assignments'),
        apiClient.get('/web/enseignant/documents'),
      ]);
      setAssignments(assignmentsRes.data.data);
      setDocuments(docsRes.data.data);
    } catch (err) {
      setAlert({ type: 'error', message: 'Erreur lors du chargement des données.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      setAlert({ type: 'error', message: 'Veuillez joindre un fichier PDF.' });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('fichier', selectedFile);
      formData.append('titre', titre);
      if (selectedParcours) formData.append('id_parcours', selectedParcours);
      formData.append('niveau', niveau);

      const res = await apiClient.post('/web/enseignant/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAlert({ type: 'success', message: res.data.message });
      setSelectedFile(null);
      setTitre('');
      fetchData();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Erreur lors de la publication du document.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Titre du Support',
      render: (row) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-iut-orange flex-shrink-0" />
          <span className="font-semibold text-iut-text-dark">{row.titre}</span>
        </div>
      ),
    },
    {
      header: 'Destinataires',
      render: (row) => (
        <span className="text-xs text-iut-text-grey">
          {row.total_destinataires || 0} étudiant(s) ciblé(s)
        </span>
      ),
    },
    {
      header: 'Date de dépôt',
      render: (row) => (
        <span className="text-xs text-iut-text-grey">
          {new Date(row.date_publication).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Fichier',
      align: 'right',
      render: (row) => (
        <a
          href={`http://localhost:5000/${row.url_fichier}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-iut-blue hover:text-iut-orange"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Télécharger</span>
        </a>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Supports & Polycopiés de Cours"
        subtitle="Partage de travaux pratiques, diapositives et documents de révision"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card title="Publier un support de cours">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 hover:border-iut-orange bg-gray-50 rounded-lg p-5 text-center transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <UploadCloud className="w-8 h-8 mx-auto text-iut-text-grey mb-1" />
                <span className="text-xs font-semibold text-iut-text-dark block">
                  {selectedFile ? selectedFile.name : 'Sélectionner le PDF'}
                </span>
                <span className="text-[11px] text-iut-text-grey block">PDF jusqu\'à 15 Mo</span>
              </div>

              <Input
                label="Titre du document"
                placeholder="Ex : TD 3 - Corrigé UML"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
              />

              <Select
                label="Classe destinataire"
                value={selectedParcours}
                onChange={(e) => setSelectedParcours(e.target.value)}
                options={assignments.map((a) => ({
                  value: a.id_parcours,
                  label: `${a.nom_matiere} (${a.nom_parcours})`,
                }))}
                placeholder="Toutes mes classes"
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

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={submitting}
                icon={UploadCloud}
              >
                Mettre à disposition
              </Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card title="Supports actuellement disponibles">
            <Table
              columns={columns}
              data={documents}
              isLoading={loading}
              emptyMessage="Aucun support de cours n'a été publié."
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnseignantDocuments;
