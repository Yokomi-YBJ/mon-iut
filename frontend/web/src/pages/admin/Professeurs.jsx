import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Alert from '../../components/common/Alert';
import { UserPlus, BookOpen, Trash2, PlusCircle } from 'lucide-react';

export const AdminProfesseurs = () => {
  const [professeurs, setProfesseurs] = useState([]);
  const [structure, setStructure] = useState({ filieres: [], parcours: [] });
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Modales
  const [isCreateProfModalOpen, setIsCreateProfModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedProf, setSelectedProf] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  // Formulaire Professeur
  const [profFormData, setProfFormData] = useState({
    nom_complet: '',
    identifiant: '',
    password: '',
    niveau_responsabilite: '',
  });

  // Formulaire Affectation
  const [assignFormData, setAssignFormData] = useState({
    id_matiere: '',
    niveau: 'DUT2',
    id_filiere: '',
    id_parcours: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profsRes, structRes, matieresRes] = await Promise.all([
        apiClient.get('/web/admin/professeurs'),
        apiClient.get('/structure'),
        apiClient.get('/structure/matieres'),
      ]);
      setProfesseurs(profsRes.data.data);
      setStructure(structRes.data.data.flat);
      setMatieres(matieresRes.data.data);
    } catch (err) {
      setAlert({ type: 'error', message: 'Erreur lors du chargement des données.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAssignModal = async (prof) => {
    setSelectedProf(prof);
    setLoadingAssignments(true);
    setIsAssignModalOpen(true);
    setAssignFormData({
      id_matiere: matieres[0]?.id || '',
      niveau: 'DUT2',
      id_filiere: prof.id_filiere || structure.filieres[0]?.id_filiere || '',
      id_parcours: '',
    });

    try {
      const res = await apiClient.get(`/web/admin/professeurs/${prof.id}/assignments`);
      setAssignments(res.data.data);
    } catch (err) {
      setAlert({ type: 'error', message: 'Impossible de charger les affectations de cet enseignant.' });
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleCreateProfSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...profFormData,
        niveau_responsabilite: profFormData.niveau_responsabilite ? parseInt(profFormData.niveau_responsabilite, 10) : null,
      };
      const res = await apiClient.post('/web/admin/professeurs', payload);
      setAlert({ type: 'success', message: res.data.message });
      setIsCreateProfModalOpen(false);
      fetchData();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Erreur lors de l\'enregistrement de l\'enseignant.',
      });
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/web/admin/assignments', {
        id_professeur: selectedProf.id,
        id_matiere: parseInt(assignFormData.id_matiere, 10),
        niveau: assignFormData.niveau,
        id_filiere: assignFormData.id_filiere ? parseInt(assignFormData.id_filiere, 10) : null,
        id_parcours: assignFormData.id_parcours ? parseInt(assignFormData.id_parcours, 10) : null,
      });

      setAlert({ type: 'success', message: 'Matière affectée avec succès.' });
      // Rafraîchir les affectations
      const res = await apiClient.get(`/web/admin/professeurs/${selectedProf.id}/assignments`);
      setAssignments(res.data.data);
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Erreur lors de l\'affectation.',
      });
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      await apiClient.delete(`/web/admin/assignments/${assignmentId}`);
      setAssignments(assignments.filter((a) => a.id !== assignmentId));
      setAlert({ type: 'success', message: 'Affectation supprimée.' });
    } catch (err) {
      setAlert({ type: 'error', message: 'Erreur lors de la suppression de l\'affectation.' });
    }
  };

  const columns = [
    {
      header: 'Enseignant',
      render: (row) => (
        <div>
          <span className="font-semibold text-iut-text-dark block">
            {row.nom_complet}
          </span>
          <span className="text-xs text-iut-text-grey font-mono">
            {row.identifiant}
          </span>
        </div>
      ),
    },
    {
      header: 'Responsabilité',
      render: (row) =>
        row.niveau_responsabilite ? (
          <Badge variant="primary">
            Responsable {row.nom_filiere || 'Filière'}
          </Badge>
        ) : (
          <Badge variant="default">Enseignant</Badge>
        ),
    },
    {
      header: 'Statut',
      align: 'center',
      render: (row) =>
        row.est_actif ? (
          <Badge variant="success">Actif</Badge>
        ) : (
          <Badge variant="danger">Inactif</Badge>
        ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleOpenAssignModal(row)}
          icon={BookOpen}
        >
          Affectations ({row.id})
        </Button>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Gestion des Enseignants"
        subtitle="Corps professoral, désignations des responsables et affectations pédagogiques"
        actions={
          <Button
            variant="primary"
            onClick={() => {
              setProfFormData({
                nom_complet: '',
                identifiant: '',
                password: '',
                niveau_responsabilite: '',
              });
              setIsCreateProfModalOpen(true);
            }}
            icon={UserPlus}
          >
            Ajouter un Enseignant
          </Button>
        }
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

      <Table
        columns={columns}
        data={professeurs}
        isLoading={loading}
        emptyMessage="Aucun enseignant répertorié dans la base."
      />

      {/* Modal Ajout Enseignant */}
      <Modal
        isOpen={isCreateProfModalOpen}
        onClose={() => setIsCreateProfModalOpen(false)}
        title="Ajouter un Enseignant"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCreateProfModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleCreateProfSubmit}>
              Enregistrer l'enseignant
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Nom complet avec titre"
            placeholder="Ex : Dr Dupont"
            value={profFormData.nom_complet}
            onChange={(e) => setProfFormData({ ...profFormData, nom_complet: e.target.value })}
            required
          />
          <Input
            label="Adresse email (identifiant)"
            type="email"
            placeholder="Ex : dupont@iut.cm"
            value={profFormData.identifiant}
            onChange={(e) => setProfFormData({ ...profFormData, identifiant: e.target.value })}
            required
          />
          <Input
            label="Mot de passe provisoire"
            type="password"
            value={profFormData.password}
            onChange={(e) => setProfFormData({ ...profFormData, password: e.target.value })}
            required
          />
          <Select
            label="Responsabilité pédagogique"
            value={profFormData.niveau_responsabilite}
            onChange={(e) => setProfFormData({ ...profFormData, niveau_responsabilite: e.target.value })}
            options={[
              { value: '', label: 'Aucune (Enseignant standard)' },
              { value: '2', label: 'Responsable Pédagogique (Niveau 2)' },
              { value: '1', label: 'Directeur de Département (Niveau 1)' },
            ]}
          />
        </form>
      </Modal>

      {/* Modal Affectation Matières */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Affectations : ${selectedProf?.nom_complet || ''}`}
        maxWidth="max-w-3xl"
        footer={
          <Button variant="ghost" onClick={() => setIsAssignModalOpen(false)}>
            Fermer
          </Button>
        }
      >
        <div className="space-y-6">
          {/* Formulaire d'affectation */}
          <Card title="Assigner une nouvelle matière" bodyClassName="p-4 bg-gray-50">
            <form onSubmit={handleAssignSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Matière"
                  value={assignFormData.id_matiere}
                  onChange={(e) => setAssignFormData({ ...assignFormData, id_matiere: e.target.value })}
                  options={matieres.map((m) => ({
                    value: m.id,
                    label: `${m.code_matiere} - ${m.nom_matiere} (${m.semestre})`,
                  }))}
                  required
                />
                <Select
                  label="Niveau"
                  value={assignFormData.niveau}
                  onChange={(e) => setAssignFormData({ ...assignFormData, niveau: e.target.value })}
                  options={[
                    { value: 'DUT1', label: 'DUT 1' },
                    { value: 'DUT2', label: 'DUT 2' },
                    { value: 'BTS1', label: 'BTS 1' },
                    { value: 'BTS2', label: 'BTS 2' },
                    { value: 'LICENCE', label: 'Licence' },
                  ]}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Filière cible"
                  value={assignFormData.id_filiere}
                  onChange={(e) => setAssignFormData({ ...assignFormData, id_filiere: e.target.value, id_parcours: '' })}
                  options={structure.filieres.map((f) => ({
                    value: f.id_filiere,
                    label: f.nom_filiere,
                  }))}
                />
                <Select
                  label="Parcours spécifique"
                  value={assignFormData.id_parcours}
                  onChange={(e) => setAssignFormData({ ...assignFormData, id_parcours: e.target.value })}
                  options={structure.parcours
                    .filter((p) => !assignFormData.id_filiere || p.id_filiere === parseInt(assignFormData.id_filiere, 10))
                    .map((p) => ({
                      value: p.id,
                      label: p.nom_parcours,
                    }))}
                />
              </div>

              <div className="text-right pt-2">
                <Button type="submit" variant="primary" icon={PlusCircle}>
                  Affecter la matière
                </Button>
              </div>
            </form>
          </Card>

          {/* Liste des affectations en cours */}
          <div>
            <h3 className="text-sm font-bold text-iut-blue mb-3">
              Matières actuellement attribuées ({assignments.length})
            </h3>
            {loadingAssignments ? (
              <p className="text-xs text-iut-text-grey">Chargement des affectations...</p>
            ) : assignments.length === 0 ? (
              <p className="text-xs text-iut-text-grey italic">Aucune matière affectée pour le moment.</p>
            ) : (
              <div className="divide-y divide-gray-200 border border-iut-border rounded bg-white">
                {assignments.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-iut-blue">
                          {item.code_matiere}
                        </span>
                        <span className="text-xs text-iut-text-dark font-medium">
                          {item.nom_matiere}
                        </span>
                        <Badge size="sm" variant="info">{item.semestre}</Badge>
                      </div>
                      <span className="text-[11px] text-iut-text-grey">
                        {item.niveau} - {item.nom_parcours || item.nom_filiere || 'Toutes filières'}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-iut-danger hover:bg-red-50"
                      onClick={() => handleDeleteAssignment(item.id)}
                      icon={Trash2}
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProfesseurs;
