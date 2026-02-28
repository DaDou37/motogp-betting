import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView,
  Platform, ActivityIndicator, Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';


export default function AuthScreen({ navigation }: any) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const [loginForm, setLoginForm] = useState({ email: '', motDePasse: '' });
  const [registerForm, setRegisterForm] = useState({ pseudo: '', email: '', motDePasse: '', confirm: '' });

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.motDePasse) {
      Alert.alert('Erreur', 'Remplissez tous les champs');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/utilisateurs/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginForm.email, motDePasse: loginForm.motDePasse }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      await login(data);
      navigation.replace('Home');
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Erreur de connexion');
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!registerForm.pseudo || !registerForm.email || !registerForm.motDePasse) {
      Alert.alert('Erreur', 'Remplissez tous les champs');
      return;
    }
    if (registerForm.motDePasse !== registerForm.confirm) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/utilisateurs/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pseudo: registerForm.pseudo, email: registerForm.email, motDePasse: registerForm.motDePasse }),
      });
      if (!res.ok) throw new Error(await res.text());
      Alert.alert('Succès', 'Inscription réussie ! Connectez-vous.', [
        { text: 'OK', onPress: () => setMode('login') }
      ]);
    } catch (err: any) {
      Alert.alert('Erreur', err.message || "Erreur lors de l'inscription");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>

        {/* LOGO */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>MOTOGP</Text>
          </View>
          <Text style={styles.logoSub}>BETTING 2026</Text>
        </View>

        {/* TABS */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, mode === 'login' && styles.tabActive]}
            onPress={() => setMode('login')}
          >
            <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>CONNEXION</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, mode === 'register' && styles.tabActive]}
            onPress={() => setMode('register')}
          >
            <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>INSCRIPTION</Text>
          </TouchableOpacity>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          {mode === 'register' && (
            <>
              <Text style={styles.label}>PSEUDO</Text>
              <TextInput
                style={styles.input}
                placeholder="VotrePseudo"
                placeholderTextColor="#444"
                value={registerForm.pseudo}
                onChangeText={t => setRegisterForm({ ...registerForm, pseudo: t })}
                autoCapitalize="none"
              />
            </>
          )}

          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="votre@email.com"
            placeholderTextColor="#444"
            value={mode === 'login' ? loginForm.email : registerForm.email}
            onChangeText={t => mode === 'login'
              ? setLoginForm({ ...loginForm, email: t })
              : setRegisterForm({ ...registerForm, email: t })}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>MOT DE PASSE</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#444"
            value={mode === 'login' ? loginForm.motDePasse : registerForm.motDePasse}
            onChangeText={t => mode === 'login'
              ? setLoginForm({ ...loginForm, motDePasse: t })
              : setRegisterForm({ ...registerForm, motDePasse: t })}
            secureTextEntry
          />

          {mode === 'register' && (
            <>
              <Text style={styles.label}>CONFIRMER</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#444"
                value={registerForm.confirm}
                onChangeText={t => setRegisterForm({ ...registerForm, confirm: t })}
                secureTextEntry
              />
            </>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={mode === 'login' ? handleLogin : handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {mode === 'login' ? 'SE CONNECTER →' : "S'INSCRIRE →"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Points info */}
        <View style={styles.pointsRow}>
          {[
            { pts: '10pts', label: '1er' },
            { pts: '7pts', label: '2ème' },
            { pts: '5pts', label: '3ème' },
            { pts: '+15pts', label: 'Bonus' },
          ].map((item, i) => (
            <View key={i} style={styles.pointItem}>
              <Text style={styles.pointValue}>{item.pts}</Text>
              <Text style={styles.pointLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBadge: {
    backgroundColor: '#e10600',
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 8,
  },
  logoText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 3,
  },
  logoSub: {
    color: '#555',
    fontSize: 11,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#e10600',
  },
  tabText: {
    color: '#555',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  tabTextActive: {
    color: '#fff',
  },
  form: {
    backgroundColor: '#0f0f0f',
    borderTopWidth: 3,
    borderTopColor: '#e10600',
    borderWidth: 1,
    borderColor: '#1a1a1a',
    padding: 24,
    marginBottom: 24,
  },
  label: {
    color: '#555',
    fontSize: 10,
    letterSpacing: 3,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderBottomWidth: 2,
    borderBottomColor: '#333',
    color: '#fff',
    padding: 14,
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#e10600',
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 3,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0f0f0f',
    borderWidth: 1,
    borderColor: '#1a1a1a',
    padding: 16,
  },
  pointItem: {
    alignItems: 'center',
  },
  pointValue: {
    color: '#e10600',
    fontSize: 16,
    fontWeight: '900',
  },
  pointLabel: {
    color: '#444',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});