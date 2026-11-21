import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import apiClient from '../../services/apiClient';

export default function AcademiqueScreen() {
  const [notes, setNotes] = useState([]);
  const [activeSemestre, setActiveSemestre] = useState('S3');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await apiClient.get('/mobile/notes');
      const list = res.data.data || [];
      setNotes(list);

      // Détecter les semestres présents
      if (list.length > 0) {
        const lastSemestre = list[list.length - 1].semestre;
        setActiveSemestre(lastSemestre);
      }
    } catch (err) {
      // Ignorer
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const semestresDisponibles = Array.from(new Set(notes.map((n) => n.semestre))).sort();
  const notesFiltrees = notes.filter((n) => n.semestre === activeSemestre);

  // Calcul moyenne générale du semestre
  const calculateGeneralAverage = () => {
    if (notesFiltrees.length === 0) return null;
    let sum = 0;
    let count = 0;
    notesFiltrees.forEach((n) => {
      if (n.moyenne !== null && n.moyenne !== undefined) {
        sum += parseFloat(n.moyenne);
        count++;
      }
    });
    return count > 0 ? (sum / count).toFixed(2) : null;
  };

  const generalAvg = calculateGeneralAverage();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Relevé de Notes</Text>
        <Text style={styles.screenSubtitle}>
          Évaluations semestrielles : CC (30%), TP (20%) et Synthèse (50%)
        </Text>
      </View>

      {/* Onglets des semestres */}
      {semestresDisponibles.length > 0 ? (
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {semestresDisponibles.map((sem) => (
              <TouchableOpacity
                key={sem}
                style={[styles.tab, activeSemestre === sem && styles.tabActive]}
                onPress={() => setActiveSemestre(sem)}
              >
                <Text style={[styles.tabText, activeSemestre === sem && styles.tabTextActive]}>
                  {sem}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchNotes();
            }}
            tintColor="#F97616"
          />
        }
      >
        {isLoading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#F97616" />
            <Text style={styles.loadingText}>Chargement des évaluations...</Text>
          </View>
        ) : notes.length === 0 ? (
          <View style={styles.centerBox}>
            <Feather name="book" size={40} color="#64748B" />
            <Text style={styles.emptyTitle}>Aucune note enregistrée</Text>
            <Text style={styles.emptySubtitle}>
              Les notes saisies par vos enseignants apparaîtront ici.
            </Text>
          </View>
        ) : (
          <>
            {/* Carte moyenne générale */}
            {generalAvg && (
              <View style={styles.avgCard}>
                <View>
                  <Text style={styles.avgLabel}>Moyenne Générale - {activeSemestre}</Text>
                  <Text style={styles.avgStatus}>
                    {parseFloat(generalAvg) >= 10 ? 'Semestre validé' : 'En rattrapage'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.avgValue,
                    {
                      color:
                        parseFloat(generalAvg) >= 12
                          ? '#10B981'
                          : parseFloat(generalAvg) >= 10
                          ? '#F97616'
                          : '#DC2626',
                    },
                  ]}
                >
                  {generalAvg} / 20
                </Text>
              </View>
            )}

            {/* Liste des matières */}
            <View style={styles.notesList}>
              {notesFiltrees.map((note) => (
                <View key={note.id} style={styles.noteCard}>
                  <View style={styles.noteHeader}>
                    <View style={styles.codeBadge}>
                      <Text style={styles.codeText}>{note.code_matiere}</Text>
                    </View>
                    <Text style={styles.matiereTitle} numberOfLines={1}>
                      {note.nom_matiere}
                    </Text>
                  </View>

                  <View style={styles.gradesRow}>
                    <View style={styles.gradeCol}>
                      <Text style={styles.gradeLabel}>CC (30%)</Text>
                      <Text style={styles.gradeValue}>
                        {note.note_cc !== null ? `${note.note_cc}` : '-'}
                      </Text>
                    </View>

                    <View style={styles.gradeCol}>
                      <Text style={styles.gradeLabel}>TP (20%)</Text>
                      <Text style={styles.gradeValue}>
                        {note.note_tp !== null ? `${note.note_tp}` : '-'}
                      </Text>
                    </View>

                    <View style={styles.gradeCol}>
                      <Text style={styles.gradeLabel}>Synthèse (50%)</Text>
                      <Text style={styles.gradeValue}>
                        {note.note_synthese !== null ? `${note.note_synthese}` : '-'}
                      </Text>
                    </View>

                    <View style={[styles.gradeCol, styles.moyenneCol]}>
                      <Text style={styles.moyenneLabel}>Moyenne</Text>
                      <Text style={styles.moyenneValue}>
                        {note.moyenne !== null ? `${note.moyenne}` : '-'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  screenHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  screenTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  screenSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  tabsContainer: {
    backgroundColor: '#1E293B',
    paddingVertical: 8,
  },
  tabsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#0F172A',
  },
  tabActive: {
    backgroundColor: '#F97616',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scroll: {
    padding: 20,
  },
  avgCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  avgLabel: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },
  avgStatus: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  avgValue: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  notesList: {
    gap: 12,
  },
  noteCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  codeBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  codeText: {
    color: '#F97616',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  matiereTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
  },
  gradesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 10,
  },
  gradeCol: {
    alignItems: 'center',
    flex: 1,
  },
  gradeLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  gradeValue: {
    color: '#CBD5E1',
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: '500',
  },
  moyenneCol: {
    borderLeftWidth: 1,
    borderLeftColor: '#334155',
  },
  moyenneLabel: {
    color: '#F97616',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  moyenneValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 12,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emptySubtitle: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
});
