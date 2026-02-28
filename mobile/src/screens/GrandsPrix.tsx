import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

export default function GrandsPrixScreen({ navigation }: any) {
  const { isAuthenticated } = useAuth();
  const [grandsPrix, setGrandsPrix] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState<'tous' | 'upcoming' | 'termines'>('tous');

  useEffect(() => {
    fetch(`${API_URL}/grandsprix`)
      .then(r => r.json())
      .then(data => { setGrandsPrix(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const drapeaux: { [key: string]: string } = {
    'Thaïlande': '🇹🇭', 'Brésil': '🇧🇷', 'USA': '🇺🇸', 'Qatar': '🇶🇦',
    'Espagne': '🇪🇸', 'France': '🇫🇷', 'Italie': '🇮🇹', 'Hongrie': '🇭🇺',
    'Tchéquie': '🇨🇿', 'Pays-Bas': '🇳🇱', 'Allemagne': '🇩🇪', 'Royaume-Uni': '🇬🇧',
    'Autriche': '🇦🇹', 'Japon': '🇯🇵', 'Indonésie': '🇮🇩', 'Australie': '🇦🇺',
    'Malaisie': '🇲🇾', 'Portugal': '🇵🇹',
  };

  const prochainGP = grandsPrix.find(gp => !gp.estTermine);
  const getCountdown = () => {
    if (!prochainGP) return null;
    const diff = new Date(prochainGP.dateCourse).getTime() - new Date().getTime();
    if (diff <= 0) return null;
    const jours = Math.floor(diff / (1000 * 60 * 60 * 24));
    return jours;
  };
  const countdown = getCountdown();

  const gpFiltres = grandsPrix.filter(gp => {
    if (filtre === 'upcoming') return !gp.estTermine;
    if (filtre === 'termines') return gp.estTermine;
    return true;
  });

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>GRANDS PRIX</Text>
        </View>
        {countdown !== null && (
          <View style={styles.countdown}>
            <Text style={styles.countdownValue}>{countdown}j</Text>
            <Text style={styles.countdownLabel}>prochain GP</Text>
          </View>
        )}
      </View>

      {/* FILTRES */}
      <View style={styles.filtres}>
        {[
          { key: 'tous', label: 'Tous' },
          { key: 'upcoming', label: 'À venir' },
          { key: 'termines', label: 'Terminés' },
        ].map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filtreBtn, filtre === f.key && styles.filtreBtnActive]}
            onPress={() => setFiltre(f.key as any)}
          >
            <Text style={[styles.filtreBtnText, filtre === f.key && styles.filtreBtnTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LISTE GP */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.liste}>
        {loading ? (
          <Text style={styles.loadingText}>Chargement...</Text>
        ) : (
          gpFiltres.map((gp: any, index: number) => (
            <View
              key={gp.id}
              style={[styles.gpCard, gp.estTermine && styles.gpCardTermine]}
            >
              {/* Round + Drapeau */}
              <View style={styles.gpLeft}>
                <Text style={styles.gpRound}>{String(index + 1).padStart(2, '0')}</Text>
                <Text style={styles.gpDrapeau}>{drapeaux[gp.pays] || '🏁'}</Text>
              </View>

              {/* Infos GP */}
              <View style={styles.gpInfo}>
                <Text style={styles.gpPays}>{gp.pays}</Text>
                <Text style={styles.gpNom}>
                  {gp.nom.replace(/Grand Prix of |Grand Prix du |Grand Prix de /i, '')}
                </Text>
                <Text style={styles.gpCircuit}>{gp.circuit}</Text>
                <Text style={styles.gpDate}>
                  {new Date(gp.dateCourse).toLocaleDateString('fr-FR', {
                    day: '2-digit', month: 'long', year: 'numeric'
                  })}
                </Text>
              </View>

              {/* Status + Bouton */}
              <View style={styles.gpRight}>
                {gp.estTermine ? (
                  <View style={styles.statusTermine}>
                    <Text style={styles.statusTermineText}>✓</Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.statusOuvert}>
                      <Text style={styles.statusOuvertText}>OUVERT</Text>
                    </View>
                    {isAuthenticated && (
                      <TouchableOpacity
                        style={styles.parierBtn}
                        onPress={() => navigation.navigate('Parier')}
                      >
                        <Text style={styles.parierBtnText}>PARIER</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            </View>
          ))
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0a0a0a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  // HEADER
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 2, borderBottomColor: '#e10600',
  },
  logoBadge: { backgroundColor: '#e10600', paddingHorizontal: 12, paddingVertical: 4 },
  logoText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  countdown: { alignItems: 'flex-end' },
  countdownValue: { color: '#e10600', fontSize: 24, fontWeight: '900', lineHeight: 26 },
  countdownLabel: { color: '#555', fontSize: 10, letterSpacing: 2 },

  // FILTRES
  filtres: {
    flexDirection: 'row', padding: 16, gap: 8,
    borderBottomWidth: 1, borderBottomColor: '#1a1a1a',
  },
  filtreBtn: {
    flex: 1, paddingVertical: 8, alignItems: 'center',
    borderWidth: 1, borderColor: '#2a2a2a', backgroundColor: '#0f0f0f',
  },
  filtreBtnActive: { borderColor: '#e10600', backgroundColor: '#1a0000' },
  filtreBtnText: { color: '#555', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  filtreBtnTextActive: { color: '#e10600' },

  // LISTE
  liste: { flex: 1, padding: 16 },
  loadingText: { color: '#555', textAlign: 'center', marginTop: 40, letterSpacing: 2 },

  // GP CARD
  gpCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#0f0f0f',
    borderWidth: 1, borderColor: '#1a1a1a',
    borderLeftWidth: 3, borderLeftColor: '#e10600',
    padding: 16, marginBottom: 8, gap: 12,
  },
  gpCardTermine: { opacity: 0.5, borderLeftColor: '#333' },
  gpLeft: { alignItems: 'center', minWidth: 40 },
  gpRound: { color: '#333', fontSize: 18, fontWeight: '900' },
  gpDrapeau: { fontSize: 28, marginTop: 4 },
  gpInfo: { flex: 1 },
  gpPays: { color: '#e10600', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 },
  gpNom: { color: '#fff', fontSize: 15, fontWeight: '800', textTransform: 'uppercase', lineHeight: 18 },
  gpCircuit: { color: '#555', fontSize: 11, marginTop: 4 },
  gpDate: { color: '#888', fontSize: 11, marginTop: 2 },
  gpRight: { alignItems: 'flex-end', gap: 8 },
  statusTermine: { backgroundColor: '#1a2a1a', borderWidth: 1, borderColor: '#00c864', padding: 6 },
  statusTermineText: { color: '#00c864', fontSize: 14, fontWeight: '900' },
  statusOuvert: { backgroundColor: '#1a0000', borderWidth: 1, borderColor: '#e10600', paddingHorizontal: 8, paddingVertical: 4 },
  statusOuvertText: { color: '#e10600', fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  parierBtn: { backgroundColor: '#e10600', paddingHorizontal: 12, paddingVertical: 6 },
  parierBtnText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
});