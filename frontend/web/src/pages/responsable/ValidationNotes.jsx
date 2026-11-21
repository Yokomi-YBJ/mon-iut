import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Alert from '../../components/common/Alert';
import { BarChart2 } from 'lucide-react';

export const ResponsableValidationNotes = () => {
  const [summary, setSummary] = useState([]);
  const [semestre, setSemestre] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const params = {};
      if (semestre) params.semestre = semestre;

      const res = await apiClient.get('/web/responsable/notes-summary', { params });
      setSummary(res.data.data);
    } catch (err) {
      setAlert({ type: 'error', message: 'Impossible de charger la synthèse des notes.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [semestre]);

  const columns = [
    {
      header: 'Code UE',
      accessor: 'code_matiere',
      render: (row) => (
        <span className="font-mono font-bold text-xs text-iut-blue">
          {row.code_matiere}
        </span>
      ),
    },
    {
      header: 'Intitulé de la Matière',
      render: (row) => (
        <span className="font-semibold text-iut-text-dark">
          {row.nom_matiere}
        </span>
      ),
    },
    {
      header: 'Semestre',
      align: 'center',
      render: (row) => <Badge variant="info">{row.semestre}</Badge>,
    },
    {
      header: 'Copies Saisies',
      align: 'center',
      render: (row) => (
        <span className="text-xs font-semibold text-iut-text-dark">
          {row.nombre_notes}
        </span>
      ),
    },
    {
      header: 'Min / Max',
      align: 'center',
      render: (row) => (
        <span className="text-xs text-iut-text-grey font-mono">
          {row.note_min !== null ? row.note_min : '-'} / {row.note_max !== null ? row.note_max : '-'}
        </span>
      ),
    },
    {
      header: 'Moyenne de Promotion',
      align: 'center',
      render: (row) => {
        const avg = parseFloat(row.moyenne_classe);
        const colorClass =
          avg >= 12
            ? 'text-iut-success'
            : avg >= 10
            ? 'text-iut-orange'
            : 'text-iut-danger';

        return (
          <span className={`font-mono font-bold text-sm ${colorClass}`}>
            {row.moyenne_classe !== null ? `${row.moyenne_classe} / 20` : '-'}
          </span>
        );
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Synthèse & Validation des Notes"
        subtitle="Contrôle des moyennes de promotion et délibérations semestrielles"
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

      {/* Filtre par semestre */}
      <Card className="mb-6" bodyClassName="p-4 bg-gray-50 flex items-center justify-between">
        <div className="w-64">
          <Select
            label="Filtrer par Semestre"
            value={semestre}
            onChange={(e) => setSemestre(e.target.value)}
            options={[
              { value: '', label: 'Tous les semestres' },
              { value: 'S1', label: 'Semestre 1' },
              { value: 'S2', label: 'Semestre 2' },
              { value: 'S3', label: 'Semestre 3' },
              { value: 'S4', label: 'Semestre 4' },
              { value: 'S5', label: 'Semestre 5' },
              { value: 'S6', label: 'Semestre 6' },
            ]}
          />
        </div>
        <div className="text-right text-xs text-iut-text-grey">
          <span>Pondérations : CC (30%) + TP (20%) + Synthèse (50%)</span>
        </div>
      </Card>

      <Table
        columns={columns}
        data={summary}
        isLoading={loading}
        emptyMessage="Aucune évaluation enregistrée pour le moment dans cette filière."
      />
    </div>
  );
};

export default ResponsableValidationNotes;
