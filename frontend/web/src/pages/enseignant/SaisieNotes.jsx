import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../../api/client';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';
import { Save, CheckCircle, Calculator } from 'lucide-react';

export const EnseignantSaisieNotes = () => {
  const [searchParams] = useSearchParams();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [students, setStudents] = useState([]);
  const [notesState, setNotesState] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await apiClient.get('/web/enseignant/assignments');
        setAssignments(res.data.data);

        // Si des paramètres URL sont passés
        const matiereParam = searchParams.get('matiere');
        const parcoursParam = searchParams.get('parcours');

        if (matiereParam && parcoursParam) {
          const match = res.data.data.find(
            (a) =>
              String(a.id_matiere) === matiereParam &&
              String(a.id_parcours) === parcoursParam
          );
          if (match) setSelectedAssignmentId(String(match.id));
        } else if (res.data.data.length > 0) {
          setSelectedAssignmentId(String(res.data.data[0].id));
        }
      } catch (err) {
        setAlert({ type: 'error', message: 'Erreur lors du chargement des matières.' });
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [searchParams]);

  const currentAssignment = assignments.find(
    (a) => String(a.id) === selectedAssignmentId
  );

  useEffect(() => {
    if (!currentAssignment) return;

    const fetchStudentsAndNotes = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/web/enseignant/notes', {
          params: {
            id_matiere: currentAssignment.id_matiere,
            id_parcours: currentAssignment.id_parcours,
            niveau: currentAssignment.niveau?.includes('1') ? '1' : '2',
            semestre: currentAssignment.semestre,
          },
        });

        setStudents(res.data.data);

        // Initialiser l'état local des notes
        const initialNotes = {};
        res.data.data.forEach((s) => {
          initialNotes[s.id_etudiant] = {
            note_cc: s.note_cc !== null && s.note_cc !== undefined ? s.note_cc : '',
            note_tp: s.note_tp !== null && s.note_tp !== undefined ? s.note_tp : '',
            note_synthese: s.note_synthese !== null && s.note_synthese !== undefined ? s.note_synthese : '',
          };
        });
        setNotesState(initialNotes);
      } catch (err) {
        setAlert({ type: 'error', message: 'Impossible de charger la liste des étudiants.' });
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsAndNotes();
  }, [selectedAssignmentId]);

  const handleNoteChange = (studentId, field, value) => {
    // Validation bornes 0 à 20
    let numVal = value;
    if (value !== '') {
      const parsed = parseFloat(value);
      if (isNaN(parsed) || parsed < 0 || parsed > 20) return;
      numVal = value;
    }

    setNotesState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: numVal,
      },
    }));
  };

  const calculateAverage = (notes) => {
    if (!notes) return '-';
    const cc = parseFloat(notes.note_cc) || 0;
    const tp = parseFloat(notes.note_tp) || 0;
    const synthese = parseFloat(notes.note_synthese) || 0;

    if (notes.note_cc === '' && notes.note_tp === '' && notes.note_synthese === '') {
      return '-';
    }

    const avg = cc * 0.3 + tp * 0.2 + synthese * 0.5;
    return avg.toFixed(2);
  };

  const handleSave = async () => {
    if (!currentAssignment) return;
    setSaving(true);
    try {
      const payloadNotes = Object.keys(notesState).map((studentId) => {
        const item = notesState[studentId];
        return {
          id_etudiant: parseInt(studentId, 10),
          note_cc: item.note_cc !== '' ? parseFloat(item.note_cc) : null,
          note_tp: item.note_tp !== '' ? parseFloat(item.note_tp) : null,
          note_synthese: item.note_synthese !== '' ? parseFloat(item.note_synthese) : null,
        };
      });

      const res = await apiClient.post('/web/enseignant/notes', {
        id_matiere: currentAssignment.id_matiere,
        id_parcours: currentAssignment.id_parcours,
        semestre: currentAssignment.semestre,
        notes: payloadNotes,
      });

      setAlert({ type: 'success', message: res.data.message });
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Erreur lors de l\'enregistrement des notes.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Saisie des Évaluations"
        subtitle="Enregistrement des notes de Contrôle Continu (30%), TP (20%) et Synthèse (50%)"
        actions={
          students.length > 0 && (
            <Button
              variant="primary"
              onClick={handleSave}
              isLoading={saving}
              icon={Save}
            >
              Enregistrer les notes
            </Button>
          )
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

      {/* Sélecteur de cours */}
      <Card className="mb-6" bodyClassName="p-4 bg-gray-50">
        <div className="max-w-md">
          <Select
            label="Sélectionner la matière et la classe"
            value={selectedAssignmentId}
            onChange={(e) => setSelectedAssignmentId(e.target.value)}
            options={assignments.map((a) => ({
              value: a.id,
              label: `${a.code_matiere} - ${a.nom_matiere} (${a.niveau} - ${a.nom_parcours || 'Tous'})`,
            }))}
            placeholder="Sélectionner un enseignement"
          />
        </div>
      </Card>

      {/* Grille de saisie */}
      {loading ? (
        <Loader label="Chargement de la liste d'émargement..." />
      ) : students.length === 0 ? (
        <Card>
          <p className="text-sm text-iut-text-grey text-center py-8">
            Aucun étudiant inscrit n'a été trouvé pour cet enseignement.
          </p>
        </Card>
      ) : (
        <Card bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-iut-border">
                  <th className="py-3 px-4 font-bold text-xs uppercase text-iut-blue">
                    Matricule
                  </th>
                  <th className="py-3 px-4 font-bold text-xs uppercase text-iut-blue">
                    Nom & Prénom
                  </th>
                  <th className="py-3 px-4 font-bold text-xs uppercase text-iut-blue w-28 text-center">
                    CC (/20)
                  </th>
                  <th className="py-3 px-4 font-bold text-xs uppercase text-iut-blue w-28 text-center">
                    TP (/20)
                  </th>
                  <th className="py-3 px-4 font-bold text-xs uppercase text-iut-blue w-28 text-center">
                    Synthèse (/20)
                  </th>
                  <th className="py-3 px-4 font-bold text-xs uppercase text-iut-blue w-28 text-center">
                    Moyenne (/20)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {students.map((student) => {
                  const studentNotes = notesState[student.id_etudiant] || {};
                  const avg = calculateAverage(studentNotes);

                  return (
                    <tr key={student.id_etudiant} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-bold text-xs text-iut-blue">
                        {student.matricule}
                      </td>
                      <td className="py-3 px-4 font-semibold text-iut-text-dark">
                        {student.nom} {student.prenom}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          value={studentNotes.note_cc}
                          onChange={(e) =>
                            handleNoteChange(student.id_etudiant, 'note_cc', e.target.value)
                          }
                          className="w-20 px-2 py-1 text-center font-mono border border-iut-border rounded focus:border-iut-orange focus:ring-1 focus:ring-iut-orange outline-none text-sm"
                          placeholder="-"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          value={studentNotes.note_tp}
                          onChange={(e) =>
                            handleNoteChange(student.id_etudiant, 'note_tp', e.target.value)
                          }
                          className="w-20 px-2 py-1 text-center font-mono border border-iut-border rounded focus:border-iut-orange focus:ring-1 focus:ring-iut-orange outline-none text-sm"
                          placeholder="-"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          value={studentNotes.note_synthese}
                          onChange={(e) =>
                            handleNoteChange(student.id_etudiant, 'note_synthese', e.target.value)
                          }
                          className="w-20 px-2 py-1 text-center font-mono border border-iut-border rounded focus:border-iut-orange focus:ring-1 focus:ring-iut-orange outline-none text-sm"
                          placeholder="-"
                        />
                      </td>
                      <td className="py-3 px-4 text-center font-bold font-mono text-sm text-iut-blue">
                        {avg}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-iut-text-grey">
              <Calculator className="w-4 h-4 text-iut-orange" />
              <span>Formule officielle : Moyenne = (CC × 0.3) + (TP × 0.2) + (Synthèse × 0.5)</span>
            </div>
            <Button
              variant="primary"
              onClick={handleSave}
              isLoading={saving}
              icon={Save}
            >
              Enregistrer les notes
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EnseignantSaisieNotes;
