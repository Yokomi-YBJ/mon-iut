import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import apiClient from '../../services/apiClient';
import { API_ENDPOINTS } from '../../config/api';

export default function PlanningScreen() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEdt = async () => {
    try {
      const res = await apiClient.get('/mobile/edt');
      setDocuments(res.data.data || []);
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de charger l\'emploi du temps.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEdt();
  }, []);

  const handleOpenDoc = async (urlFichier) => {
    const fullUrl = `${API_ENDPOINTS.fileBase}${urlFichier}`;
    try {
      const supported = await Linking.canOpenURL(fullUrl);
      if (supported) {
        await Linking.openURL(fullUrl);
      } else {
        Alert.alert('Information', `Lien du fichier : ${fullUrl}`);
      }
    } catch (e) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir le document.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Feather name="calendar" size={20} color="#F97616" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{item.titre}</Text>
          <Text style={styles.meta}>
            Publié le {new Date(item.date_publication).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.author}>Auteur : {item.auteur || 'Administration'}</Text>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => handleOpenDoc(item.url_fichier)}
        >
          <Feather name="download" size={14} color="#FFFFFF" />
          <Text style={styles.downloadText}>Consulter (PDF)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Emploi du Temps</Text>
        <Text style={styles.screenSubtitle}>
          Plannings de cours hebdomadaires et calendrier académique
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#F97616" />
          <Text style={styles.loadingText}>Chargement du planning...</Text>
        </View>
      ) : documents.length === 0 ? (
        <View style={styles.centerBox}>
          <Feather name="inbox" size={40} color="#64748B" />
          <Text style={styles.emptyTitle}>Aucun emploi du temps disponible</Text>
          <Text style={styles.emptySubtitle}>
            Les plannings de votre parcours seront affichés ici dès leur publication.
          </Text>
        </View>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchEdt();
          }}
        />
      )}
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
  list: {
    padding: 20,
    gap: 14,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F9761620',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  meta: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  author: {
    color: '#64748B',
    fontSize: 11,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F97616',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  downloadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  centerBox: {
    flex: 1,
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
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
});
