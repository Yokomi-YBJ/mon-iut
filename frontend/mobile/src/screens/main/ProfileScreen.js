import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Profil Étudiant</Text>
        <Text style={styles.screenSubtitle}>
          Informations personnelles et paramètres de compte
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Carte Identité */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Feather name="user" size={36} color="#F97616" />
          </View>
          <Text style={styles.userName}>
            {user?.nom} {user?.prenom}
          </Text>
          <Text style={styles.matriculeText}>{user?.matricule}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Compte Actif</Text>
          </View>
        </View>

        {/* Détails Académiques */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Cursus Académique</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cycle</Text>
            <Text style={styles.infoValue}>{user?.nomCycle || 'DUT'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Filière</Text>
            <Text style={styles.infoValue}>{user?.nom_filiere || 'Génie Informatique'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Parcours / Option</Text>
            <Text style={styles.infoValue}>{user?.nom_parcours || 'Génie Logiciel'}</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Niveau Actuel</Text>
            <Text style={styles.infoValue}>Niveau {user?.niveau || '2'}</Text>
          </View>
        </View>

        {/* Actions & Paramètres */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Sécurité</Text>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('NewPasswordScreen')}
          >
            <View style={styles.actionLeft}>
              <Feather name="lock" size={18} color="#CBD5E1" />
              <Text style={styles.actionText}>Modifier le mot de passe</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Déconnexion */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={18} color="#DC2626" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
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
  scroll: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#F97616',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  matriculeText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#10B98120',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 10,
  },
  statusText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  sectionHeader: {
    color: '#F97616',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  infoLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
    marginBottom: 32,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
