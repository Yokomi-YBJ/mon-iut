import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Alert from '../../components/common/Alert';
import { Search } from 'lucide-react';

export const ResponsableSuiviEtudiants = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [parcoursList, setParcoursList] = useState([]);
  const [selectedParcours, setSelectedParcours] = useState('');
  const [selectedNiveau, setSelectedNiveau] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
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

  const fetchEtudiants = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedParcours) params.parcours = selectedParcours;
      if (selectedNiveau) params.niveau = selectedNiveau;
      if (searchTerm) params.search = searchTerm;

      const res = await apiClient.get('/web/responsable/etudiants', { params });
      setEtudiants(res.data.data);
    } catch (err) {
      setAlert({ type: 'error', message: 'Impossible de charger la liste des étudiants.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEtudiants();
  }, [selectedParcours, selectedNiveau]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEtudiants();
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
        <span className="font-semibold text-iut-text-dark">
          {row.nom} {row.prenom}
        </span>
      ),
    },
    {
      header: 'Parcours',
      render: (row) => (
        <span className="text-xs text-iut-text-grey">{row.nom_parcours}</span>
      ),
    },
    {
      header: 'Niveau',
      align: 'center',
      render: (row) => (
        <Badge variant="info">Niveau {row.niveau}</Badge>
      ),
    },
    {
      header: 'Statut',
      align: 'center',
      render: (row) =>
        row.est_actif ? (
          <Badge variant="success">Inscrit actif</Badge>
        ) : (
          <Badge variant="danger">Inactif</Badge>
        ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Effectifs & Suivi des Étudiants"
        subtitle="Consultation et filtre des étudiants inscrits dans votre filière"
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

      {/* Filtres */}
      <Card className="mb-6" bodyClassName="p-4 bg-gray-50">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Select
              label="Parcours"
              value={selectedParcours}
              onChange={(e) => setSelectedParcours(e.target.value)}
              options={parcoursList.map((p) => ({
                value: p.id,
                label: p.nom_parcours,
              }))}
              placeholder="Tous les parcours de la filière"
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              label="Niveau"
              value={selectedNiveau}
              onChange={(e) => setSelectedNiveau(e.target.value)}
              options={[
                { value: '1', label: 'Niveau 1' },
                { value: '2', label: 'Niveau 2' },
                { value: '3', label: 'Niveau 3' },
              ]}
              placeholder="Tous niveaux"
            />
          </div>

          <div className="flex-1">
            <Input
              label="Recherche"
              placeholder="Nom, prénom ou matricule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
      </Card>

      <Table
        columns={columns}
        data={etudiants}
        isLoading={loading}
        emptyMessage="Aucun étudiant ne correspond aux filtres."
      />
    </div>
  );
};

export default ResponsableSuiviEtudiants;
