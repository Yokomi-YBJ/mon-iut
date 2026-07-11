import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function ProfilScreen({ navigation }) {
  const date = new Date();
  const jour = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  
  // 1. On récupère la fonction logout en plus de user
  const { user, logout } = useAuth();
  
  // 2. État pour gérer la visibilité de la modale
  const [modalVisible, setModalVisible] = useState(false);

  // 3. Fonction pour valider la déconnexion
  const handleConfirmLogout = async () => {
    setModalVisible(false);
    await logout(); // Supprime les données et redirige vers Login.js
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header identique à AccueilScreen */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            Mon <Text style={styles.orange}>IUT</Text>
          </Text>
          <Text style={styles.date}>{jour}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('notification')}>
          <Feather name="bell" size={26} color="white" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.center}>
          <View style={styles.avatarBorder}>
            <View style={styles.avatar}>
              <Feather name="user" size={60} color="white" />
            </View>
          </View>
          <Text style={styles.name}>{user?.nom}</Text>
          <Text style={styles.idText}>{user?.matricule}</Text>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.row}>
            <Text style={styles.label}>Filière</Text>
            <Text style={styles.orange}>{user?.filiere}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Cycle & niveau</Text>
            <Text style={styles.orange}> {user?.cycle} {user?.niveau}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.menu} onPress={() => navigation.navigate('newPassword')}>
          <Feather name="lock" size={20} color="#94A3B8" />
          <Text style={styles.menuTxt}>Changer votre mot de passe</Text>
          <Feather name="chevron-right" size={20} color="#64748B" />
        </TouchableOpacity>

        {/* 4. On ouvre la modale au clic */}
        <TouchableOpacity style={styles.logout} onPress={() => setModalVisible(true)}>
          <MaterialIcons name="logout" size={20} color="#EF4444" />
          <Text style={styles.logoutTxt}>Se déconnecter</Text>
        </TouchableOpacity>

        <Text style={styles.copy}>IUT Ngaoundéré © 2026</Text>
      </ScrollView>

      {/* 5. Ajout de la Modale de confirmation */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Feather name="alert-triangle" size={40} color="#F59E0B" style={{ marginBottom: 15 }} />
            <Text style={styles.modalMessage}>Souhaitez-vous vraiment vous déconnecter de votre compte ?</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.btn, styles.btnCancel]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnTextCancel}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.btn, styles.btnLogout]} 
                onPress={handleConfirmLogout}
              >
                <Text style={styles.btnTextLogout}>Oui, quitter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  orange: { color: '#F59E0B' },
  date: { color: '#94A3B8' },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  scroll: { padding: 20 },
  center: { alignItems: 'center', marginBottom: 30 },
  avatarBorder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 15 },
  idText: { color: '#F59E0B', marginTop: 5, fontWeight: '500' },
  infoBox: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#94A3B8' },
  grey: { color: '#94A3B8' },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 15 },
  menu: {
    backgroundColor: '#1E293B',
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuTxt: { flex: 1, color: 'white', marginLeft: 15 },
  logout: {
    backgroundColor: '#EF444410',
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF444430',
  },
  logoutTxt: { color: '#EF4444', fontWeight: 'bold', marginLeft: 10 },
  copy: { textAlign: 'center', color: '#334155', marginTop: 30, fontSize: 12 },

  // --- NOUVEAUX STYLES POUR LA MODALE ---
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(15, 23, 42, 0.85)', // Fond semi-transparent sombre
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    width: '85%', 
    backgroundColor: '#1E293B', 
    borderRadius: 20, 
    padding: 25, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  modalMessage: { 
    color: '#94A3B8', 
    textAlign: 'center', 
    marginBottom: 25,
    lineHeight: 20
  },
  modalButtons: { 
    flexDirection: 'row', 
    width: '100%' 
  },
  btn: { 
    flex: 1, 
    padding: 15, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  btnCancel: { 
    backgroundColor: '#334155', 
    marginRight: 10 
  },
  btnLogout: { 
    backgroundColor: '#F59E0B' 
  },
  btnTextCancel: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
  btnTextLogout: { 
    color: 'white', 
    fontWeight: 'bold' 
  }
});