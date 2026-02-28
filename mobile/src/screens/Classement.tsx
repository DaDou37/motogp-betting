import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Platform, StatusBar, ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';



export default function ClassementScreen() {
  const { user } = useAuth();
  const [classement, setClassement] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/utilisateurs/classement`)
      .then(r => r.json())
      .then(data => { setClassement(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const podiumColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  const podiumEmojis = ['🥇', '🥈', '🥉'];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>CLASSEMENT</Text>
        </View>
        <Text style={styles.headerSub}>SAISON 2026</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#e10600" size="large" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* TOP 3 PODIUM */}
          {classement.length >= 3 && (
            <View style={styles.podiumSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionLine} />
                <Text style={styles.sectionTitle}>TOP 3</Text>
              </View>

              <View style={styles.podiumRow}>
                {/* P2 */}
                <View style={[styles.podiumCard, styles.podiumP2]}>
                  <Text style={styles.podiumEmoji}>{podiumEmojis[1]}</Text>
                  <Text style={styles.podiumPseudo}>{classement[1]?.pseudo}</Text>
                  <Text style={[styles.podiumPoints, { color: podiumColors[1] }]}>
                    {classement[1]?.points} pts
                  </Text>
                  <Text style={styles.podiumParis}>{classement[1]?.nombreParis} paris</Text>
                </View>

                {/* P1 */}
                <View style={[styles.podiumCard, styles.podiumP1]}>
                  <Text style={styles.podiumEmoji}>{podiumEmojis[0]}</Text>
                  <Text style={styles.podiumPseudo}>{classement[0]?.pseudo}</Text>
                  <Text style={[styles.podiumPoints, { color: podiumColors[0] }]}>
                    {classement[0]?.points} pts
                  </Text>
                  <Text style={styles.podiumParis}>{classement[0]?.nombreParis} paris</Text>
                </View>

                {/* P3 */}
                <View style={[styles.podiumCard, styles.podiumP3]}>
                  <Text style={styles.podiumEmoji}>{podiumEmojis[2]}</Text>
                  <Text style={styles.podiumPseudo}>{classement[2]?.pseudo}</Text>
                  <Text style={[styles.podiumPoints, { color: podiumColors[2] }]}>
                    {classement[2]?.points} pts
                  </Text>
                  <Text style={styles.podiumParis}>{classement[2]?.nombreParis} paris</Text>
                </View>
              </View>
            </View>
          )}

          {/* TABLEAU COMPLET */}
          <View style={styles.tableSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>CLASSEMENT GÉNÉRAL</Text>
            </View>

            {/* Entête tableau */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { width: 40 }]}>#</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>JOUEUR</Text>
              <Text style={[styles.tableHeaderText, { width: 50, textAlign: 'center' }]}>PARIS</Text>
              <Text style={[styles.tableHeaderText, { width: 70, textAlign: 'right' }]}>POINTS</Text>
            </View>

            {classement.map((joueur: any, index: number) => {
              const isMe = joueur.pseudo === user?.pseudo;
              const rankColor = index === 0 ? podiumColors[0] : index === 1 ? podiumColors[1] : index === 2 ? podiumColors[2] : '#555';

              return (
                <View key={joueur.id} style={[styles.tableRow, isMe && styles.tableRowMe]}>
                  <Text style={[styles.tableRank, { color: rankColor, width: 40 }]}>
                    {index < 3 ? podiumEmojis[index] : `${index + 1}`}
                  </Text>
                  <View style={styles.tablePlayer}>
                    <View style={[styles.playerAvatar, { backgroundColor: isMe ? '#e10600' : '#1a1a1a' }]}>
                      <Text style={styles.playerAvatarText}>
                        {joueur.pseudo[0].toUpperCase()}
                      </Text>
                    </View>
                    <Text style={[styles.tablePseudo, isMe && { color: '#e10600' }]}>
                      {joueur.pseudo} {isMe && '(toi)'}
                    </Text>
                  </View>
                  <Text style={[styles.tableParis, { width: 50, textAlign: 'center' }]}>
                    {joueur.nombreParis}
                  </Text>
                  <Text style={[styles.tablePoints, { width: 70 }]}>
                    {joueur.points} pts
                  </Text>
                </View>
              );
            })}
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
  headerSub: { color: '#555', fontSize: 12, letterSpacing: 3 },

  // SECTION
  podiumSection: { padding: 16 },
  tableSection: { padding: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  sectionLine: { width: 3, height: 20, backgroundColor: '#e10600' },
  sectionTitle: { color: '#888', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase' },

  // PODIUM
  podiumRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  podiumCard: {
    flex: 1, backgroundColor: '#0f0f0f',
    borderWidth: 1, borderColor: '#1a1a1a',
    padding: 12, alignItems: 'center',
  },
  podiumP1: { borderTopColor: '#FFD700', borderTopWidth: 3, paddingTop: 20 },
  podiumP2: { borderTopColor: '#C0C0C0', borderTopWidth: 3 },
  podiumP3: { borderTopColor: '#CD7F32', borderTopWidth: 3 },
  podiumEmoji: { fontSize: 28, marginBottom: 8 },
  podiumPseudo: { color: '#fff', fontSize: 13, fontWeight: '800', textTransform: 'uppercase', textAlign: 'center' },
  podiumPoints: { fontSize: 20, fontWeight: '900', marginTop: 4 },
  podiumParis: { color: '#555', fontSize: 10, letterSpacing: 1, marginTop: 2 },

  // TABLE
  tableHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: '#1a1a1a',
    marginBottom: 4,
  },
  tableHeaderText: { color: '#555', fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  tableRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#0f0f0f',
    paddingHorizontal: 16, paddingVertical: 12,
    marginBottom: 4,
    borderLeftWidth: 3, borderLeftColor: 'transparent',
  },
  tableRowMe: { borderLeftColor: '#e10600', backgroundColor: '#1a0000' },
  tableRank: { fontSize: 16, fontWeight: '900' },
  tablePlayer: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  playerAvatar: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  playerAvatarText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  tablePseudo: { color: '#fff', fontSize: 14, fontWeight: '700' },
  tableParis: { color: '#888', fontSize: 13 },
  tablePoints: { color: '#e10600', fontSize: 14, fontWeight: '900', textAlign: 'right' },
});