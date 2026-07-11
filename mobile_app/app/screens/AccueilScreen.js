import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function AccueilScreen({ navigation }) {

    const date = new Date();
    const jour = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    const { user } = useAuth();

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

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.welcomeCard}>
          <Ionicons name="school" size={190} color="#ffffff10" style={styles.watermark} />
          <Text style={styles.welcomeTxt}>Bienvenue,</Text>
          <Text style={styles.name}>{user?.nom}</Text>
          <View style={styles.tag}><Text style={styles.tagText}>{user?.parcours} - {user?.cycle}{user?.niveau}</Text></View>
        </View>

        <Text style={styles.sectionTitle}>Accès Rapide</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridCard} onPress={() => navigation.navigate('Planning')}>
            <View style={[styles.iconBox, {backgroundColor: '#10B98120'}]}><Feather name="calendar" size={24} color="#10B981" /></View>
            <Text style={styles.gridTitle}>Emploi du Temps</Text>
            <Text style={styles.gridSub}>Semaine</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridCard} onPress={() => navigation.navigate('Docs & Stages')}>
            <View style={[styles.iconBox, {backgroundColor: '#F59E0B20'}]}><FontAwesome5 name="briefcase" size={22} color="#F59E0B" /></View>
            <Text style={styles.gridTitle}>Stages & Docs</Text>
            <Text style={styles.gridSub}>Dates & Modèles</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Dernier Communiqué</Text>
        <View style={styles.newsCard}>
          <View style={styles.newsHeader}>
            <Text style={styles.newsTitle}>Convocation Délégués</Text>
            <Text style={styles.newsDate}>Aujourd&#36hui, 08:30</Text>
          </View>
          <Text style={styles.newsBody}>Tous les délégués sont attendus à la salle des actes à 14h.</Text>
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
  scroll: { padding: 20 },
  welcomeCard: { backgroundColor: '#1E293B', borderRadius: 24, padding: 25, height: 160, overflow: 'hidden' },
  watermark: { position: 'absolute', right: -20, bottom: -20 },
  welcomeTxt: { color: '#94A3B8', fontSize: 16 },
  name: { color: 'white', fontSize: 28, fontWeight: 'bold', marginVertical: 8 },
  tag: { backgroundColor: '#334155', alignSelf: 'flex-start', padding: 8, borderRadius: 8 },
  tagText: { color: '#F59E0B', fontWeight: 'bold', fontSize: 12 },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginVertical: 20 },
  grid: { flexDirection: 'row', justifyContent: 'space-between' },
  gridCard: { backgroundColor: '#1E293B', width: '48%', borderRadius: 20, padding: 20 },
  iconBox: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  gridTitle: { color: 'white', fontWeight: 'bold', marginBottom: 5 },
  gridSub: { color: '#64748B', fontSize: 12 },
  newsCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 20, borderLeftWidth: 4, borderLeftColor: '#F59E0B' },
  newsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  newsTitle: { color: 'white', fontWeight: 'bold' },
  newsDate: { color: '#F59E0B', fontSize: 11 },
  newsBody: { color: '#94A3B8' }
});