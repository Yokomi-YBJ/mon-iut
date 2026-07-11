import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  StatusBar, ActivityIndicator, RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS } from '../../config/api';

export default function NotificationScreen({ navigation }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Note: Assure-toi que ton téléphone et ton PC sont sur le même WiFi
  const API_URL = API_ENDPOINTS.get_notifications;

  const fetchNotifications = useCallback(async () => {
    // Sécurité : on ne lance la requête que si l'utilisateur est chargé
    if (!user?.id_parcours || !user?.niveau) {
        console.warn("Données utilisateur manquantes");
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(`${API_URL}?id_parcours=${user.id_parcours}&niveau=${user.niveau}`);
      const json = await response.json();
      if (json.success) {
        setNotifications(json.data);
      }
    } catch (error) {
      console.error("Erreur notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const getAlertStyle = (type) => {
    switch (type) {
      case 'URGENT': return { color: '#EF4444', icon: 'warning' };
      case 'INFO': return { color: '#3B82F6', icon: 'information-circle-outline' };
      default: return { color: '#F59E0B', icon: 'megaphone-outline' };
    }
  };

  // Fonction pour formater la date proprement
  const formatDate = (dateString) => {
    const date = new Date(dateString.replace(' ', 'T')); // Hack pour compatibilité ISO
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.hTitle}>Mon <Text style={styles.orange}>IUT</Text></Text>
      </View>

      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.pad}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F59E0B" />
        }
      >
        <Text style={styles.pageTitle}>Notifications</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#F59E0B" style={{ marginTop: 50 }} />
        ) : notifications.length > 0 ? (
          notifications.map((item, i) => {
            const style = getAlertStyle(item.type_alerte);
            return (
              <View key={i} style={[styles.card, { borderLeftColor: style.color }]}>
                <View style={styles.row}>
                  <Ionicons name={style.icon} size={22} color={style.color} />
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.titre}</Text>
                  <Text style={[styles.date, { color: style.color }]}>
                    {formatDate(item.date)}
                  </Text>
                </View>
                <Text style={styles.body}>{item.body}</Text>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune notification pour le moment.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', alignItems: 'center' },
  hTitle: { color: 'white', fontWeight: 'bold', marginLeft: 20, fontSize: 24 },
  orange: { color: '#F59E0B' },
  pad: { paddingHorizontal: 20 },
  pageTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 25 },
  card: { backgroundColor: '#1E293B', padding: 15, borderRadius: 16, borderLeftWidth: 4, marginBottom: 15 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { color: 'white', fontWeight: 'bold', flex: 1, marginLeft: 10, fontSize: 16 },
  date: { fontSize: 11, fontWeight: 'bold', marginLeft: 5 },
  body: { color: '#94A3B8', lineHeight: 20, fontSize: 14 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#94A3B8', textAlign: 'center' }
});