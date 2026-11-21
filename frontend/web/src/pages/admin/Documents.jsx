import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Alert from '../../components/common/Alert';
import Table from '../../components/common/Table';
import { UploadCloud, FileText, Trash2, Download } from 'lucide-react';

export const AdminDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [structure, setStructure] = useState({ cycles: [], filieres: [], parcours: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  // Formulaire
  const [selectedFile, setSelectedFile] = useState(null);
  const [titre, setTitre] = useState('');
  const [typeDoc, setTypeDoc] = useState('ADMIN');
  const [cibleType, setCibleType] = useState('ALL');
  const [cibleId, setCibleId] = useState('');
  const [niveauCible, setNiveauCible] = useState('ALL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docsRes, structRes] = await Promise.all([
        apiClient.get('/web/admin/documents'),
        apiClient.get('/structure'),
      ]);
      setDocuments(docsRes.data.data);
      setStructure(structRes.data.data.flat);
    } catch (err) {
      setAlert({ type: 'error', message: 'Erreur lors du chargement des documents.' });
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
        setAlert({ type: 'error', message: 'Seuls les fichiers PDF sont autorisés.' });
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
      formData.append('type_doc', typeDoc);
      formData.append('cible_type', cibleType);
      if (cibleId) formData.append('cible_id', cibleId);
      formData.append('niveau_cible', niveauCible);

      const res = await apiClient.post('/web/admin/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAlert({ type: 'success', message: res.data.message });
      setSelectedFile(null);
      setTitre('');
      setCibleType('ALL');
      setCibleId('');
      setNiveauCible('ALL');
      fetchData();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Erreur lors du téléversement du document.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmez-vous la suppression de ce document ?')) return;

    try {
      await apiClient.delete(`/web/admin/documents/${id}`);
      setAlert({ type: 'success', message: 'Document supprimé avec succès.' });
      fetchData();
    } catch (err) {
      setAlert({ type: 'error', message: 'Erreur lors de la suppression.' });
    }
  };

  const columns = [
    {
      header: 'Document',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
            PDF
          </div>
          <div>
            <span className="font-semibold text-iut-text-dark block">{row.titre}</span>
            <span className="text-[11px] text-iut-text-grey">
              Par {row.auteur}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Catégorie',
      render: (row) => {
        const variants = {
          ADMIN: 'primary',
          COURS: 'info',
          EDT: 'success',
        };
        return <Badge variant={variants[row.type_doc] || 'default'}>{row.type_doc}</Badge>;
      },
    },
    {
      header: 'Cible & Niveau',
      render: (row) => (
        <span className="text-xs text-iut-text-dark font-medium">
          {row.cible_type} {row.cible_id ? `(#${row.cible_id})` : ''} - Niv. {row.niveau_cible}
        </span>
      ),
    },
    {
      header: 'Destinataires',
      align: 'center',
      render: (row) => (
        <span className="text-xs font-semibold text-iut-blue">
          {row.total_destinataires || 0}
        </span>
      ),
    },
    {
      header: 'Date',
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
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <a
            href={`http://localhost:5000/${row.url_fichier}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-iut-blue hover:bg-slate-100 rounded transition-colors"
            title="Consulter le fichier"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 text-iut-danger hover:bg-red-50 rounded transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Gestion des Documents"
        subtitle="Téléversement et distribution de fichiers PDF académiques et administratifs"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Formulaire d'upload */}
        <div className="lg:col-span-1">
          <Card title="Téléverser un Document">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Zone d'upload stylisée */}
              <div className="border-2 border-dashed border-gray-300 hover:border-iut-orange bg-gray-50 hover:bg-orange-50/20 rounded-lg p-6 text-center transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <UploadCloud className="w-10 h-10 mx-auto text-iut-text-grey mb-2" />
                <span className="text-sm font-semibold text-iut-text-dark block">
                  {selectedFile ? selectedFile.name : 'Sélectionner un fichier PDF'}
                </span>
                <span className="text-xs text-iut-text-grey mt-1 block">
                  Format PDF uniquement (Max 15 Mo)
                </span>
              </div>

              <Input
                label="Titre du document"
                placeholder="Ex : Emploi du Temps S3"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Type de document"
                  value={typeDoc}
                  onChange={(e) => setTypeDoc(e.target.value)}
                  options={[
                    { value: 'ADMIN', label: 'Administratif' },
                    { value: 'EDT', label: 'Emploi du temps' },
                    { value: 'COURS', label: 'Support de cours' },
                  ]}
                />

                <Select
                  label="Niveau ciblé"
                  value={niveauCible}
                  onChange={(e) => setNiveauCible(e.target.value)}
                  options={[
                    { value: 'ALL', label: 'Tous niveaux' },
                    { value: '1', label: 'Niveau 1' },
                    { value: '2', label: 'Niveau 2' },
                    { value: '3', label: 'Niveau 3' },
                  ]}
                />
              </div>

              <Select
                label="Audience cible"
                value={cibleType}
                onChange={(e) => setCibleType(e.target.value)}
                options={[
                  { value: 'ALL', label: 'Tous les étudiants' },
                  { value: 'CYCLE', label: 'Par Cycle' },
                  { value: 'FILIERE', label: 'Par Filière' },
                  { value: 'PARCOURS', label: 'Par Parcours' },
                ]}
              />

              {cibleType === 'CYCLE' && (
                <Select
                  label="Sélectionner le cycle"
                  value={cibleId}
                  onChange={(e) => setCibleId(e.target.value)}
                  options={structure.cycles.map((c) => ({
                    value: c.idCycle,
                    label: c.nomCycle,
                  }))}
                  required
                />
              )}

              {cibleType === 'FILIERE' && (
                <Select
                  label="Sélectionner la filière"
                  value={cibleId}
                  onChange={(e) => setCibleId(e.target.value)}
                  options={structure.filieres.map((f) => ({
                    value: f.id_filiere,
                    label: f.nom_filiere,
                  }))}
                  required
                />
              )}

              {cibleType === 'PARCOURS' && (
                <Select
                  label="Sélectionner le parcours"
                  value={cibleId}
                  onChange={(e) => setCibleId(e.target.value)}
                  options={structure.parcours.map((p) => ({
                    value: p.id,
                    label: p.nom_parcours,
                  }))}
                  required
                />
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={submitting}
                icon={UploadCloud}
              >
                Téléverser et Diffuser
              </Button>
            </form>
          </Card>
        </div>

        {/* Historique des documents */}
        <div className="lg:col-span-2">
          <Card title="Documents publiés">
            <Table
              columns={columns}
              data={documents}
              isLoading={loading}
              emptyMessage="Aucun document n'a été publié."
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDocuments;
