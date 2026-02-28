import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Accueil = () => {
  const [grandsPrix, setGrandsPrix] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    fetch('http://localhost:5000/api/grandsprix')
      .then(res => res.json())
      .then(data => {
        setGrandsPrix(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      fontFamily: "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif",
      color: '#ffffff',
      overflowX: 'hidden',
    }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes slideIn {
          from { transform: translateX(-60px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes scanline {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        @keyframes rpm {
          0% { width: 0%; }
          100% { width: 85%; }
        }

        .gp-card:hover {
          transform: translateY(-4px) scale(1.01);
          border-color: #e10600 !important;
          box-shadow: 0 8px 30px rgba(225, 6, 0, 0.25) !important;
        }
        .gp-card { transition: all 0.25s ease; }

        .nav-link:hover { color: #e10600 !important; }
        .cta-btn:hover { background: #c00500 !important; transform: scale(1.03); }
        .cta-btn { transition: all 0.2s ease; }

        .stat-card:hover { border-color: #e10600 !important; }
        .stat-card { transition: border-color 0.2s ease; }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#e10600',
            color: '#fff',
            fontWeight: 900,
            fontSize: '22px',
            letterSpacing: '2px',
            padding: '4px 12px',
            clipPath: 'polygon(0 0, 95% 0, 100% 100%, 5% 100%)',
            fontFamily: "'Barlow Condensed', sans-serif",
          }}>MOTOGP</div>
          <span style={{ color: '#888', fontSize: '13px', letterSpacing: '4px', textTransform: 'uppercase' }}>Parier</span>
        </div>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {[['Accueil', '/'], ['Pilotes', '/pilotes'], ['Grands Prix', '/grandsprix'], ['Parier', '/parier'], ['Classement', '/classement']].map(([label, href]) => (
            <a key={label} href={href} className="nav-link" style={{
              color: '#aaa', textDecoration: 'none',
              fontSize: '13px', letterSpacing: '2px',
              textTransform: 'uppercase', fontWeight: 600,
            }}>{label}</a>
          ))}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <a href="/profil" style={{ color: '#e10600', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textDecoration: 'none' }}>
                🏁 {user?.pseudo}
              </a>
              <button className="cta-btn" onClick={logout} style={{
                background: 'transparent', color: '#888',
                border: '1px solid #333', padding: '8px 20px',
                fontSize: '12px', letterSpacing: '2px',
                textTransform: 'uppercase', fontWeight: 700,
                cursor: 'pointer',
              }}>Déconnexion</button>
            </div>
          ) : (
            <button className="cta-btn" onClick={() => window.location.href = '/auth'} style={{
              background: '#e10600', color: '#fff',
              border: 'none', padding: '8px 20px',
              fontSize: '12px', letterSpacing: '2px',
              textTransform: 'uppercase', fontWeight: 700,
              cursor: 'pointer',
              clipPath: 'polygon(0 0, 92% 0, 100% 100%, 8% 100%)',
            }}>Connexion</button>
          )}
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)',
        padding: '80px 40px 60px',
        overflow: 'hidden',
      }}>
        {/* Decorative lines */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(225,6,0,0.03) 80px, rgba(225,6,0,0.03) 81px)',
          pointerEvents: 'none',
        }} />

        {/* Big number background */}
        <div style={{
          position: 'absolute', right: '-20px', top: '-20px',
          fontSize: '300px', fontWeight: 900, color: 'rgba(225,6,0,0.04)',
          fontFamily: "'Barlow Condensed', sans-serif",
          lineHeight: 1, userSelect: 'none',
          letterSpacing: '-10px',
        }}>2026</div>

        {/* Scanline effect */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '900px' }}>
          <div style={{
            display: 'inline-block',
            background: '#e10600',
            color: '#fff',
            fontSize: '11px',
            letterSpacing: '4px',
            padding: '4px 16px',
            marginBottom: '24px',
            textTransform: 'uppercase',
            fontWeight: 700,
            animation: 'fadeUp 0.6s ease forwards',
          }}>
            🏁 Saison 2026 — {grandsPrix.length} Grands Prix
          </div>

          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: '-2px',
            textTransform: 'uppercase',
            animation: 'slideIn 0.8s ease forwards',
            fontFamily: "'Barlow Condensed', sans-serif",
          }}>
            <span style={{ display: 'block', color: '#fff' }}>PARIEZ SUR</span>
            <span style={{ display: 'block', color: '#e10600' }}>LE PODIUM</span>
            <span style={{ display: 'block', color: '#888', fontSize: '60%' }}>DE CHAQUE GRAND PRIX</span>
          </h1>

          <p style={{
            marginTop: '24px',
            color: '#aaa',
            fontSize: '16px',
            maxWidth: '500px',
            lineHeight: 1.6,
            fontFamily: "'Barlow', sans-serif",
            animation: 'fadeUp 1s ease 0.3s both',
          }}>
            Choisissez les 3 premiers pilotes de chaque Grand Prix MotoGP 2026 et accumulez des points. Prouvez que vous connaissez la compétition.
          </p>

          <div style={{
            marginTop: '36px', display: 'flex', gap: '16px',
            animation: 'fadeUp 1s ease 0.5s both',
          }}>
            <button className="cta-btn" onClick={() => window.location.href = '/parier'} style={{
              background: '#e10600', color: '#fff',
              border: 'none', padding: '14px 36px',
              fontSize: '14px', letterSpacing: '3px',
              textTransform: 'uppercase', fontWeight: 800,
              cursor: 'pointer',
              clipPath: 'polygon(0 0, 95% 0, 100% 100%, 5% 100%)',
            }}>Commencer à parier</button>

            <button onClick={() => window.location.href = '/classement'} style={{
              background: 'transparent', color: '#fff',
              border: '1px solid #333', padding: '14px 36px',
              fontSize: '14px', letterSpacing: '3px',
              textTransform: 'uppercase', fontWeight: 700,
              cursor: 'pointer',
            }}>Voir le classement</button>
          </div>
        </div>

        {/* RPM Bar */}
        <div style={{ marginTop: '60px', maxWidth: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '10px', letterSpacing: '3px', color: '#555', textTransform: 'uppercase' }}>Saison progress</span>
            <span style={{ fontSize: '10px', color: '#e10600', fontWeight: 700 }}>{gpTermines}/{grandsPrix.length} GP</span>
          </div>
          <div style={{ height: '4px', background: '#1a1a1a', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: grandsPrix.length > 0 ? `${(gpTermines / grandsPrix.length) * 100}%` : '0%',
              background: 'linear-gradient(90deg, #e10600, #ff4444)',
              transition: 'width 1s ease',
              boxShadow: '0 0 10px #e10600',
            }} />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1px', background: '#1a1a1a',
        borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a',
      }}>
        {[
          { label: 'Grands Prix', value: grandsPrix.length, suffix: '' },
          { label: 'Pilotes', value: 22, suffix: '' },
          { label: 'GP restants', value: gpRestants, suffix: '' },
          { label: 'Points max', value: 627, suffix: 'pts' },
        ].map((stat, i) => (
          <div key={i} className="stat-card" style={{
            background: '#0f0f0f',
            padding: '28px 32px',
            borderLeft: i === 0 ? '3px solid #e10600' : '3px solid transparent',
          }}>
            <div style={{
              fontSize: '40px', fontWeight: 900,
              color: '#fff', letterSpacing: '-1px',
              fontFamily: "'Barlow Condensed', sans-serif",
            }}>
              {stat.value}<span style={{ fontSize: '18px', color: '#e10600', marginLeft: '4px' }}>{stat.suffix}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '3px', textTransform: 'uppercase', marginTop: '4px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* PROCHAIN GP */}
      {prochainGP && (
        <div style={{ padding: '60px 40px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ width: '3px', height: '24px', background: '#e10600' }} />
            <span style={{ fontSize: '11px', letterSpacing: '4px', color: '#888', textTransform: 'uppercase' }}>Prochain Grand Prix</span>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1a0000 0%, #0f0f0f 100%)',
            border: '1px solid #2a0000',
            padding: '40px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: '200px', height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(225,6,0,0.05))',
            }} />

            <div>
              <div style={{ fontSize: '11px', color: '#e10600', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
                {drapeaux[prochainGP.pays] || '🏁'} {prochainGP.pays}
              </div>
              <h2 style={{
                fontSize: '36px', fontWeight: 900, textTransform: 'uppercase',
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: '-0.5px',
              }}>{prochainGP.nom}</h2>
              <div style={{ color: '#888', marginTop: '8px', fontFamily: "'Barlow', sans-serif", fontSize: '14px' }}>
                📍 {prochainGP.circuit}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#555', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>Date de course</div>
              <div style={{
                fontSize: '48px', fontWeight: 900, color: '#e10600',
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: '-2px',
              }}>
                {new Date(prochainGP.dateCourse).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }).toUpperCase()}
              </div>
              <div style={{ color: '#555', fontSize: '13px' }}>
                {new Date(prochainGP.dateCourse).getFullYear()}
              </div>
              <button className="cta-btn" onClick={() => window.location.href = `/parier?gp=${prochainGP.id}`} style={{
                marginTop: '16px', background: '#e10600', color: '#fff',
                border: 'none', padding: '10px 24px',
                fontSize: '12px', letterSpacing: '2px',
                textTransform: 'uppercase', fontWeight: 700,
                cursor: 'pointer',
                clipPath: 'polygon(0 0, 93% 0, 100% 100%, 7% 100%)',
              }}>Parier maintenant</button>
            </div>
          </div>
        </div>
      )}

      {/* CALENDRIER */}
      <div style={{ padding: '60px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ width: '3px', height: '24px', background: '#e10600' }} />
          <span style={{ fontSize: '11px', letterSpacing: '4px', color: '#888', textTransform: 'uppercase' }}>Calendrier 2026</span>
        </div>

        {loading ? (
          <div style={{ color: '#555', letterSpacing: '3px', fontSize: '12px', textTransform: 'uppercase' }}>
            <span style={{ animation: 'pulse 1s infinite' }}>■</span> Chargement...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {grandsPrix.map((gp: any, index: number) => (
              <div key={gp.id} className="gp-card" style={{
                background: '#0f0f0f',
                border: `1px solid ${gp.estTermine ? '#1a1a1a' : '#222'}`,
                padding: '20px 24px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                opacity: gp.estTermine ? 0.5 : 1,
              }}>
                {/* Round number */}
                <div style={{
                  position: 'absolute', top: '12px', right: '16px',
                  fontSize: '40px', fontWeight: 900,
                  color: 'rgba(255,255,255,0.04)',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  lineHeight: 1,
                }}>{String(index + 1).padStart(2, '0')}</div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{drapeaux[gp.pays] || '🏁'}</div>
                    <div style={{ fontSize: '10px', color: '#e10600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Round {index + 1} — {gp.pays}
                    </div>
                    <div style={{
                      fontSize: '16px', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                      fontFamily: "'Barlow Condensed', sans-serif",
                      lineHeight: 1.2,
                    }}>{gp.nom.replace(/Grand Prix of |Grand Prix du |Grand Prix de /i, '')}</div>
                    <div style={{ fontSize: '12px', color: '#555', marginTop: '6px', fontFamily: "'Barlow', sans-serif" }}>
                      {gp.circuit}
                    </div>
                  </div>
                </div>

                <div style={{
                  marginTop: '16px', paddingTop: '12px',
                  borderTop: '1px solid #1a1a1a',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: '13px', color: '#fff', fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '1px' }}>
                    {new Date(gp.dateCourse).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                  </span>
                  {gp.estTermine ? (
                    <span style={{ fontSize: '10px', color: '#333', letterSpacing: '2px', textTransform: 'uppercase' }}>Terminé</span>
                  ) : (
                    <span style={{
                      fontSize: '10px', color: '#e10600',
                      letterSpacing: '2px', textTransform: 'uppercase',
                      fontWeight: 700,
                    }}>Paris ouverts →</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{
        borderTop: '1px solid #1a1a1a',
        padding: '24px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: '#e10600', color: '#fff',
            fontWeight: 900, fontSize: '14px',
            letterSpacing: '1px', padding: '2px 8px',
            clipPath: 'polygon(0 0, 93% 0, 100% 100%, 7% 100%)',
          }}>MOTOGP</div>
          <span style={{ color: '#333', fontSize: '12px' }}>BETTING © 2026</span>
        </div>
        <div style={{ fontSize: '11px', color: '#333', letterSpacing: '2px' }}>
          {currentTime.toLocaleTimeString('fr-FR')}
        </div>
      </div>
    </div>
  );
};

export default Accueil;