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

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDocs = async () => {
    try {
      const res = await apiClient.get('/mobile/docs');
      setDocuments(res.data.data || []);
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de charger les documents.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleOpenDoc = async (urlFichier) => {
    const fullUrl = `${API_ENDPOINTS.fileBase}${urlFichier}`;
    try {
      const supported = await Linking.canOpenURL(fullUrl);
      if (supported) {
        await Linking.openURL(fullUrl);
      } else {
        Alert.alert('Information', `Lien : ${fullUrl}`);
      }
    } catch (e) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir le document.');
    }
  };

  const docsFiltres = documents.filter((d) => {
    if (filterType === 'ALL') return true;
    return d.type_doc === filterType;
  });

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor:
                item.type_doc === 'COURS' ? '#6366F120' : '#F9761620',
            },
          ]}
        >
          <Feather
            name={item.type_doc === 'COURS' ? 'book' : 'file-text'}
            size={18}
            color={item.type_doc === 'COURS' ? '#6366F1' : '#F97616'}
          />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{item.titre}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.type_doc === 'COURS' ? 'Support de cours' : 'Administratif'}
              </Text>
            </View>
            <Text style={styles.date}>
              {new Date(item.date_publication).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.author}>Auteur : {item.auteur || 'Administration'}</Text>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => handleOpenDoc(item.url_fichier)}
        >
          <Feather name="download" size={13} color="#FFFFFF" />
          <Text style={styles.downloadText}>Ouvrir PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Documents & Stages</Text>
        <Text style={styles.screenSubtitle}>
          Circulaires officielles, conventions de stage et supports académiques
        </Text>
      </View>

      {/* Barre de filtres */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'ALL' && styles.filterButtonActive]}
          onPress={() => setFilterType('ALL')}
        >
          <Text
            style={[styles.filterText, filterType === 'ALL' && styles.filterTextActive]}
          >
            Tous ({documents.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filterType === 'ADMIN' && styles.filterButtonActive]}
          onPress={() => setFilterType('ADMIN')}
        >
          <Text
            style={[styles.filterText, filterType === 'ADMIN' && styles.filterTextActive]}
          >
            Administratif
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filterType === 'COURS' && styles.filterButtonActive]}
          onPress={() => setFilterType('COURS')}
        >
          <Text
            style={[styles.filterText, filterType === 'COURS' && styles.filterTextActive]}
          >
            Cours & TD
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#F97616" />
          <Text style={styles.loadingText}>Chargement des documents...</Text>
        </View>
      ) : docsFiltres.length === 0 ? (
        <View style={styles.centerBox}>
          <Feather name="inbox" size={40} color="#64748B" />
          <Text style={styles.emptyTitle}>Aucun document trouvé</Text>
          <Text style={styles.emptySubtitle}>
            Aucun document ne correspond à cette catégorie pour le moment.
          </Text>
        </View>
      ) : (
        <FlatList
          data={docsFiltres}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchDocs();
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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#1E293B',
  },
  filterButtonActive: {
    backgroundColor: '#F97616',
  },
  filterText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  list: {
    padding: 20,
    gap: 12,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
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
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '600',
  },
  date: {
    color: '#64748B',
    fontSize: 11,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 5,
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
  },
  emptySubtitle: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
});
