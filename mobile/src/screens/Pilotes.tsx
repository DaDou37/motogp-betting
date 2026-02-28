import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Image, Platform, StatusBar
} from 'react-native';
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

export default function PilotesScreen() {
  const [pilotes, setPilotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [equipeFiltre, setEquipeFiltre] = useState('Tous');

  useEffect(() => {
    fetch(`${API_URL}/pilotes`)
      .then(r => r.json())
      .then(data => { setPilotes(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const equipes = ['Tous', ...pilotes
    .map(p => p.equipe)
    .filter((e, i, self) => self.indexOf(e) === i)
  ];

  const pilotesFiltres = pilotes.filter(p => {
    const matchSearch = `${p.prenom} ${p.nom}`.toLowerCase().includes(search.toLowerCase());
    const matchEquipe = equipeFiltre === 'Tous' || p.equipe === equipeFiltre;
    return matchSearch && matchEquipe;
  });

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>PILOTES</Text>
        </View>
        <Text style={styles.headerSub}>SAISON 2026</Text>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un pilote..."
          placeholderTextColor="#444"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* FILTRES EQUIPES */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtresScroll}>
        {equipes.map(equipe => (
          <TouchableOpacity
            key={equipe}
            style={[styles.filtreBtn, equipeFiltre === equipe && styles.filtreBtnActive]}
            onPress={() => setEquipeFiltre(equipe)}
          >
            <Text style={[styles.filtreBtnText, equipeFiltre === equipe && styles.filtreBtnTextActive]}>
              {equipe === 'Tous' ? 'Tous' : equipe.split(' ').slice(-1)[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LISTE PILOTES */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.liste}>
        {loading ? (
          <Text style={styles.loadingText}>Chargement...</Text>
        ) : (
          pilotesFiltres.map((pilote: any) => {
            const teamColor = couleurEquipe[pilote.equipe] || '#e10600';
            return (
              <View key={pilote.id} style={[styles.piloteCard, { borderLeftColor: teamColor }]}>
                {/* Photo ou initiales */}
                <View style={[styles.avatar, { borderColor: teamColor }]}>
                  {pilote.photoUrl ? (
                    <Image source={{ uri: pilote.photoUrl }} style={styles.avatarImg} />
                  ) : (
                    <Text style={[styles.avatarInitiales, { color: teamColor }]}>
                      {pilote.prenom[0]}{pilote.nom[0]}
                    </Text>
                  )}
                </View>

                {/* Infos */}
                <View style={styles.piloteInfo}>
                  <Text style={styles.pilotePrenom}>{pilote.prenom}</Text>
                  <Text style={styles.piloteNom}>{pilote.nom.toUpperCase()}</Text>
                  <Text style={[styles.piloteEquipe, { color: teamColor }]}>{pilote.equipe}</Text>
                </View>

                {/* Numéro */}
                <View style={styles.piloteNumeroContainer}>
                  <Text style={[styles.piloteNumero, { color: teamColor }]}>#{pilote.numero}</Text>
                  <Text style={styles.piloteNationalite}>{pilote.nationalite}</Text>
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 20 }} />
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

  // HEADER
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: 2, borderBottomColor: '#e10600',
    backgroundColor: '#0a0a0a',
  },
  logoBadge: { backgroundColor: '#e10600', paddingHorizontal: 12, paddingVertical: 4 },
  logoText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  headerSub: { color: '#555', fontSize: 12, letterSpacing: 3 },

  // SEARCH
  searchContainer: { padding: 16, paddingBottom: 8 },
  searchInput: {
    backgroundColor: '#0f0f0f',
    borderWidth: 1, borderColor: '#2a2a2a',
    borderBottomWidth: 2, borderBottomColor: '#e10600',
    color: '#fff', padding: 12, fontSize: 14,
  },

  // FILTRES
  filtresScroll: { paddingHorizontal: 16, paddingBottom: 8, maxHeight: 48 },
  filtreBtn: {
    paddingHorizontal: 16, paddingVertical: 8, marginRight: 8,
    borderWidth: 1, borderColor: '#2a2a2a', backgroundColor: '#0f0f0f',
  },
  filtreBtnActive: { borderColor: '#e10600', backgroundColor: '#1a0000' },
  filtreBtnText: { color: '#555', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  filtreBtnTextActive: { color: '#e10600' },

  // LISTE
  liste: { flex: 1, padding: 16 },
  loadingText: { color: '#555', textAlign: 'center', marginTop: 40, letterSpacing: 2 },

  // CARD PILOTE
  piloteCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#0f0f0f',
    borderLeftWidth: 3,
    padding: 16, marginBottom: 8,
    gap: 16,
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 2, overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarInitiales: { fontSize: 18, fontWeight: '900' },
  piloteInfo: { flex: 1 },
  pilotePrenom: { color: '#888', fontSize: 12 },
  piloteNom: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  piloteEquipe: { fontSize: 11, marginTop: 2 },
  piloteNumeroContainer: { alignItems: 'flex-end' },
  piloteNumero: { fontSize: 24, fontWeight: '900', letterSpacing: -1 },
  piloteNationalite: { color: '#555', fontSize: 10, marginTop: 2, letterSpacing: 1 },
});