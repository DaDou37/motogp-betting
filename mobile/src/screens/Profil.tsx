import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Platform, StatusBar, ActivityIndicator,
  TouchableOpacity, Image
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const PODIUM_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
const PODIUM_LABELS = ['P1', 'P2', 'P3'];

export default function ProfilScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [classement, setClassement] = useState<any[]>([]);
  const [paris, setParis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch(`${API_URL}/utilisateurs/classement`).then(r => r.json()),
      fetch(`${API_URL}/paris/utilisateur/${user.utilisateurId}`).then(r => r.json()),
    ]).then(([classementData, parisData]) => {
      setClassement(classementData);
      setParis(parisData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const monRang = classement.findIndex(u => u.pseudo === user?.pseudo) + 1;
  const monScore = classement.find(u => u.pseudo === user?.pseudo);
  const pointsTotal = monScore?.points ?? 0;
  const parisValides = paris.filter(p => p.estValide);

  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.pseudo}&backgroundColor=e10600&radius=50`;

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
          <Text style={styles.logoText}>PROFIL</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#e10600" size="large" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* HEADER PROFIL */}
          <View style={styles.profilHeader}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              {monRang > 0 && monRang <= 3 && (
                <Text style={styles.rankEmoji}>
                  {monRang === 1 ? '🥇' : monRang === 2 ? '🥈' : '🥉'}
                </Text>
              )}
            </View>
            <View style={styles.profilInfo}>
              <Text style={styles.profilLabel}>PROFIL JOUEUR</Text>
              <Text style={styles.profilPseudo}>{user?.pseudo?.toUpperCase()}</Text>
              <Text style={styles.profilSaison}>Saison MotoGP 2026</Text>
            </View>
          </View>

          {/* STATS */}
          <View style={styles.statsGrid}>
            {[
              { label: 'Classement', value: monRang > 0 ? `P${monRang}` : '-', color: '#e10600' },
              { label: 'Points', value: `${pointsTotal}`, color: '#fff' },
              { label: 'Paris', value: `${paris.length}`, color: '#fff' },
              { label: 'Validés', value: `${parisValides.length}`, color: '#00c864' },
            ].map((stat, i) => (
              <View key={i} style={styles.statCard}>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* HISTORIQUE PARIS */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>HISTORIQUE ({paris.length})</Text>
            </View>

            {paris.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🏁</Text>
                <Text style={styles.emptyText}>Aucun pari pour l'instant</Text>
                <TouchableOpacity
                  style={styles.parierBtn}
                  onPress={() => navigation.navigate('Parier')}
                >
                  <Text style={styles.parierBtnText}>PARIER MAINTENANT</Text>
                </TouchableOpacity>
              </View>
            ) : (
              paris.map((pari: any) => (
                <View key={pari.id} style={[
                  styles.pariCard,
                  { borderLeftColor: pari.estValide ? '#00c864' : '#e10600' }
                ]}>
                  {/* GP */}
                  <View style={styles.pariGP}>
                    <Text style={styles.pariDrapeau}>
                      {drapeaux[pari.grandPrix?.pays] || '🏁'}
                    </Text>
                    <View>
                      <Text style={styles.pariGPNom}>
                        {pari.grandPrix?.nom?.replace(/Grand Prix of |Grand Prix du |Grand Prix de /i, '') || 'GP'}
                      </Text>
                      <Text style={styles.pariGPDate}>
                        {pari.grandPrix?.dateCourse
                          ? new Date(pari.grandPrix.dateCourse).toLocaleDateString('fr-FR')
                          : ''}
                      </Text>
                    </View>
                  </View>

                  {/* Pronostic */}
                  <View style={styles.pariPodium}>
                    {[
                      { pos: 'P1', pilote: pari.piloteP1, color: PODIUM_COLORS[0] },
                      { pos: 'P2', pilote: pari.piloteP2, color: PODIUM_COLORS[1] },
                      { pos: 'P3', pilote: pari.piloteP3, color: PODIUM_COLORS[2] },
                    ].map(({ pos, pilote, color }) => (
                      <View key={pos} style={[styles.pariPilote, { borderColor: color + '44' }]}>
                        <Text style={[styles.pariPos, { color }]}>{pos}</Text>
                        <Text style={styles.pariNom}>{pilote?.nom || '?'}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Points */}
                  <View style={styles.pariPoints}>
                    {pari.estValide ? (
                      <>
                        <Text style={styles.pariPointsValue}>+{pari.pointsGagnes}</Text>
                        <Text style={styles.pariPointsLabel}>pts</Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.pariAttente}>EN{'\n'}ATTENTE</Text>
                        <TouchableOpacity
                          style={styles.modifierBtn}
                          onPress={() => navigation.navigate('ModifierPari', { pari })}
                        >
                          <Text style={styles.modifierBtnText}>MODIFIER</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0a0a0a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // HEADER
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 2, borderBottomColor: '#e10600',
  },
  logoBadge: { backgroundColor: '#e10600', paddingHorizontal: 12, paddingVertical: 4 },
  logoText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  logoutBtn: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#333' },
  logoutText: { color: '#555', fontSize: 11, letterSpacing: 1 },

  // PROFIL HEADER
  profilHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 20,
    backgroundColor: '#0f0f0f', padding: 24,
    borderBottomWidth: 1, borderBottomColor: '#1a1a1a',
    borderTopWidth: 3, borderTopColor: '#e10600',
  },
  avatarContainer: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#e10600' },
  rankEmoji: { position: 'absolute', bottom: -4, right: -4, fontSize: 20 },
  profilInfo: { flex: 1 },
  profilLabel: { color: '#555', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' },
  profilPseudo: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -1, marginTop: 4 },
  profilSaison: { color: '#555', fontSize: 12, marginTop: 2 },

  // STATS
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    borderBottomWidth: 1, borderBottomColor: '#1a1a1a',
  },
  statCard: {
    width: '50%', padding: 16,
    borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#1a1a1a',
    backgroundColor: '#0f0f0f', alignItems: 'center',
  },
  statValue: { fontSize: 28, fontWeight: '900' },
  statLabel: { color: '#555', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 },

  // SECTION
  section: { padding: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  sectionLine: { width: 3, height: 20, backgroundColor: '#e10600' },
  sectionTitle: { color: '#888', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase' },

  // EMPTY STATE
  emptyState: { alignItems: 'center', padding: 40, backgroundColor: '#0f0f0f', borderWidth: 1, borderColor: '#1a1a1a' },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyText: { color: '#555', fontSize: 14, letterSpacing: 1, marginBottom: 20 },
  parierBtn: { backgroundColor: '#e10600', paddingHorizontal: 24, paddingVertical: 12 },
  parierBtnText: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 2 },

  // PARI CARD
  pariCard: {
    backgroundColor: '#0f0f0f',
    borderWidth: 1, borderColor: '#1a1a1a',
    borderLeftWidth: 3,
    padding: 14, marginBottom: 8,
  },
  pariGP: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  pariDrapeau: { fontSize: 24 },
  pariGPNom: { color: '#fff', fontSize: 14, fontWeight: '800', textTransform: 'uppercase' },
  pariGPDate: { color: '#555', fontSize: 11, marginTop: 2 },
  pariPodium: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  pariPilote: {
    flex: 1, backgroundColor: '#0a0a0a',
    borderWidth: 1, padding: 8, alignItems: 'center',
  },
  pariPos: { fontSize: 10, fontWeight: '700', marginBottom: 2 },
  pariNom: { color: '#fff', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' },
  pariPoints: { alignItems: 'flex-end' },
  pariPointsValue: { color: '#00c864', fontSize: 28, fontWeight: '900', lineHeight: 30 },
  pariPointsLabel: { color: '#555', fontSize: 10, letterSpacing: 2 },
  pariAttente: { color: '#e10600', fontSize: 10, fontWeight: '700', letterSpacing: 1, textAlign: 'right' },
  modifierBtn: { backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333', paddingHorizontal: 10, paddingVertical: 6, marginTop: 6 },
  modifierBtnText: { color: '#888', fontSize: 9, fontWeight: '700', letterSpacing: 1 },
});