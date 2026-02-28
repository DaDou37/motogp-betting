import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Parier = () => {
  const [grandsPrix, setGrandsPrix] = useState<any[]>([]);
  const [pilotes, setPilotes] = useState<any[]>([]);
  const [selectedGP, setSelectedGP] = useState<any>(null);
  const [podium, setPodium] = useState<[any, any, any]>([null, null, null]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Récupérer le GP depuis l'URL si passé en paramètre
    const params = new URLSearchParams(window.location.search);
    const gpId = params.get('gp');

    Promise.all([
      fetch('http://localhost:5000/api/grandsprix').then(r => r.json()),
      fetch('http://localhost:5000/api/pilotes').then(r => r.json()),
    ]).then(([gps, pilots]) => {
      const gpDisponibles = gps.filter((gp: any) => !gp.estTermine);
      setGrandsPrix(gpDisponibles);
      setPilotes(pilots);
      if (gpId) {
        const gp = gps.find((g: any) => g.id === parseInt(gpId));
        if (gp) setSelectedGP(gp);
      } else if (gpDisponibles.length > 0) {
        setSelectedGP(gpDisponibles[0]);
      }
      setLoading(false);
    });
  }, []);

  const drapeaux: { [key: string]: string } = {
    'Thaïlande': '🇹🇭', 'Brésil': '🇧🇷', 'USA': '🇺🇸', 'Qatar': '🇶🇦',
    'Espagne': '🇪🇸', 'France': '🇫🇷', 'Italie': '🇮🇹', 'Hongrie': '🇭🇺',
    'Tchéquie': '🇨🇿', 'Pays-Bas': '🇳🇱', 'Allemagne': '🇩🇪', 'Royaume-Uni': '🇬🇧',
    'Autriche': '🇦🇹', 'Japon': '🇯🇵', 'Indonésie': '🇮🇩', 'Australie': '🇦🇺',
    'Malaisie': '🇲🇾', 'Portugal': '🇵🇹',
  };

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

  const handlePiloteClick = (pilote: any) => {
    // Si déjà dans le podium, on le retire
    const pos = podium.findIndex(p => p?.id === pilote.id);
    if (pos !== -1) {
      const newPodium: [any, any, any] = [...podium] as [any, any, any];
      newPodium[pos] = null;
      setPodium(newPodium);
      return;
    }

    // Sinon on l'ajoute à la première place libre
    const emptyPos = podium.findIndex(p => p === null);
    if (emptyPos === -1) return; // Podium plein
    const newPodium: [any, any, any] = [...podium] as [any, any, any];
    newPodium[emptyPos] = pilote;
    setPodium(newPodium);
  };

  const removePiloteFromPodium = (position: number) => {
    const newPodium: [any, any, any] = [...podium] as [any, any, any];
    newPodium[position] = null;
    setPodium(newPodium);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) { window.location.href = '/auth'; return; }
    if (!podium[0] || !podium[1] || !podium[2]) {
      setMessage({ text: 'Choisissez 3 pilotes pour compléter le podium !', type: 'error' });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/paris', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          utilisateurId: user?.utilisateurId,
          grandPrixId: selectedGP.id,
          piloteP1Id: podium[0].id,
          piloteP2Id: podium[1].id,
          piloteP3Id: podium[2].id,
        }),
      });
if (!res.ok) {
  const erreur = await res.text();
  throw new Error(erreur);
}
      setMessage({ text: '🎉 Pari enregistré avec succès !', type: 'success' });
      setPodium([null, null, null]);
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    }
    setSubmitting(false);
  };

  const podiumInPilotes = podium.map(p => p?.id);
  const pilotesDispo = pilotes.filter(p => !podiumInPilotes.includes(p.id));

  const podiumLabels = ['🥇 1ER', '🥈 2ÈME', '🥉 3ÈME'];
  const podiumColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  const podiumHeights = ['120px', '100px', '80px'];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      fontFamily: "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif",
      color: '#ffffff',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }

        .pilote-card:hover { border-color: #e10600 !important; transform: translateY(-2px); }
        .pilote-card { transition: all 0.2s ease; cursor: pointer; }
        .pilote-selected { border-color: #555 !important; opacity: 0.4; }
        .podium-slot:hover .remove-btn { opacity: 1 !important; }
        .nav-link:hover { color: #e10600 !important; }
        .submit-btn:hover { background: #c00500 !important; }
        .submit-btn { transition: background 0.2s; }
        .gp-selector:hover { border-color: #e10600 !important; }
        .gp-selector { transition: border-color 0.2s; cursor: pointer; }
        .gp-selector-active { border-color: #e10600 !important; background: rgba(225,6,0,0.1) !important; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '2px solid #e10600',
        padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            background: '#e10600', color: '#fff',
            fontWeight: 900, fontSize: '22px',
            letterSpacing: '2px', padding: '4px 12px',
            clipPath: 'polygon(0 0, 95% 0, 100% 100%, 5% 100%)',
          }}>MOTOGP</div>
          <span style={{ color: '#888', fontSize: '13px', letterSpacing: '4px', textTransform: 'uppercase' }}>BETTING</span>
        </a>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {[['Accueil', '/'], ['Pilotes', '/pilotes'], ['Grands Prix', '/grandsprix'], ['Parier', '/parier'], ['Classement', '/classement']].map(([label, href]) => (
            <a key={label} href={href} className="nav-link" style={{
              color: label === 'Parier' ? '#fff' : '#aaa',
              textDecoration: 'none', fontSize: '13px',
              letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600,
            }}>{label}</a>
          ))}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: '#e10600', fontSize: '13px', fontWeight: 700, letterSpacing: '2px' }}>🏁 {user?.pseudo}</span>
              <button onClick={logout} style={{
                background: 'transparent', color: '#888',
                border: '1px solid #333', padding: '8px 20px',
                fontSize: '12px', letterSpacing: '2px',
                textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
              }}>Déconnexion</button>
            </div>
          ) : (
            <button onClick={() => window.location.href = '/auth'} style={{
              background: '#e10600', color: '#fff',
              border: 'none', padding: '8px 20px',
              fontSize: '12px', letterSpacing: '2px',
              textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
              clipPath: 'polygon(0 0, 92% 0, 100% 100%, 8% 100%)',
            }}>Connexion</button>
          )}
        </div>
      </nav>

      {loading ? (
        <div style={{ padding: '80px', textAlign: 'center', color: '#555', letterSpacing: '3px' }}>Chargement...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', minHeight: 'calc(100vh - 64px)' }}>

          {/* SIDEBAR - Sélection GP */}
          <div style={{ borderRight: '1px solid #1a1a1a', background: '#0d0d0d', padding: '24px', overflowY: 'auto' }}>
            <div style={{ fontSize: '10px', color: '#555', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
              Choisir un Grand Prix
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {grandsPrix.map((gp: any, i: number) => (
                <div key={gp.id} className={`gp-selector ${selectedGP?.id === gp.id ? 'gp-selector-active' : ''}`}
                  onClick={() => { setSelectedGP(gp); setPodium([null, null, null]); setMessage(null); }}
                  style={{
                    background: selectedGP?.id === gp.id ? 'rgba(225,6,0,0.1)' : '#0f0f0f',
                    border: `1px solid ${selectedGP?.id === gp.id ? '#e10600' : '#1a1a1a'}`,
                    padding: '12px 16px',
                  }}>
                  <div style={{ fontSize: '10px', color: '#e10600', letterSpacing: '2px', marginBottom: '2px' }}>
                    Round {i + 1} · {drapeaux[gp.pays] || '🏁'} {gp.pays}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.2 }}>
                    {gp.nom.replace(/Grand Prix of |Grand Prix du |Grand Prix de /i, '')}
                  </div>
                  <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>
                    {new Date(gp.dateCourse).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN - Podium + Pilotes */}
          <div style={{ padding: '32px 40px', overflowY: 'auto' }}>

            {/* GP Sélectionné */}
            {selectedGP && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '11px', color: '#e10600', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {drapeaux[selectedGP.pays] || '🏁'} Grand Prix sélectionné
                </div>
                <h2 style={{
                  fontSize: '36px', fontWeight: 900,
                  textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: '-0.5px',
                }}>{selectedGP.nom}</h2>
                <div style={{ color: '#555', fontSize: '13px', marginTop: '4px', fontFamily: "'Barlow', sans-serif" }}>
                  📍 {selectedGP.circuit} · {new Date(selectedGP.dateCourse).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            )}

            {/* PODIUM VISUEL */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '10px', color: '#555', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>
                Votre podium — Cliquez sur les pilotes pour les assigner
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '260px' }}>
                {/* P2 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <PodiumSlot
                    pilote={podium[1]}
                    label={podiumLabels[1]}
                    color={podiumColors[1]}
                    height={podiumHeights[1]}
                    onRemove={() => removePiloteFromPodium(1)}
                    couleurEquipe={couleurEquipe}
                  />
                </div>
                {/* P1 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <PodiumSlot
                    pilote={podium[0]}
                    label={podiumLabels[0]}
                    color={podiumColors[0]}
                    height={podiumHeights[0]}
                    onRemove={() => removePiloteFromPodium(0)}
                    couleurEquipe={couleurEquipe}
                  />
                </div>
                {/* P3 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <PodiumSlot
                    pilote={podium[2]}
                    label={podiumLabels[2]}
                    color={podiumColors[2]}
                    height={podiumHeights[2]}
                    onRemove={() => removePiloteFromPodium(2)}
                    couleurEquipe={couleurEquipe}
                  />
                </div>
              </div>
            </div>

            {/* MESSAGE */}
            {message && (
              <div style={{
                padding: '14px 20px', marginBottom: '24px',
                background: message.type === 'error' ? 'rgba(225,6,0,0.1)' : 'rgba(0,200,100,0.1)',
                border: `1px solid ${message.type === 'error' ? '#e10600' : '#00c864'}`,
                color: message.type === 'error' ? '#e10600' : '#00c864',
                fontSize: '14px', fontFamily: "'Barlow', sans-serif",
              }}>{message.text}</div>
            )}

            {/* BOUTON VALIDER */}
            <button className="submit-btn" onClick={handleSubmit} disabled={submitting} style={{
              width: '100%', background: '#e10600', color: '#fff',
              border: 'none', padding: '18px',
              fontSize: '14px', letterSpacing: '3px',
              textTransform: 'uppercase', fontWeight: 800,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
              fontFamily: "'Barlow Condensed', sans-serif",
              clipPath: 'polygon(0 0, 98% 0, 100% 100%, 2% 100%)',
              marginBottom: '40px',
            }}>
              {submitting ? 'Envoi en cours...' : '🏁 Valider mon pari'}
            </button>

            {/* GRILLE PILOTES */}
            <div style={{ fontSize: '10px', color: '#555', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
              {pilotesDispo.length} pilotes disponibles — Cliquez pour ajouter au podium
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '8px',
            }}>
              {pilotes.map((pilote: any) => {
                const inPodium = podium.some(p => p?.id === pilote.id);
                const teamColor = couleurEquipe[pilote.equipe] || '#e10600';
                return (
                  <div
                    key={pilote.id}
                    className={`pilote-card ${inPodium ? 'pilote-selected' : ''}`}
                    onClick={() => handlePiloteClick(pilote)}
                    style={{
                      background: '#0f0f0f',
                      border: `1px solid ${inPodium ? '#333' : '#1a1a1a'}`,
                      borderLeft: `3px solid ${teamColor}`,
                      padding: '12px',
                      position: 'relative',
                      opacity: inPodium ? 0.4 : 1,
                    }}
                  >
                    <div style={{ fontSize: '18px', fontWeight: 900, color: teamColor, fontFamily: "'Barlow Condensed', sans-serif" }}>
                      #{pilote.numero}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1.1 }}>
                      <span style={{ fontSize: '11px', color: '#888', fontWeight: 400, display: 'block' }}>{pilote.prenom}</span>
                      {pilote.nom}
                    </div>
                    <div style={{ fontSize: '9px', color: '#444', marginTop: '6px', letterSpacing: '1px' }}>
                      {pilote.equipe.split(' ').slice(0, 2).join(' ')}
                    </div>
                    {inPodium && (
                      <div style={{
                        position: 'absolute', top: '8px', right: '8px',
                        fontSize: '16px',
                      }}>✓</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant PodiumSlot
const PodiumSlot = ({ pilote, label, color, height, onRemove, couleurEquipe }: any) => {
  return (
    <div className="podium-slot" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Zone pilote */}
      <div style={{
        width: '100%', minHeight: '120px',
        background: pilote ? '#141414' : '#0d0d0d',
        border: `2px dashed ${pilote ? color : '#2a2a2a'}`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '12px', marginBottom: '4px',
        position: 'relative', transition: 'all 0.2s',
      }}>
        {pilote ? (
          <>
            <div style={{ fontSize: '20px', fontWeight: 900, color: color, fontFamily: "'Barlow Condensed', sans-serif" }}>
              #{pilote.numero}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center', fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1.1 }}>
              <span style={{ fontSize: '11px', color: '#888', fontWeight: 400, display: 'block' }}>{pilote.prenom}</span>
              {pilote.nom}
            </div>
            <button className="remove-btn" onClick={onRemove} style={{
              position: 'absolute', top: '6px', right: '6px',
              background: 'rgba(225,6,0,0.2)', border: 'none',
              color: '#e10600', width: '20px', height: '20px',
              fontSize: '12px', cursor: 'pointer',
              opacity: 0, transition: 'opacity 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          </>
        ) : (
          <div style={{ fontSize: '11px', color: '#333', letterSpacing: '2px', textTransform: 'uppercase', textAlign: 'center' }}>
            {label.split(' ')[1]}<br />vide
          </div>
        )}
      </div>

      {/* Marche podium */}
      <div style={{
        width: '100%', height: height,
        background: `linear-gradient(180deg, ${color}22 0%, ${color}11 100%)`,
        border: `1px solid ${color}44`,
        borderTop: `3px solid ${color}`,
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'center', paddingTop: '10px',
      }}>
        <span style={{ fontSize: '14px', fontWeight: 900, color: color, letterSpacing: '1px' }}>{label}</span>
      </div>
    </div>
  );
};

export default Parier;