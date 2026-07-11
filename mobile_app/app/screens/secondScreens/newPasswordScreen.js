import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS } from '../../config/api';

export default function ChangePasswordScreen({ navigation }) {
  const { user } = useAuth(); // Récupère l'utilisateur connecté via ton contexte
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [secureOld, setSecureOld] = useState(true);
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  const API_URL = API_ENDPOINTS.update_password;

  const handleUpdate = async () => {
    // Validation locale
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Champs vides", "Veuillez remplir tous les champs.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erreur", "Le nouveau mot de passe et la confirmation ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: user.id,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const json = await response.json();

      if (json.success) {

      Alert.alert("Succès",json.message);
      } else {
        Alert.alert("Échec", json.message);
      }
    } catch (error) {
      Alert.alert("Erreur", "Connexion au serveur impossible.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mot de passe</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="lock-closed-outline" size={40} color="#F59E0B" />
            </View>
            <Text style={styles.title}>Changer le mot de passe</Text>
            <Text style={styles.subtitle}>Votre nouveau mot de passe doit être différent de l'ancien.</Text>
          </View>

          <View style={styles.form}>
            {/* Ancien */}
            <Text style={styles.label}>Ancien mot de passe</Text>
            <View style={styles.inputContainer}>
              <Feather name="shield" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Entrez l'ancien mot de passe"
                placeholderTextColor="#64748B"
                secureTextEntry={secureOld}
                value={oldPassword}
                onChangeText={setOldPassword}
              />
              <TouchableOpacity onPress={() => setSecureOld(!secureOld)}>
                <Feather name={secureOld ? "eye-off" : "eye"} size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Nouveau */}
            <Text style={styles.label}>Nouveau mot de passe</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Entrez le nouveau mot de passe"
                placeholderTextColor="#64748B"
                secureTextEntry={secureNew}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setSecureNew(!secureNew)}>
                <Feather name={secureNew ? "eye-off" : "eye"} size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Confirmation */}
            <Text style={styles.label}>Confirmer le nouveau mot de passe</Text>
            <View style={styles.inputContainer}>
              <Feather name="check-circle" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmez le mot de passe"
                placeholderTextColor="#64748B"
                secureTextEntry={secureConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
                <Feather name={secureConfirm ? "eye-off" : "eye"} size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && { opacity: 0.7 }]} 
              onPress={handleUpdate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Modifier</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10 },
  backButton: { padding: 5, borderRadius: 12 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  scroll: { padding: 25 },
  iconContainer: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F59E0B15', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { color: '#94A3B8', textAlign: 'center', lineHeight: 20, fontSize: 14 },
  form: { marginTop: 10 },
  label: { color: '#94A3B8', fontSize: 14, marginBottom: 8, marginLeft: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 16, paddingHorizontal: 15, height: 60, marginBottom: 20, borderWidth: 1, borderColor: '#334155' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: 'white', fontSize: 16 },
  button: { backgroundColor: '#F59E0B', height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 20, elevation: 5 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});