import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  StatusBar, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard,
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS } from '../../config/api';

export default function LoginScreen({ navigation }) {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [secureLogin, setSecureLogin] = useState(true);
  const { setUser } = useAuth();

  const handleSubmit = async () => {
    if (!matricule || !password) {
      alert("Merci de remplir tous les champs");
      return;
    }

    const data = { matricule, password };

    try {
      const url = API_ENDPOINTS.login;
     
      const header = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(data),
      }); 

      const result = await response.json();

      if (!result.success) {
        alert(result.message);
      } else {
        setUser(result.user);
      }

    } catch (error) {
      console.error('Erreur envoi: ', error);
      alert('Réessayer plus tard');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      {/* 1. KeyboardAvoidingView empêche le clavier de cacher les inputs */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* 2. Permet de fermer le clavier en cliquant n'importe où ailleurs */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          
          {/* 3. ScrollView permet de faire défiler si l'écran est petit ou le clavier trop haut */}
          <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
            
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/images/logo-iut.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>MON <Text style={styles.orange}>IUT</Text></Text>
            <Text style={styles.subtitle}>Université de Ngaoundéré</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Matricule</Text>
              <View style={styles.inputWrap}>
                <MaterialIcons name="account-box" size={20} color="#F59E0B" />
                <TextInput 
                  style={styles.input} 
                  placeholder="Ex: 22GLO43IU" 
                  placeholderTextColor="#64748B" 
                  value={matricule} 
                  onChangeText={setMatricule}
                  autoCapitalize="characters" // Pratique pour les matricules
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.inputWrap}>
                <Feather name="lock" size={20} color="#F59E0B" />
                <TextInput 
                  style={styles.input} 
                  placeholder="........" 
                  placeholderTextColor="#64748B" 
                  value={password} 
                  onChangeText={setPassword} 
                  secureTextEntry={secureLogin} 
                />
                <TouchableOpacity onPress={() => setSecureLogin(!secureLogin)}>
                  <Feather name={secureLogin ? "eye-off" : "eye"} size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
              <Text style={styles.btnText}>Se connecter</Text>
            </TouchableOpacity>

            <Text style={styles.footer}>En cas de problème, contactez le service informatique.{"\n"}v1.0.0 Beta</Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scrollContent: { 
    flexGrow: 1, 
    padding: 30, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  logoContainer: { 
    width: 100, 
    height: 100, 
    backgroundColor: 'white', 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  logo: { width: 100, height: 100, borderRadius: 25 },
  title: { color: 'white', fontSize: 32, fontWeight: '900' },
  orange: { color: '#F59E0B' },
  subtitle: { color: '#94A3B8', marginBottom: 40 },
  inputGroup: { width: '100%', marginBottom: 20 },
  label: { color: '#94A3B8', marginBottom: 8 },
  inputWrap: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1E293B', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    height: 55 
  },
  input: { flex: 1, color: 'white', marginLeft: 10 },
  btn: { 
    backgroundColor: '#F59E0B', 
    width: '100%', 
    height: 55, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10 
  },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  footer: { 
    color: '#64748B', 
    textAlign: 'center', 
    marginTop: 40, // Changé de position absolute à margin pour le scroll
    fontSize: 12,
    paddingBottom: 20 
  }
});
