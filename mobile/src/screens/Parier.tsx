import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar, Alert, ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const couleurEquipe: { [key: string]: string } = {
  'Ducati Lenovo Team': '#e10600',
  'Aprilia Racing': '#00a651',
  'Monster Energy Yamaha MotoGP': '#4444ff',
  'Red Bull KTM Factory Racing': '#ff6600',
  'Red Bull KTM Tech3': '#ff6600',
  'Prima Pramac Yamaha MotoGP': '#4444ff',
  'BK8 Gresini Racing MotoGP': '#e10600',
  'Pertamina Enduro VR46 Racing Team': '#ffdd00',
  'Honda HRC Castrol': '#cc0000',
  'LCR Honda': '#cc0000',
  'Trackhouse MotoGP Team': '#00aaff',
};

const PODIUM_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
const PODIUM_LABELS = ['P1', 'P2', 'P3'];

export default function ParierScreen() {
  const { user } = useAuth();
  const [grandsPrix, setGrandsPrix] = useState<any[]>([]);
  const [pilotes, setPilotes] = useState<any[]>([]);
  const [selectedGP, setSelectedGP] = useState<any>(null);
  const [podium, setPodium] = useState<[any, any, any]>([null, null, null]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [etape, setEtape] = useState<'gp' | 'pilotes'>('gp');

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/grandsprix`).then(r => r.json()),
      fetch(`${API_URL}/pilotes`).then(r => r.json()),
    ]).then(([gps, pils]) => {
      setGrandsPrix(gps.filter((gp: any) => !gp.estTermine));
      setPilotes(pils);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const drapeaux: { [key: string]: string } = {
    'Thaïlande': '🇹🇭', 'Brésil': '🇧🇷', 'USA': '🇺🇸', 'Qatar': '🇶🇦',
    'Espagne': '🇪🇸', 'France': '🇫🇷', 'Italie': '🇮🇹', 'Hongrie': '🇭🇺',
    'Tchéquie': '🇨🇿', 'Pays-Bas': '🇳🇱', 'Allemagne': '🇩🇪', 'Royaume-Uni': '🇬🇧',
    'Autriche': '🇦🇹', 'Japon': '🇯🇵', 'Indonésie': '🇮🇩', 'Australie': '🇦🇺',
    'Malaisie': '🇲🇾', 'Portugal': '🇵🇹',
  };

  const pilotesEnPodium = podium.filter(Boolean).map((p: any) => p?.id);

  const ajouterAuPodium = (pilote: any) => {
    if (pilotesEnPodium.includes(pilote.id)) {
      setPodium(prev => prev.map(p => p?.id === pilote.id ? null : p) as [any, any, any]);
      return;
    }
    const idx = podium.findIndex(p => p === null);
    if (idx === -1) return;
    const nouveau = [...podium] as [any, any, any];
    nouveau[idx] = pilote;
    setPodium(nouveau);
  };

  const soumettre = async () => {
    if (podium.some(p => p === null)) {
      Alert.alert('Erreur', 'Sélectionnez les 3 pilotes du podium');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/paris`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          utilisateurId: user?.utilisateurId,
          grandPrixId: selectedGP.id,
          piloteP1Id: podium[0].id,
          piloteP2Id: podium[1].id,
          piloteP3Id: podium[2].id,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      Alert.alert('✅ Pari enregistré !', `Votre pronostic pour ${selectedGP.nom} a été soumis.`, [
        { text: 'OK', onPress: () => { setSelectedGP(null); setPodium([null, null, null]); setEtape('gp'); } }
      ]);
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Erreur lors du pari');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#e10600" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>PARIER</Text>
        </View>
        {etape === 'pilotes' && (
          <TouchableOpacity onPress={() => setEtape('gp')} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Changer de GP</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ETAPE 1 : Choisir GP */}
      {etape === 'gp' && (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.liste}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLine} />
            <Text style={styles.sectionTitle}>CHOISIR UN GRAND PRIX</Text>
          </View>
          {grandsPrix.map((gp: any) => (
            <TouchableOpacity
              key={gp.id}
              style={styles.gpCard}
              onPress={() => { setSelectedGP(gp); setPodium([null, null, null]); setEtape('pilotes'); }}
            >
              <Text style={styles.gpDrapeau}>{drapeaux[gp.pays] || '🏁'}</Text>
              <View style={styles.gpInfo}>
                <Text style={styles.gpPays}>{gp.pays}</Text>
                <Text style={styles.gpNom}>{gp.nom.replace(/Grand Prix of |Grand Prix du |Grand Prix de /i, '')}</Text>
                <Text style={styles.gpDate}>
                  {new Date(gp.dateCourse).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })}
                </Text>
              </View>
              <Text style={styles.gpArrow}>→</Text>
            </TouchableOpacity>
          ))}
          <View style={{ height: 20 }} />
        </ScrollView>
      )}

      {/* ETAPE 2 : Choisir pilotes */}
      {etape === 'pilotes' && selectedGP && (
        <View style={styles.flex}>
          {/* GP sélectionné */}
          <View style={styles.gpSelected}>
            <Text style={styles.gpSelectedEmoji}>{drapeaux[selectedGP.pays] || '🏁'}</Text>
            <View>
              <Text style={styles.gpSelectedNom}>{selectedGP.nom.replace(/Grand Prix of |Grand Prix du |Grand Prix de /i, '')}</Text>
              <Text style={styles.gpSelectedDate}>
                {new Date(selectedGP.dateCourse).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })}
              </Text>
            </View>
          </View>

          {/* PODIUM */}
          <View style={styles.podium}>
            {[0, 1, 2].map(pos => (
              <TouchableOpacity
                key={pos}
                style={[styles.podiumSlot, { borderColor: podium[pos] ? PODIUM_COLORS[pos] : '#2a2a2a' }]}
                onPress={() => podium[pos] && setPodium(prev => { const n = [...prev] as [any,any,any]; n[pos] = null; return n; })}
              >
                <Text style={[styles.podiumPos, { color: PODIUM_COLORS[pos] }]}>{PODIUM_LABELS[pos]}</Text>
                {podium[pos] ? (
                  <Text style={styles.podiumPilote}>{podium[pos].nom}</Text>
                ) : (
                  <Text style={styles.podiumVide}>?</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* LISTE PILOTES */}
          <ScrollView showsVerticalScrollIndicator={false} style={styles.pilotesList}>
            {pilotes.map((pilote: any) => {
              const enPodium = pilotesEnPodium.includes(pilote.id);
              const position = podium.findIndex(p => p?.id === pilote.id);
              const teamColor = couleurEquipe[pilote.equipe] || '#e10600';

              return (
                <TouchableOpacity
                  key={pilote.id}
                  style={[
                    styles.piloteRow,
                    { borderLeftColor: teamColor },
                    enPodium && { backgroundColor: '#1a0000' },
                    pilotesEnPodium.length >= 3 && !enPodium && { opacity: 0.3 },
                  ]}
                  onPress={() => ajouterAuPodium(pilote)}
                >
                  <Text style={[styles.piloteNumero, { color: teamColor }]}>#{pilote.numero}</Text>
                  <View style={styles.flex}>
                    <Text style={styles.piloteNom}>{pilote.prenom} {pilote.nom.toUpperCase()}</Text>
                    <Text style={[styles.piloteEquipe, { color: teamColor }]}>{pilote.equipe}</Text>
                  </View>
                  {enPodium && (
                    <View style={[styles.positionBadge, { backgroundColor: PODIUM_COLORS[position] }]}>
                      <Text style={styles.positionBadgeText}>{PODIUM_LABELS[position]}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
            <View style={{ height: 20 }} />
          </ScrollView>

          {/* BOUTON SOUMETTRE */}
          {podium.every(p => p !== null) && (
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={soumettre}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>✅ VALIDER MON PARI</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0a0a0a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  flex: { flex: 1 },
  loadingContainer: { flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center' },

  // HEADER
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 2, borderBottomColor: '#e10600',
  },
  logoBadge: { backgroundColor: '#e10600', paddingHorizontal: 12, paddingVertical: 4 },
  logoText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  backBtn: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#333' },
  backBtnText: { color: '#888', fontSize: 11, letterSpacing: 1 },

  // LISTE GP
  liste: { flex: 1, padding: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  sectionLine: { width: 3, height: 20, backgroundColor: '#e10600' },
  sectionTitle: { color: '#888', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase' },
  gpCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: '#0f0f0f', borderWidth: 1, borderColor: '#1a1a1a',
    borderLeftWidth: 3, borderLeftColor: '#e10600',
    padding: 16, marginBottom: 8,
  },
  gpDrapeau: { fontSize: 32 },
  gpInfo: { flex: 1 },
  gpPays: { color: '#e10600', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' },
  gpNom: { color: '#fff', fontSize: 16, fontWeight: '800', textTransform: 'uppercase' },
  gpDate: { color: '#555', fontSize: 11, marginTop: 4 },
  gpArrow: { color: '#e10600', fontSize: 20, fontWeight: '900' },

  // GP SELECTED
  gpSelected: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#1a0000', borderBottomWidth: 1, borderBottomColor: '#2a0000',
    padding: 12,
  },
  gpSelectedEmoji: { fontSize: 28 },
  gpSelectedNom: { color: '#fff', fontSize: 16, fontWeight: '800', textTransform: 'uppercase' },
  gpSelectedDate: { color: '#888', fontSize: 11, marginTop: 2 },

  // PODIUM
  podium: {
    flexDirection: 'row', gap: 8, padding: 12,
    borderBottomWidth: 1, borderBottomColor: '#1a1a1a',
  },
  podiumSlot: {
    flex: 1, backgroundColor: '#0f0f0f',
    borderWidth: 2, padding: 10, alignItems: 'center',
  },
  podiumPos: { fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  podiumPilote: { color: '#fff', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginTop: 4, textAlign: 'center' },
  podiumVide: { color: '#333', fontSize: 20, fontWeight: '900', marginTop: 4 },

  // PILOTES LIST
  pilotesList: { flex: 1, padding: 12 },
  piloteRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#0f0f0f', borderLeftWidth: 3,
    padding: 12, marginBottom: 6,
  },
  piloteNumero: { fontSize: 16, fontWeight: '900', minWidth: 36 },
  piloteNom: { color: '#fff', fontSize: 14, fontWeight: '700', textTransform: 'uppercase' },
  piloteEquipe: { fontSize: 10, marginTop: 2 },
  positionBadge: { paddingHorizontal: 8, paddingVertical: 4 },
  positionBadgeText: { color: '#000', fontSize: 11, fontWeight: '900' },

  // SUBMIT
  submitBtn: {
    backgroundColor: '#e10600', padding: 18, margin: 12, alignItems: 'center',
  },
  submitBtnText: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 3 },
});