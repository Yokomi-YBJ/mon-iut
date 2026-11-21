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
import { UserPlus, Search, Edit2, UserX, UserCheck } from 'lucide-react';

export const AdminEtudiants = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [structure, setStructure] = useState({ cycles: [], filieres: [], parcours: [] });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Filtres
  const [selectedCycle, setSelectedCycle] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [selectedParcours, setSelectedParcours] = useState('');
  const [selectedNiveau, setSelectedNiveau] = useState('');
  const [selectedActif, setSelectedActif] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  // Formulaires
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    matricule: '',
    password: '',
    idCycle: '',
    id_parcours: '',
    niveau: '1',
    est_actif: 1,
  });

  const fetchStructure = async () => {
    try {
      const res = await apiClient.get('/structure');
      setStructure(res.data.data.flat);
    } catch (err) {
      setAlert({ type: 'error', message: 'Erreur lors du chargement de la structure académique.' });
    }
  };

  const fetchEtudiants = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCycle) params.cycle = selectedCycle;
      if (selectedFiliere) params.filiere = selectedFiliere;
      if (selectedParcours) params.parcours = selectedParcours;
      if (selectedNiveau) params.niveau = selectedNiveau;
      if (selectedActif !== '') params.actif = selectedActif;
      if (searchTerm) params.search = searchTerm;

      const res = await apiClient.get('/web/admin/etudiants', { params });
      setEtudiants(res.data.data);
    } catch (err) {
      setAlert({ type: 'error', message: 'Impossible de charger la liste des étudiants.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStructure();
  }, []);

  useEffect(() => {
    fetchEtudiants();
  }, [selectedCycle, selectedFiliere, selectedParcours, selectedNiveau, selectedActif]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEtudiants();
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await apiClient.patch(`/web/admin/etudiants/${id}/toggle-status`);
      setAlert({ type: 'success', message: res.data.message });
      fetchEtudiants();
    } catch (err) {
      setAlert({ type: 'error', message: 'Erreur lors du changement de statut.' });
    }
  };

  const handleOpenCreateModal = () => {
    setFormData({
      nom: '',
      prenom: '',
      matricule: '',
      password: '',
      idCycle: structure.cycles[0]?.idCycle || '',
      id_parcours: structure.parcours[0]?.id || '',
      niveau: '1',
      est_actif: 1,
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/web/admin/etudiants', formData);
      setAlert({ type: 'success', message: res.data.message });
      setIsCreateModalOpen(false);
      fetchEtudiants();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Erreur lors de la création de l\'étudiant.',
      });
    }
  };

  const handleOpenEditModal = (student) => {
    setCurrentStudent(student);
    setFormData({
      nom: student.nom,
      prenom: student.prenom,
      matricule: student.matricule,
      idCycle: student.idCycle || '',
      id_parcours: student.id_parcours || '',
      niveau: student.niveau || '1',
      est_actif: student.est_actif ? 1 : 0,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/web/admin/etudiants/${currentStudent.id}`, formData);
      setAlert({ type: 'success', message: 'Informations de l\'étudiant mises à jour.' });
      setIsEditModalOpen(false);
      fetchEtudiants();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Erreur de modification.',
      });
    }
  };

  const columns = [
    {
      header: 'Matricule',
      accessor: 'matricule',
      render: (row) => (
        <span className="font-mono font-bold text-xs text-iut-blue">
          {row.matricule}
        </span>
      ),
    },
    {
      header: 'Nom et Prénom',
      render: (row) => (
        <div>
          <span className="font-semibold text-iut-text-dark block">
            {row.nom} {row.prenom}
          </span>
          <span className="text-xs text-iut-text-grey">
            {row.nomCycle} - Niveau {row.niveau}
          </span>
        </div>
      ),
    },
    {
      header: 'Filière & Parcours',
      render: (row) => (
        <div>
          <span className="text-xs font-semibold text-iut-text-dark block">
            {row.nom_filiere || 'Filière non définie'}
          </span>
          <span className="text-xs text-iut-text-grey">
            {row.nom_parcours || 'Parcours non défini'}
          </span>
        </div>
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
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenEditModal(row)}
            icon={Edit2}
          >
            Modifier
          </Button>
          <Button
            size="sm"
            variant={row.est_actif ? 'ghost' : 'outline'}
            className={row.est_actif ? 'text-iut-danger hover:bg-red-50' : 'text-iut-success hover:bg-green-50'}
            onClick={() => handleToggleStatus(row.id)}
            icon={row.est_actif ? UserX : UserCheck}
          >
            {row.est_actif ? 'Désactiver' : 'Activer'}
          </Button>
        </div>
      ),
    },
  ];

  const filteredParcours = structure.parcours.filter((p) => {
    if (!selectedFiliere) return true;
    return p.id_filiere === parseInt(selectedFiliere, 10);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Gestion des Étudiants"
        subtitle="Consultation, filtrage et inscription des étudiants de l'IUT"
        actions={
          <Button variant="primary" onClick={handleOpenCreateModal} icon={UserPlus}>
            Inscrire un Étudiant
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

      {/* Barre de filtrage avancée */}
      <Card className="mb-6" bodyClassName="p-4 bg-gray-50">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <Select
              label="Cycle"
              value={selectedCycle}
              onChange={(e) => {
                setSelectedCycle(e.target.value);
                setSelectedFiliere('');
                setSelectedParcours('');
              }}
              options={structure.cycles.map((c) => ({
                value: c.idCycle,
                label: c.nomCycle,
              }))}
              placeholder="Tous les cycles"
            />

            <Select
              label="Filière"
              value={selectedFiliere}
              onChange={(e) => {
                setSelectedFiliere(e.target.value);
                setSelectedParcours('');
              }}
              options={structure.filieres.map((f) => ({
                value: f.id_filiere,
                label: f.nom_filiere,
              }))}
              placeholder="Toutes les filières"
            />

            <Select
              label="Parcours"
              value={selectedParcours}
              onChange={(e) => setSelectedParcours(e.target.value)}
              options={filteredParcours.map((p) => ({
                value: p.id,
                label: p.nom_parcours,
              }))}
              placeholder="Tous les parcours"
            />

            <Select
              label="Niveau"
              value={selectedNiveau}
              onChange={(e) => setSelectedNiveau(e.target.value)}
              options={[
                { value: '1', label: 'Niveau 1' },
                { value: '2', label: 'Niveau 2' },
                { value: '3', label: 'Niveau 3' },
              ]}
              placeholder="Tous les niveaux"
            />

            <Select
              label="Statut"
              value={selectedActif}
              onChange={(e) => setSelectedActif(e.target.value)}
              options={[
                { value: '1', label: 'Actifs uniquement' },
                { value: '0', label: 'Inactifs uniquement' },
              ]}
              placeholder="Tous statuts"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par nom, prénom ou matricule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary" icon={Search}>
              Rechercher
            </Button>
          </div>
        </form>
      </Card>

      {/* Tableau des étudiants */}
      <Table
        columns={columns}
        data={etudiants}
        isLoading={loading}
        emptyMessage="Aucun étudiant ne correspond aux critères de recherche."
      />

      {/* Modal Inscription */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Inscrire un nouvel Étudiant"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleCreateSubmit}>
              Enregistrer l'inscription
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
            <Input
              label="Prénom"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Matricule"
              placeholder="Ex : 25GLO99IU"
              value={formData.matricule}
              onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
              required
            />
            <Input
              label="Mot de passe temporaire"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Cycle"
              value={formData.idCycle}
              onChange={(e) => setFormData({ ...formData, idCycle: e.target.value })}
              options={structure.cycles.map((c) => ({
                value: c.idCycle,
                label: c.nomCycle,
              }))}
              required
            />
            <Select
              label="Niveau"
              value={formData.niveau}
              onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
              options={[
                { value: '1', label: 'Niveau 1' },
                { value: '2', label: 'Niveau 2' },
                { value: '3', label: 'Niveau 3' },
              ]}
              required
            />
          </div>

          <Select
            label="Parcours"
            value={formData.id_parcours}
            onChange={(e) => setFormData({ ...formData, id_parcours: e.target.value })}
            options={structure.parcours.map((p) => ({
              value: p.id,
              label: p.nom_parcours,
            }))}
            required
          />
        </form>
      </Modal>

      {/* Modal Modification */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modifier la fiche Étudiant"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleEditSubmit}>
              Sauvegarder les modifications
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
            <Input
              label="Prénom"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              required
            />
          </div>

          <Input
            label="Matricule"
            value={formData.matricule}
            onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Cycle"
              value={formData.idCycle}
              onChange={(e) => setFormData({ ...formData, idCycle: e.target.value })}
              options={structure.cycles.map((c) => ({
                value: c.idCycle,
                label: c.nomCycle,
              }))}
              required
            />
            <Select
              label="Niveau"
              value={formData.niveau}
              onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
              options={[
                { value: '1', label: 'Niveau 1' },
                { value: '2', label: 'Niveau 2' },
                { value: '3', label: 'Niveau 3' },
              ]}
              required
            />
          </div>

          <Select
            label="Parcours"
            value={formData.id_parcours}
            onChange={(e) => setFormData({ ...formData, id_parcours: e.target.value })}
            options={structure.parcours.map((p) => ({
              value: p.id,
              label: p.nom_parcours,
            }))}
            required
          />
        </form>
      </Modal>
    </div>
  );
};

export default AdminEtudiants;
