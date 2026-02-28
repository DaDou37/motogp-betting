import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const GrandsPrix = () => {
  const [grandsPrix, setGrandsPrix] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatut, setFilterStatut] = useState<'tous' | 'avenir' | 'termines'>('tous');
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    fetch('http://localhost:5000/api/grandsprix')
      .then(res => res.json())
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

  const gpFiltres = grandsPrix.filter(gp => {
    if (filterStatut === 'avenir') return !gp.estTermine;
    if (filterStatut === 'termines') return gp.estTermine;
    return true;
  });

  const prochainGP = grandsPrix.find(gp => !gp.estTermine);
  const joursAvant = prochainGP
    ? Math.ceil((new Date(prochainGP.dateCourse).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

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

        @keyframes fadeUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        .gp-row:hover { background: #141414 !important; border-left-color: #e10600 !important; }
        .gp-row { transition: all 0.2s ease; }
        .nav-link:hover { color: #e10600 !important; }
        .filter-btn:hover { border-color: #e10600 !important; color: #fff !important; }
        .parier-btn:hover { background: #c00500 !important; }
        .parier-btn { transition: background 0.2s; }
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
              color: label === 'Grands Prix' ? '#fff' : '#aaa',
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

      {/* HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)',
        padding: '50px 40px 40px',
        borderBottom: '1px solid #1a1a1a',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '-20px', top: '-20px',
          fontSize: '250px', fontWeight: 900,
          color: 'rgba(225,6,0,0.04)',
          fontFamily: "'Barlow Condensed', sans-serif",
          lineHeight: 1, userSelect: 'none',
        }}>GP</div>

        <div style={{
          display: 'inline-block', background: '#e10600', color: '#fff',
          fontSize: '11px', letterSpacing: '4px', padding: '4px 16px',
          marginBottom: '16px', textTransform: 'uppercase', fontWeight: 700,
        }}>🏁 Calendrier 2026</div>

        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900,
          textTransform: 'uppercase', letterSpacing: '-1px',
          lineHeight: 0.9, fontFamily: "'Barlow Condensed', sans-serif",
        }}>
          <span style={{ display: 'block', color: '#fff' }}>Grands Prix</span>
          <span style={{ display: 'block', color: '#e10600' }}>2026</span>
        </h1>

        {/* Countdown prochain GP */}
        {prochainGP && joursAvant !== null && (
          <div style={{
            marginTop: '24px',
            display: 'inline-flex', alignItems: 'center', gap: '16px',
            background: '#0f0f0f', border: '1px solid #2a0000',
            padding: '16px 24px',
          }}>
            <div>
              <div style={{ fontSize: '10px', color: '#555', letterSpacing: '3px', textTransform: 'uppercase' }}>Prochain GP dans</div>
              <div style={{ fontSize: '36px', fontWeight: 900, color: '#e10600', fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>
                {joursAvant} <span style={{ fontSize: '16px', color: '#888' }}>jours</span>
              </div>
            </div>
            <div style={{ width: '1px', height: '40px', background: '#2a2a2a' }} />
            <div>
              <div style={{ fontSize: '10px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
                {drapeaux[prochainGP.pays] || '🏁'} {prochainGP.pays}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" }}>
                {prochainGP.nom.replace(/Grand Prix of |Grand Prix du |Grand Prix de /i, '')}
              </div>
              <div style={{ fontSize: '12px', color: '#555' }}>
                {new Date(prochainGP.dateCourse).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FILTRES */}
      <div style={{ padding: '20px 40px', borderBottom: '1px solid #1a1a1a', background: '#0d0d0d', display: 'flex', gap: '12px' }}>
        {[
          { label: 'Tous les GP', value: 'tous' },
          { label: 'À venir', value: 'avenir' },
          { label: 'Terminés', value: 'termines' },
        ].map(f => (
          <button key={f.value} className="filter-btn" onClick={() => setFilterStatut(f.value as any)} style={{
            background: 'transparent',
            border: `1px solid ${filterStatut === f.value ? '#e10600' : '#2a2a2a'}`,
            color: filterStatut === f.value ? '#e10600' : '#555',
            padding: '8px 20px', fontSize: '11px',
            letterSpacing: '2px', textTransform: 'uppercase',
            cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, transition: 'all 0.2s',
          }}>{f.label}</button>
        ))}
        <span style={{ marginLeft: 'auto', color: '#333', fontSize: '12px', alignSelf: 'center', letterSpacing: '2px' }}>
          {gpFiltres.length} Grand{gpFiltres.length > 1 ? 's' : ''} Prix
        </span>
      </div>

      {/* LISTE GP */}
      <div style={{ padding: '24px 40px' }}>
        {loading ? (
          <div style={{ color: '#555', letterSpacing: '3px', fontSize: '12px', textTransform: 'uppercase' }}>
            Chargement...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {gpFiltres.map((gp: any, index: number) => {
              const isProchain = prochainGP?.id === gp.id;
              const dateGP = new Date(gp.dateCourse);
              const roundNumber = grandsPrix.findIndex(g => g.id === gp.id) + 1;

              return (
                <div key={gp.id} className="gp-row" style={{
                  background: isProchain ? '#130000' : '#0f0f0f',
                  borderLeft: `3px solid ${isProchain ? '#e10600' : gp.estTermine ? '#1a1a1a' : '#2a2a2a'}`,
                  padding: '20px 24px',
                  display: 'flex', alignItems: 'center',
                  gap: '24px', opacity: gp.estTermine ? 0.5 : 1,
                  animation: `fadeUp 0.4s ease ${index * 0.03}s both`,
                }}>
                  {/* Round */}
                  <div style={{ minWidth: '60px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase' }}>Round</div>
                    <div style={{
                      fontSize: '32px', fontWeight: 900, color: isProchain ? '#e10600' : '#333',
                      fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1,
                    }}>{String(roundNumber).padStart(2, '0')}</div>
                  </div>

                  <div style={{ width: '1px', height: '50px', background: '#1a1a1a' }} />

                  {/* Drapeau + Pays */}
                  <div style={{ minWidth: '160px' }}>
                    <div style={{ fontSize: '28px', marginBottom: '2px' }}>{drapeaux[gp.pays] || '🏁'}</div>
                    <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase' }}>{gp.pays}</div>
                  </div>

                  {/* Nom + Circuit */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '20px', fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                      fontFamily: "'Barlow Condensed', sans-serif",
                      color: isProchain ? '#fff' : '#ccc',
                    }}>{gp.nom}</div>
                    <div style={{ fontSize: '12px', color: '#555', marginTop: '4px', fontFamily: "'Barlow', sans-serif" }}>
                      📍 {gp.circuit}
                    </div>
                  </div>

                  {/* Date */}
                  <div style={{ textAlign: 'right', minWidth: '140px' }}>
                    <div style={{
                      fontSize: '24px', fontWeight: 900, color: isProchain ? '#e10600' : '#fff',
                      fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '-0.5px',
                    }}>
                      {dateGP.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }).toUpperCase()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#555' }}>{dateGP.getFullYear()}</div>
                  </div>

                  {/* Statut / Bouton */}
                  <div style={{ minWidth: '140px', textAlign: 'right' }}>
                    {gp.estTermine ? (
                      <span style={{ fontSize: '10px', color: '#333', letterSpacing: '2px', textTransform: 'uppercase' }}>✓ Terminé</span>
                    ) : isAuthenticated ? (
                      <button className="parier-btn" onClick={() => window.location.href = `/parier?gp=${gp.id}`} style={{
                        background: isProchain ? '#e10600' : 'transparent',
                        color: isProchain ? '#fff' : '#e10600',
                        border: '1px solid #e10600',
                        padding: '8px 20px', fontSize: '11px',
                        letterSpacing: '2px', textTransform: 'uppercase',
                        fontWeight: 700, cursor: 'pointer',
                        fontFamily: "'Barlow Condensed', sans-serif",
                        clipPath: 'polygon(0 0, 93% 0, 100% 100%, 7% 100%)',
                      }}>Parier →</button>
                    ) : (
                      <span style={{
                        fontSize: '10px', color: '#e10600',
                        letterSpacing: '2px', textTransform: 'uppercase',
                      }}>Paris ouverts</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrandsPrix;