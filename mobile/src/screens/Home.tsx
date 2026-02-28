import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

export default function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [grandsPrix, setGrandsPrix] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  console.log('API_URL:', API_URL);
  fetch(`${API_URL}/grandsprix`)
    .then(r => r.json())
    .then(data => { 
      console.log('data:', data);
      setGrandsPrix(data); 
      setLoading(false); 
    })
    .catch(err => {
      console.log('erreur:', err);
      setLoading(false);
    });
}, []);

  const prochainGP = grandsPrix.find(gp => !gp.estTermine);
  const gpTermines = grandsPrix.filter(gp => gp.estTermine).length;
  const gpRestants = grandsPrix.filter(gp => !gp.estTermine).length;

  const drapeaux: { [key: string]: string } = {
    'Thaïlande': '🇹🇭', 'Brésil': '🇧🇷', 'USA': '🇺🇸', 'Qatar': '🇶🇦',
    'Espagne': '🇪🇸', 'France': '🇫🇷', 'Italie': '🇮🇹', 'Hongrie': '🇭🇺',
    'Tchéquie': '🇨🇿', 'Pays-Bas': '🇳🇱', 'Allemagne': '🇩🇪', 'Royaume-Uni': '🇬🇧',
    'Autriche': '🇦🇹', 'Japon': '🇯🇵', 'Indonésie': '🇮🇩', 'Australie': '🇦🇺',
    'Malaisie': '🇲🇾', 'Portugal': '🇵🇹',
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>MOTOGP</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HERO */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🏁 SAISON 2026</Text>
          </View>
          <Text style={styles.heroTitle}>PARIEZ SUR{'\n'}
            <Text style={styles.heroTitleRed}>LE PODIUM</Text>
          </Text>
          <Text style={styles.heroSub}>Pronostiquez les 3 premiers pilotes de chaque Grand Prix</Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>SAISON PROGRESS</Text>
              <Text style={styles.progressValue}>{gpTermines}/{grandsPrix.length} GP</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, {
                width: grandsPrix.length > 0 ? `${(gpTermines / grandsPrix.length) * 100}%` : '0%'
              }]} />
            </View>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Grands Prix', value: grandsPrix.length },
            { label: 'Pilotes', value: 22 },
            { label: 'GP restants', value: gpRestants },
            { label: 'Points max', value: '627pts' },
          ].map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* PROCHAIN GP */}
        {prochainGP && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>PROCHAIN GRAND PRIX</Text>
            </View>
            <View style={styles.prochainCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.prochainPays}>{drapeaux[prochainGP.pays] || '🏁'} {prochainGP.pays}</Text>
                <Text style={styles.prochainNom}>{prochainGP.nom}</Text>
                <Text style={styles.prochainCircuit}>📍 {prochainGP.circuit}</Text>
              </View>
              <View style={styles.prochainRight}>
                <Text style={styles.prochainDate}>
                  {new Date(prochainGP.dateCourse).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }).toUpperCase()}
                </Text>
                <TouchableOpacity style={styles.parierBtn} onPress={() => navigation.navigate('Parier')}>
                  <Text style={styles.parierBtnText}>PARIER →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* CALENDRIER */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLine} />
            <Text style={styles.sectionTitle}>CALENDRIER 2026</Text>
          </View>
          {loading ? (
            <ActivityIndicator color="#e10600" size="large" />
          ) : (
            grandsPrix.map((gp: any, index: number) => (
              <TouchableOpacity
                key={gp.id}
                style={[styles.gpRow, gp.estTermine && styles.gpRowTermine]}
                onPress={() => navigation.navigate('Parier')}
              >
                <Text style={styles.gpRound}>{String(index + 1).padStart(2, '0')}</Text>
                <Text style={styles.gpDrapeau}>{drapeaux[gp.pays] || '🏁'}</Text>
                <View style={styles.gpInfo}>
                  <Text style={styles.gpNom}>{gp.nom.replace(/Grand Prix of |Grand Prix du |Grand Prix de /i, '')}</Text>
                  <Text style={styles.gpCircuit}>{gp.circuit}</Text>
                </View>
                <View style={styles.gpRight}>
                  <Text style={styles.gpDate}>
                    {new Date(gp.dateCourse).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }).toUpperCase()}
                  </Text>
                  {gp.estTermine ? (
                    <Text style={styles.gpTermineText}>✓ Terminé</Text>
                  ) : (
                    <Text style={styles.gpOuvertText}>Ouvert</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 2, borderBottomColor: '#e10600',
    backgroundColor: '#0a0a0a',
  },
  logoBadge: { backgroundColor: '#e10600', paddingHorizontal: 12, paddingVertical: 4 },
  logoText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  logoutText: { color: '#555', fontSize: 12, letterSpacing: 2 },
  hero: { backgroundColor: '#0f0f0f', padding: 24, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  heroBadge: { backgroundColor: '#e10600', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, marginBottom: 16 },
  heroBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 3 },
  heroTitle: { fontSize: 40, fontWeight: '900', color: '#fff', lineHeight: 44, letterSpacing: -1, marginBottom: 12 },
  heroTitleRed: { color: '#e10600' },
  heroSub: { color: '#888', fontSize: 14, lineHeight: 20, marginBottom: 24 },
  progressContainer: { marginTop: 8 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { color: '#555', fontSize: 10, letterSpacing: 2 },
  progressValue: { color: '#e10600', fontSize: 10, fontWeight: '700' },
  progressBar: { height: 4, backgroundColor: '#1a1a1a', borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: '#e10600', borderRadius: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  statCard: { width: '50%', padding: 20, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#1a1a1a', backgroundColor: '#0f0f0f' },
  statValue: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  statLabel: { fontSize: 10, color: '#555', letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 },
  section: { padding: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  sectionLine: { width: 3, height: 20, backgroundColor: '#e10600' },
  sectionTitle: { color: '#888', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase' },
  prochainCard: { backgroundColor: '#1a0000', borderWidth: 1, borderColor: '#2a0000', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  prochainPays: { color: '#e10600', fontSize: 12, letterSpacing: 2, marginBottom: 4 },
  prochainNom: { color: '#fff', fontSize: 16, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4 },
  prochainCircuit: { color: '#888', fontSize: 12 },
  prochainRight: { alignItems: 'flex-end' },
  prochainDate: { color: '#e10600', fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  parierBtn: { backgroundColor: '#e10600', paddingHorizontal: 16, paddingVertical: 8, marginTop: 8 },
  parierBtnText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  gpRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#0f0f0f', padding: 16, marginBottom: 2, borderLeftWidth: 3, borderLeftColor: '#1a1a1a' },
  gpRowTermine: { opacity: 0.4 },
  gpRound: { color: '#333', fontSize: 20, fontWeight: '900', minWidth: 28 },
  gpDrapeau: { fontSize: 24, minWidth: 32 },
  gpInfo: { flex: 1 },
  gpNom: { color: '#fff', fontSize: 14, fontWeight: '700', textTransform: 'uppercase' },
  gpCircuit: { color: '#555', fontSize: 11, marginTop: 2 },
  gpRight: { alignItems: 'flex-end' },
  gpDate: { color: '#fff', fontSize: 13, fontWeight: '700' },
  gpTermineText: { color: '#333', fontSize: 10, letterSpacing: 1, marginTop: 2 },
  gpOuvertText: { color: '#e10600', fontSize: 10, fontWeight: '700', letterSpacing: 1, marginTop: 2 },
});