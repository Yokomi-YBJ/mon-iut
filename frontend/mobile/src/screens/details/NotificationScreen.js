import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import apiClient from '../../services/apiClient';

export default function NotificationScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifs = async () => {
    try {
      const res = await apiClient.get('/mobile/notifications');
      setNotifications(res.data.data || []);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de charger vos notifications.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAsRead = async (notifId) => {
    try {
      await apiClient.patch(`/mobile/notifications/${notifId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, est_lu: 1 } : n))
      );
    } catch (e) {
      // Ignorer
    }
  };

  const renderItem = ({ item }) => {
    const isUnread = !item.est_lu;

    return (
      <View style={[styles.card, isUnread && styles.unreadCard]}>
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            {isUnread && <View style={styles.unreadDot} />}
            <Text style={[styles.title, isUnread && styles.unreadTitle]}>
              {item.titre}
            </Text>
          </View>
          <Text style={styles.date}>
            {new Date(item.date_envoi).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        <Text style={styles.body}>{item.contenu}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.author}>Expéditeur : {item.auteur || 'Administration'}</Text>
          {isUnread ? (
            <TouchableOpacity
              style={styles.readButton}
              onPress={() => handleMarkAsRead(item.id)}
            >
              <Feather name="check" size={12} color="#F97616" />
              <Text style={styles.readButtonText}>Marquer comme lu</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.readBadge}>Lu</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.screenHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Notifications & Annonces</Text>
      </View>

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#F97616" />
          <Text style={styles.loadingText}>Chargement des notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.centerBox}>
          <Feather name="bell-off" size={40} color="#64748B" />
          <Text style={styles.emptyTitle}>Aucune notification</Text>
          <Text style={styles.emptySubtitle}>
            Toutes vos communications et avis de scolarité s'afficheront ici.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchNotifs();
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    gap: 12,
  },
  backButton: {
    padding: 6,
  },
  screenTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F97616',
    backgroundColor: '#1E293B',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F97616',
  },
  title: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  unreadTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  date: {
    color: '#64748B',
    fontSize: 11,
    marginLeft: 8,
  },
  body: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  author: {
    color: '#64748B',
    fontSize: 11,
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readButtonText: {
    color: '#F97616',
    fontSize: 11,
    fontWeight: '600',
  },
  readBadge: {
    color: '#64748B',
    fontSize: 11,
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
