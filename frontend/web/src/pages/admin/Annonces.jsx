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
import { Send, Bell, CheckCircle } from 'lucide-react';

export const AdminAnnonces = () => {
  const [annonces, setAnnonces] = useState([]);
  const [structure, setStructure] = useState({ cycles: [], filieres: [], parcours: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    type_notif: 'INFO',
    cible_type: 'ALL',
    cible_id: '',
    niveau_cible: 'ALL',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [annoncesRes, structRes] = await Promise.all([
        apiClient.get('/web/admin/annonces'),
        apiClient.get('/structure'),
      ]);
      setAnnonces(annoncesRes.data.data);
      setStructure(structRes.data.data.flat);
    } catch (err) {
      setAlert({ type: 'error', message: 'Erreur lors du chargement des annonces.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        cible_id: formData.cible_id ? parseInt(formData.cible_id, 10) : null,
      };
      const res = await apiClient.post('/web/admin/annonces', payload);
      setAlert({ type: 'success', message: res.data.message });
      setFormData({
        titre: '',
        contenu: '',
        type_notif: 'INFO',
        cible_type: 'ALL',
        cible_id: '',
        niveau_cible: 'ALL',
      });
      fetchData();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Erreur lors de l\'envoi de l\'annonce.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Titre & Contenu',
      render: (row) => (
        <div>
          <span className="font-semibold text-iut-blue block">{row.titre}</span>
          <p className="text-xs text-iut-text-grey line-clamp-1 mt-0.5">{row.contenu}</p>
        </div>
      ),
    },
    {
      header: 'Type',
      render: (row) => {
        const variants = {
          INFO: 'info',
          ALERTE: 'danger',
          ADMIN: 'primary',
        };
        return <Badge variant={variants[row.type_notif] || 'default'}>{row.type_notif}</Badge>;
      },
    },
    {
      header: 'Cible & Niveau',
      render: (row) => (
        <span className="text-xs text-iut-text-dark font-medium">
          {row.cible_type} {row.cible_id ? `(#${row.cible_id})` : ''} - Niveau {row.niveau_cible}
        </span>
      ),
    },
    {
      header: 'Audience & Lecture',
      render: (row) => {
        const total = row.total_destinataires || 0;
        const lus = row.total_lus || 0;
        const percent = total > 0 ? Math.round((lus / total) * 100) : 0;
        return (
          <div>
            <span className="text-xs font-semibold text-iut-text-dark block">
              {lus} / {total} lus ({percent}%)
            </span>
            <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-iut-orange rounded-full"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: 'Date d\'envoi',
      render: (row) => (
        <span className="text-xs text-iut-text-grey">
          {new Date(row.date_envoi).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Annonces & Notifications"
        subtitle="Diffusion ciblée de communications officielles vers les étudiants"
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
        {/* Formulaire de composition */}
        <div className="lg:col-span-1">
          <Card title="Rédiger une annonce">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Titre de l'annonce"
                placeholder="Ex : Réunion d'information"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                required
              />

              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs font-semibold text-iut-text-dark uppercase tracking-wider">
                  Contenu du message <span className="text-iut-danger">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Texte complet de la communication..."
                  value={formData.contenu}
                  onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-iut-border rounded text-sm text-iut-text-dark focus:outline-none focus:border-iut-orange focus:ring-2 focus:ring-iut-orange/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Type d'annonce"
                  value={formData.type_notif}
                  onChange={(e) => setFormData({ ...formData, type_notif: e.target.value })}
                  options={[
                    { value: 'INFO', label: 'Information (Info)' },
                    { value: 'ALERTE', label: 'Urgent (Alerte)' },
                    { value: 'ADMIN', label: 'Administration' },
                  ]}
                />

                <Select
                  label="Niveau ciblé"
                  value={formData.niveau_cible}
                  onChange={(e) => setFormData({ ...formData, niveau_cible: e.target.value })}
                  options={[
                    { value: 'ALL', label: 'Tous niveaux' },
                    { value: '1', label: 'Niveau 1' },
                    { value: '2', label: 'Niveau 2' },
                    { value: '3', label: 'Niveau 3' },
                  ]}
                />
              </div>

              <Select
                label="Type de ciblage"
                value={formData.cible_type}
                onChange={(e) => setFormData({ ...formData, cible_type: e.target.value, cible_id: '' })}
                options={[
                  { value: 'ALL', label: 'Tous les étudiants (Général)' },
                  { value: 'CYCLE', label: 'Par Cycle' },
                  { value: 'FILIERE', label: 'Par Filière' },
                  { value: 'PARCOURS', label: 'Par Parcours' },
                ]}
              />

              {formData.cible_type === 'CYCLE' && (
                <Select
                  label="Sélectionner le cycle"
                  value={formData.cible_id}
                  onChange={(e) => setFormData({ ...formData, cible_id: e.target.value })}
                  options={structure.cycles.map((c) => ({
                    value: c.idCycle,
                    label: c.nomCycle,
                  }))}
                  required
                />
              )}

              {formData.cible_type === 'FILIERE' && (
                <Select
                  label="Sélectionner la filière"
                  value={formData.cible_id}
                  onChange={(e) => setFormData({ ...formData, cible_id: e.target.value })}
                  options={structure.filieres.map((f) => ({
                    value: f.id_filiere,
                    label: f.nom_filiere,
                  }))}
                  required
                />
              )}

              {formData.cible_type === 'PARCOURS' && (
                <Select
                  label="Sélectionner le parcours"
                  value={formData.cible_id}
                  onChange={(e) => setFormData({ ...formData, cible_id: e.target.value })}
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
                icon={Send}
              >
                Diffuser l'annonce
              </Button>
            </form>
          </Card>
        </div>

        {/* Historique des annonces */}
        <div className="lg:col-span-2">
          <Card title="Historique des communications diffusées">
            <Table
              columns={columns}
              data={annonces}
              isLoading={loading}
              emptyMessage="Aucune annonce n'a été diffusée pour l'instant."
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAnnonces;
