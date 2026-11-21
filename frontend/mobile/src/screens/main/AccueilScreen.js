import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/apiClient';

export default function AccueilScreen({ navigation }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestNotif, setLatestNotif] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const date = new Date();
  const jour = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const fetchData = async () => {
    try {
      const res = await apiClient.get('/mobile/notifications');
      const notifs = res.data.data || [];
      const unread = notifs.filter((n) => !n.est_lu);
      setUnreadCount(unread.length);
      if (notifs.length > 0) {
        setLatestNotif(notifs[0]);
      }
    } catch (e) {
      // Ignorer
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Barre supérieure */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            Mon <Text style={styles.orange}>IUT</Text>
          </Text>
          <Text style={styles.date}>{jour}</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('NotificationScreen')}
          style={styles.bellButton}
          accessibilityLabel="Voir les notifications"
        >
          <Feather name="bell" size={24} color="#FFFFFF" />
          {unreadCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#F97616"
          />
        }
      >
        {/* Carte de bienvenue */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTxt}>Bienvenue,</Text>
          <Text style={styles.name}>
            {user?.nom} {user?.prenom}
          </Text>
          <Text style={styles.matriculeText}>Matricule : {user?.matricule}</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>
              {user?.nom_parcours || 'Parcours'} - {user?.nomCycle || 'DUT'} {user?.niveau}
            </Text>
          </View>
        </View>

        {/* Accès Rapide */}
        <Text style={styles.sectionTitle}>Accès Rapide</Text>
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => navigation.navigate('Planning')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#10B98120' }]}>
              <Feather name="calendar" size={22} color="#10B981" />
            </View>
            <Text style={styles.gridTitle}>Emploi du Temps</Text>
            <Text style={styles.gridSub}>Consulter le planning</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => navigation.navigate('Académique')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#F9761620' }]}>
              <Feather name="book-open" size={22} color="#F97616" />
            </View>
            <Text style={styles.gridTitle}>Évaluations</Text>
            <Text style={styles.gridSub}>Notes & Moyennes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          <TouchableOpacity
            style={[styles.gridCard, { width: '100%', marginTop: 12 }]}
            onPress={() => navigation.navigate('Docs & Stages')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#6366F120' }]}>
              <Feather name="file-text" size={22} color="#6366F1" />
            </View>
            <Text style={styles.gridTitle}>Documents & Stages</Text>
            <Text style={styles.gridSub}>Circulaires officielles et supports de cours</Text>
          </TouchableOpacity>
        </View>

        {/* Dernier communiqué */}
        <Text style={styles.sectionTitle}>Dernière Communication</Text>
        {latestNotif ? (
          <TouchableOpacity
            style={styles.newsCard}
            onPress={() => navigation.navigate('NotificationScreen')}
          >
            <View style={styles.newsHeader}>
              <Text style={styles.newsTitle}>{latestNotif.titre}</Text>
              <Text style={styles.newsDate}>
                {new Date(latestNotif.date_envoi).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                })}
              </Text>
            </View>
            <Text style={styles.newsBody} numberOfLines={2}>
              {latestNotif.contenu}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyNewsCard}>
            <Text style={styles.emptyNewsText}>
              Aucun nouveau communiqué pour le moment.
            </Text>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  orange: {
    color: '#F97616',
  },
  date: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  bellButton: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#F97616',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scroll: {
    padding: 20,
    paddingTop: 10,
  },
  welcomeCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  welcomeTxt: {
    color: '#94A3B8',
    fontSize: 13,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  matriculeText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#0F172A',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tagText: {
    color: '#F97616',
    fontWeight: 'bold',
    fontSize: 11,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridCard: {
    backgroundColor: '#1E293B',
    width: '48%',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  gridSub: {
    color: '#94A3B8',
    fontSize: 11,
  },
  newsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F97616',
    borderWidth: 1,
    borderColor: '#334155',
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  newsTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
  },
  newsDate: {
    color: '#F97616',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 8,
  },
  newsBody: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
  },
  emptyNewsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  emptyNewsText: {
    color: '#64748B',
    fontSize: 12,
  },
});
