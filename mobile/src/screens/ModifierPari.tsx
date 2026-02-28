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

export default function ModifierPariScreen({ route, navigation }: any) {
  const { pari } = route.params;
  const { user } = useAuth();
  const [pilotes, setPilotes] = useState<any[]>([]);
  const [podium, setPodium] = useState<[any, any, any]>([
    pari.piloteP1, pari.piloteP2, pari.piloteP3
  ]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/pilotes`)
      .then(r => r.json())
      .then(data => { setPilotes(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

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
      const res = await fetch(`${API_URL}/paris/${pari.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          utilisateurId: user?.utilisateurId,
          grandPrixId: pari.grandPrixId,
          piloteP1Id: podium[0].id,
          piloteP2Id: podium[1].id,
          piloteP3Id: podium[2].id,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      Alert.alert('✅ Pari modifié !', 'Votre pronostic a été mis à jour.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Erreur lors de la modification');
    }
    setSubmitting(false);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Retour</Text>
        </TouchableOpacity>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>MODIFIER</Text>
        </View>
      </View>

      {/* GP Info */}
      <View style={styles.gpInfo}>
        <Text style={styles.gpNom}>
          {pari.grandPrix?.nom?.replace(/Grand Prix of |Grand Prix du |Grand Prix de /i, '') || 'GP'}
        </Text>
        <Text style={styles.gpDate}>
          {pari.grandPrix?.dateCourse
            ? new Date(pari.grandPrix.dateCourse).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })
            : ''}
        </Text>
      </View>

      {/* PODIUM */}
      <View style={styles.podium}>
        {[0, 1, 2].map(pos => (
          <TouchableOpacity
            key={pos}
            style={[styles.podiumSlot, { borderColor: podium[pos] ? PODIUM_COLORS[pos] : '#2a2a2a' }]}
            onPress={() => podium[pos] && setPodium(prev => { const n = [...prev] as [any, any, any]; n[pos] = null; return n; })}
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
      {loading ? (
        <ActivityIndicator color="#e10600" size="large" style={{ marginTop: 40 }} />
      ) : (
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
                <View style={{ flex: 1 }}>
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
      )}

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
            <Text style={styles.submitBtnText}>✅ SAUVEGARDER LES MODIFICATIONS</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0a0a0a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 2, borderBottomColor: '#e10600',
  },
  logoBadge: { backgroundColor: '#e10600', paddingHorizontal: 12, paddingVertical: 4 },
  logoText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  backBtn: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#333' },
  backBtnText: { color: '#888', fontSize: 11, letterSpacing: 1 },
  gpInfo: {
    backgroundColor: '#1a0000', borderBottomWidth: 1, borderBottomColor: '#2a0000',
    padding: 16,
  },
  gpNom: { color: '#fff', fontSize: 18, fontWeight: '800', textTransform: 'uppercase' },
  gpDate: { color: '#888', fontSize: 12, marginTop: 4 },
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
  submitBtn: {
    backgroundColor: '#e10600', padding: 18, margin: 12, alignItems: 'center',
  },
  submitBtnText: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 2 },
});