import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function AcademiqueScreen({ navigation }) {
  const { user } = useAuth();
  const matieres = user?.matieres || [];

  // 1. Gestion des semestres dynamiques
  const semestresDisponibles = [...new Set(matieres.map(m => m.semestre))].sort();
  const [sem, setSem] = useState("");

  useEffect(() => {
    if (semestresDisponibles.length > 0 && !sem) {
      setSem(semestresDisponibles[0]);
    }
  }, [semestresDisponibles]);

  const date = new Date();
  const jour = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  // --- LOGIQUE DE CALCUL DES NOTES (PONDÉRÉE) ---
  
  const formatNote = (note) => {
    return (note !== null && note !== undefined) ? `${note}/20` : '--/20';
  };

  const calculMoyennePonderee = (cc, tp, synthese) => {
    // Si aucune note n'est présente, on n'affiche rien
    if (cc == null && tp == null && synthese == null) return '--';
    
    const nCC = parseFloat(cc || 0);
    const nSynth = parseFloat(synthese || 0);
    
    let moyenne = 0;

    // Vérification de l'existence du TP (si null ou indéfini dans la DB)
    if (tp !== null && tp !== undefined) {
      const nTP = parseFloat(tp);
      // Cas avec TP : 70% Synth + 20% CC + 10% TP = 100%
      moyenne = (nSynth * 0.7) + (nCC * 0.2) + (nTP * 0.1);
    } else {
      // Cas sans TP : 70% Synth + 30% CC = 100%
      moyenne = (nSynth * 0.7) + (nCC * 0.3);
    }
    
    return moyenne.toFixed(2);
  };

  const estValide = (moyenne) => {
    if (moyenne === '--') return false;
    return parseFloat(moyenne) >= 10;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}> 
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mon <Text style={styles.orange}>IUT</Text></Text>
          <Text style={styles.date}>{jour}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('notification')}>
          <Feather name="bell" size={26} color="white" />
          <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.pad}>
        <Text style={styles.pageTitle}>Unités d'Enseignement (UE)</Text>
        
        {/* Onglets dynamiques */}
        <View style={styles.tabs}>
          {semestresDisponibles.map((s) => (
            <TouchableOpacity 
              key={s}
              style={[styles.tab, sem === s && styles.activeTab]} 
              onPress={() => setSem(s)}
            >
              <Text style={[styles.tabTxt, sem === s && styles.activeTabTxt]}>
                Semestre {s ? s.replace('S', '') : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Liste des matières filtrées */}
        <View>
          {matieres
            .filter(m => m.semestre === sem)
            .map((matiere, index) => {
              
              const moyenneUE = calculMoyennePonderee(matiere.note_cc, matiere.note_tp, matiere.note_synthese);
              const isValide = estValide(moyenneUE);

              return (
                <View style={styles.card} key={index}>
                  <View style={styles.row}>
                    <View style={styles.tagUE}>
                      <Text style={styles.tagUEtxt}>{matiere?.code_matiere}</Text>
                    </View>
                    
                    {/* Statut dynamique */}
                    {moyenneUE !== '--' ? (
                      <View style={isValide ? styles.tagVal : styles.tagWait}>
                        <Text style={isValide ? styles.tagValtxt : styles.tagWaittxt}>
                          {isValide ? "Validée" : "Non validée"}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.tagWait}>
                        <Text style={styles.tagWaittxt}>En cours</Text>
                      </View>
                    )}

                    <View style={styles.tagCre}>
                      <Text style={styles.tagCretxt}>{matiere.nbrCredit} Crédits</Text>
                    </View>

                    <View style={styles.moyCol}>
                      <Text style={styles.moyLab}>MOYENNE</Text>
                      <Text style={[
                        styles.moyVal, 
                        moyenneUE === '--' && { color: '#F59E0B' },
                        !isValide && moyenneUE !== '--' && { color: '#EF4444' }
                      ]}>
                        {moyenneUE}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.ueName}>{matiere.nom_matiere}</Text>
                  
                  {/* Grille des notes avec gestion du TP manquant */}
                  <View style={styles.gridNotes}>
                    <View style={styles.noteItem}>
                      <Text style={styles.nLab}>CC ({matiere.note_tp !== null ? '20%' : '30%'})</Text>
                      <Text style={styles.nVal}>{formatNote(matiere.note_cc)}</Text>
                    </View>
                    
                    <View style={styles.noteItem}>
                      <Text style={styles.nLab}>TP (10%)</Text>
                      <Text style={styles.nVal}>{matiere.note_tp !== null ? formatNote(matiere.note_tp) : '--/20'}</Text>
                    </View>

                    <View style={styles.noteItem}>
                      <Text style={styles.nLab}>SYNT. (70%)</Text>
                      <Text style={styles.nVal}>{formatNote(matiere.note_synthese)}</Text>
                    </View>

                    <View style={styles.noteItem}>
                      <Text style={styles.nLab}>TOTAL</Text>
                      <Text style={styles.nVal}>{moyenneUE !== '--' ? `${moyenneUE}/20` : '--'}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
            
            {semestresDisponibles.length === 0 && (
              <Text style={{ color: '#94A3B8', textAlign: 'center', marginTop: 30 }}>
                Aucune donnée disponible.
              </Text>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  orange: { color: '#F59E0B' },
  date: { color: '#94A3B8' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#F59E0B', borderRadius: 10, width: 18, height: 18, alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  pad: { padding: 20 },
  pageTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  tabs: { flexDirection: 'row', backgroundColor: '#1E293B', borderRadius: 12, padding: 5, marginBottom: 25 },
  tab: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#F59E0B' },
  tabTxt: { color: '#94A3B8', fontWeight: 'bold' },
  activeTabTxt: { color: 'white' },
  card: { backgroundColor: '#1E293B', borderRadius: 16, padding: 20, marginBottom: 15 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  tagUE: { backgroundColor: '#334155', padding: 5, borderRadius: 6, marginRight: 8 },
  tagUEtxt: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' },
  tagVal: { backgroundColor: '#10B98120', padding: 5, borderRadius: 6, marginRight: 8 },
  tagValtxt: { color: '#10B981', fontSize: 10, fontWeight: 'bold' },
  tagWait: { backgroundColor: '#F59E0B20', padding: 5, borderRadius: 6, marginRight: 8 },
  tagWaittxt: { color: '#F59E0B', fontSize: 10, fontWeight: 'bold' },
  tagCre: { backgroundColor: '#1E3A8A', padding: 5, borderRadius: 6 },
  tagCretxt: { color: '#3B82F6', fontSize: 10, fontWeight: 'bold' },
  moyCol: { flex: 1, alignItems: 'flex-end' },
  moyLab: { color: '#64748B', fontSize: 9 },
  moyVal: { color: '#10B981', fontSize: 18, fontWeight: 'bold' },
  ueName: { color: 'white', fontSize: 16, marginBottom: 15, fontWeight: '500' },
  gridNotes: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 15 },
  noteItem: { flex: 1, alignItems: 'center' },
  nLab: { color: '#64748B', fontSize: 8, marginBottom: 5, textTransform: 'uppercase' },
  nVal: { color: 'white', fontWeight: 'bold', fontSize: 12 }
});