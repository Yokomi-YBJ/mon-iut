import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  StatusBar, Linking, ActivityIndicator, Alert, Platform, RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy'; 
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

export default function StageScreen({ navigation }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stage'); 
  const [activeDocSubTab, setActiveDocSubTab] = useState('cours');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [allDocs, setAllDocs] = useState([]); 
  const [downloadedFiles, setDownloadedFiles] = useState({});
  const [selectedUE, setSelectedUE] = useState(null);
  const [showUESelector, setShowUESelector] = useState(false);

  // Configuration API basée sur ton IP locale
  const API_URL = API_ENDPOINTS.get_docs;
  const BASE_URL_DOCS = API_ENDPOINTS.base_docs;

  const date = new Date();
  const jour = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  // Récupération des documents et vérification des fichiers locaux
  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_URL}?id_parcours=${user.id_parcours}&niveau=${user.niveau}`);
      const json = await response.json();
      if (json.success) {
        setAllDocs(json.data);
        await checkExistingFiles(json.data);
      }
    } catch (error) {
      console.error("Erreur de récupération:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const checkExistingFiles = async (data) => {
    let status = {};
    for (let item of data) {
      const fileName = item.url_fichier.split('/').pop();
      const fileUri = FileSystem.documentDirectory + fileName;
      const info = await FileSystem.getInfoAsync(fileUri);
      if (info.exists) status[item.url_fichier] = true;
    }
    setDownloadedFiles(status);
  };

  useFocusEffect(useCallback(() => { fetchDocuments(); }, []));

  const onRefresh = () => {
    setRefreshing(true);
    fetchDocuments();
  };

  // Action de clic : Ouvrir si présent, sinon télécharger
  const handleFileAction = async (url_fichier) => {
    const fileName = url_fichier.split('/').pop();
    const fileUri = FileSystem.documentDirectory + fileName;

    if (downloadedFiles[url_fichier]) {
      try {
        if (Platform.OS === 'android') {
          const cUri = await FileSystem.getContentUriAsync(fileUri);
          await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: cUri, flags: 1, type: 'application/pdf',
          });
        } else {
          await Sharing.shareAsync(fileUri);
        }
      } catch (e) {
        Alert.alert("Erreur", "Impossible d'ouvrir le fichier.");
      }
    } else {
      const downloadUrl = (BASE_URL_DOCS + url_fichier).replace(/\s/g, '%20');
      try {
        const downloadRes = await FileSystem.downloadAsync(downloadUrl, fileUri);
        if (downloadRes.status === 200) {
          setDownloadedFiles(prev => ({ ...prev, [url_fichier]: true }));
        } else {
          Alert.alert("Serveur", "Fichier introuvable sur le serveur.");
        }
      } catch (error) {
        Alert.alert("Erreur", "Échec du téléchargement.");
      }
    }
  };

  // Extraire les UEs uniques depuis les documents de type 'COURS'
  const ueList = [...new Map(allDocs
    .filter(d => d.type_doc === 'COURS')
    .map(item => [item.ue_id, { id: item.ue_id, name: item.nom_ue || "Matière" }]))
    .values()];
  
  const filteredCours = allDocs.filter(d => d.type_doc === 'COURS' && d.ue_id === selectedUE);
  const otherDocs = allDocs.filter(d => d.type_doc === 'ADMIN'); 

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
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

      <View style={styles.pad}>
        <Text style={styles.pageTitle}>Espace Documents</Text>

        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, activeTab === 'stage' && styles.activeTab]} onPress={() => setActiveTab('stage')}>
            <Text style={[styles.tabTxt, activeTab === 'stage' && styles.activeTabTxt]}>Stages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'docs' && styles.activeTab]} onPress={() => setActiveTab('docs')}>
            <Text style={[styles.tabTxt, activeTab === 'docs' && styles.activeTabTxt]}>Documents</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F59E0B']} />}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'stage' ? (
            <View style={styles.tabContent}>
               <View style={styles.infoCard}>
                <View style={styles.cardHeader}>
                  <FontAwesome5 name="briefcase" size={20} color="#F59E0B" />
                  <Text style={styles.cardHeaderTxt}>Plateforme de Stage</Text>
                </View>
                <Text style={styles.subText}>Retrouvez vos offres et conventions de stage sur le portail étudiant.</Text>
                <TouchableOpacity style={styles.externalLinkBtn} onPress={() => Linking.openURL('https://etudiant.iut-ndere.net/stage/Auth')}>
                  <Text style={styles.btnText}>Accéder au site</Text>
                  <Feather name="external-link" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.tabContent}>
              <View style={styles.subTabsUnderline}>
                <TouchableOpacity style={[styles.subTabUnderline, activeDocSubTab === 'cours' && styles.activeSubTabUnderline]} onPress={() => setActiveDocSubTab('cours')}>
                  <Text style={[styles.subTabTxtUnderline, activeDocSubTab === 'cours' && styles.activeSubTabTxtUnderline]}>Supports de cours</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.subTabUnderline, activeDocSubTab === 'autres' && styles.activeSubTabUnderline]} onPress={() => setActiveDocSubTab('autres')}>
                  <Text style={[styles.subTabTxtUnderline, activeDocSubTab === 'autres' && styles.activeSubTabTxtUnderline]}>Administratif</Text>
                </TouchableOpacity>
              </View>

              {activeDocSubTab === 'cours' ? (
                <View style={styles.docSection}>
                  <TouchableOpacity style={styles.selector} onPress={() => setShowUESelector(!showUESelector)}>
                    <Text style={selectedUE ? styles.white : styles.sub}>
                      {selectedUE ? ueList.find(u => u.id === selectedUE)?.name : "Choisir une matière"}
                    </Text>
                    <Feather name={showUESelector ? "chevron-up" : "chevron-down"} size={20} color="#94A3B8" />
                  </TouchableOpacity>

                  {showUESelector && (
                    <View style={styles.dropdown}>
                      {ueList.map((ue) => (
                        <TouchableOpacity key={ue.id} style={styles.dropdownItem} onPress={() => { setSelectedUE(ue.id); setShowUESelector(false); }}>
                          <Text style={styles.white}>{ue.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <View style={styles.docsList}>
                    {filteredCours.map((doc, index) => (
                      <TouchableOpacity key={index} style={styles.docItem} onPress={() => handleFileAction(doc.url_fichier)}>
                        <MaterialCommunityIcons 
                          name="file-pdf-box" size={28} 
                          color={downloadedFiles[doc.url_fichier] ? "#10B981" : "#EF4444"} 
                        />
                        <View style={styles.docTextContainer}>
                          <Text style={styles.whiteSmall} numberOfLines={1}>{doc.titre}</Text>
                          <Text style={styles.subExtraSmall}>{downloadedFiles[doc.url_fichier] ? "Ouvrir" : "Télécharger"}</Text>
                        </View>
                        {!downloadedFiles[doc.url_fichier] && <Feather name="download" size={18} color="#F59E0B" />}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.docSection}>
                  {otherDocs.map((doc, index) => (
                    <TouchableOpacity key={index} style={styles.otherDocCard} onPress={() => handleFileAction(doc.url_fichier)}>
                      <View style={styles.iconCircle}><Feather name="file-text" size={18} color="#3B82F6" /></View>
                      <View style={styles.docTextContainer}>
                        <Text style={styles.whiteSmall}>{doc.titre}</Text>
                        <Text style={styles.subExtraSmall}>{downloadedFiles[doc.url_fichier] ? "Disponible" : "À télécharger"}</Text>
                      </View>
                      {!downloadedFiles[doc.url_fichier] && <Feather name="download" size={18} color="#F59E0B" />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  orange: { color: '#F59E0B' },
  date: { color: '#94A3B8' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#F59E0B', borderRadius: 10, width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  pad: { flex: 1, paddingHorizontal: 20 },
  pageTitle: { color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  tabs: { flexDirection: 'row', backgroundColor: '#1E293B', borderRadius: 12, padding: 5, marginBottom: 15 },
  tab: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#F59E0B' },
  tabTxt: { color: '#94A3B8', fontWeight: 'bold' },
  activeTabTxt: { color: 'white' },
  subTabsUnderline: { flexDirection: 'row', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#334155', marginBottom: 20, marginTop: 5 },
  subTabUnderline: { paddingVertical: 12, paddingHorizontal: 15, marginHorizontal: 10, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeSubTabUnderline: { borderBottomColor: '#3B82F6' },
  subTabTxtUnderline: { color: '#94A3B8', fontSize: 15, fontWeight: '600' },
  activeSubTabTxtUnderline: { color: '#FFFFFF', fontWeight: '700' },
  tabContent: { paddingBottom: 30 },
  infoCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  cardHeaderTxt: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  subText: { color: '#94A3B8', fontSize: 14, lineHeight: 22, marginBottom: 20 },
  externalLinkBtn: { backgroundColor: '#F59E0B', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 12 },
  btnText: { color: 'white', fontWeight: 'bold', marginRight: 10 },
  selector: { backgroundColor: '#1E293B', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  dropdown: { backgroundColor: '#1E293B', marginTop: 8, borderRadius: 12, borderWidth: 1, borderColor: '#334155', overflow: 'hidden' },
  dropdownItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#334155' },
  docItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 14, borderRadius: 12, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: '#EF4444' },
  docTextContainer: { flex: 1, marginLeft: 12 },
  white: { color: 'white' },
  sub: { color: '#94A3B8' },
  whiteSmall: { color: 'white', fontSize: 14, fontWeight: '600' },
  subExtraSmall: { color: '#64748B', fontSize: 12 },
  otherDocCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  iconCircle: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.1)', alignItems: 'center', justifyContent: 'center' }
});