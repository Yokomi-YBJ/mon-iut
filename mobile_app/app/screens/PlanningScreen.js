import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  ActivityIndicator, 
  Alert,
  Platform,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS, BASE_URL_DOCS } from '../config/api';

const PlanningScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloadedFiles, setDownloadedFiles] = useState({});

  const API_URL = API_ENDPOINTS.get_edt;
  const BASE_URL_DOCS = API_ENDPOINTS.base_docs;

    const date = new Date();
    const jour = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  // Fonction pour vérifier la présence des fichiers sur le téléphone
  const checkExistingFiles = async (data) => {
    let status = {};
    for (let item of data) {
      const fileName = item.url_fichier.split('/').pop();
      const fileUri = FileSystem.documentDirectory + fileName;
      const info = await FileSystem.getInfoAsync(fileUri);
      if (info.exists) {
        status[item.url_fichier] = true;
      }
    }
    setDownloadedFiles(status);
  };

  // Récupération des données depuis l'API
  const fetchSchedules = async () => {
    try {
      const response = await fetch(`${API_URL}?id_parcours=${user.id_parcours}&niveau=${user.niveau}`);
      const json = await response.json();
      if (json.success) {
        setSchedules(json.data);
        await checkExistingFiles(json.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Actualisation automatique quand on arrive sur l'écran
  useFocusEffect(
    useCallback(() => {
      fetchSchedules();
    }, [])
  );

  // Gestion du rafraîchissement manuel (Pull-to-refresh)
  const onRefresh = () => {
    setRefreshing(true);
    fetchSchedules();
  };

  const handleFileAction = async (url_fichier) => {
    const fileName = url_fichier.split('/').pop();
    const fileUri = FileSystem.documentDirectory + fileName;

    if (downloadedFiles[url_fichier]) {
      // OUVERTURE DIRECTE
      try {
        if (Platform.OS === 'android') {
          const cUri = await FileSystem.getContentUriAsync(fileUri);
          await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: cUri,
            flags: 1,
            type: 'application/pdf',
          });
        } else {
          await Sharing.shareAsync(fileUri);
        }
      } catch (e) {
        Alert.alert("Erreur", "Impossible d'ouvrir le document.");
      }
    } else {
      // TÉLÉCHARGEMENT
      const downloadUrl = (BASE_URL_DOCS + url_fichier).replace(/\s/g, '%20');
      try {
        const downloadRes = await FileSystem.downloadAsync(downloadUrl, fileUri);
        if (downloadRes.status === 200) {
          setDownloadedFiles(prev => ({ ...prev, [url_fichier]: true }));
          Alert.alert("Succès", "Fichier téléchargé avec succès.");
        } else {
          Alert.alert("Erreur", "Le fichier n'existe pas sur le serveur.");
        }
      } catch (error) {
        Alert.alert("Erreur", "Échec du téléchargement.");
      }
    }
  };

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

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F59E0B']} tintColor="#F59E0B" />
        }
      >
        <Text style={styles.sectionTitle}>Emploi du temps</Text>

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#F59E0B" style={{ marginTop: 50 }} />
        ) : schedules.length > 0 ? (
          schedules.map((item, index) => {
            const isDownloaded = downloadedFiles[item.url_fichier];
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.card, index === 0 && styles.cardActive]}
                onPress={() => handleFileAction(item.url_fichier)}
                activeOpacity={0.7}
              >
                {index === 0 && (
                  <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>ACTUEL</Text></View>
                )}
                
                <View style={styles.row}>
                  <View style={styles.pdfIcon}>
                    <MaterialCommunityIcons 
                      name="file-pdf-box" 
                      size={40} 
                      color={"#F87171"} 
                    />
                  </View>
                  
                  <View style={styles.info}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.titre}</Text>
                    <Text style={styles.fileName}>
                      {isDownloaded ? "Disponible hors-ligne" : `Publié le ${new Date(item.date_publication).toLocaleDateString('fr-FR')}`}
                    </Text>
                  </View>

                  {!isDownloaded ? (
                    <View style={styles.downloadBtn}>
                      <Feather name="download" size={20} color="#F59E0B" />
                    </View>
                  ) : (
                    <Feather name="check-circle" size={22} color="#10B981" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun emploi du temps disponible pour le moment.</Text>
            <Text style={styles.subEmptyText}>Tirez vers le bas pour actualiser</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  orange: { color: '#F59E0B' },
  date: { color: '#94A3B8', textTransform: 'capitalize' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#F59E0B', borderRadius: 10, width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  content: { padding: 20 },
  sectionTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#1E293B', borderRadius: 16, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#334155' },
  cardActive: { borderColor: '#F59E0B' },
  currentBadge: { position: 'absolute', top: -10, right: 10, backgroundColor: '#F59E0B', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  currentBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center' },
  pdfIcon: { marginRight: 15 },
  info: { flex: 1 },
  cardTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  fileName: { color: '#64748B', fontSize: 12, marginTop: 4 },
  downloadBtn: { backgroundColor: '#0F172A', padding: 8, borderRadius: 10 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#94A3B8', textAlign: 'center', fontSize: 16 },
  subEmptyText: { color: '#475569', fontSize: 12, marginTop: 10 }
});

export default PlanningScreen;