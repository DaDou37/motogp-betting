import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Classement = () => {
  const [classement, setClassement] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    fetch('http://localhost:5000/api/utilisateurs/classement')
      .then(res => res.json())
      .then(data => { setClassement(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const podiumColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  const podiumEmoji = ['🥇', '🥈', '🥉'];

  const top3 = classement.slice(0, 3);
  const reste = classement.slice(3);

  const monRang = classement.findIndex(u => u.pseudo === user?.pseudo) + 1;

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      fontFamily: "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif",
      color: '#ffffff',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes glow { 0%,100%{box-shadow:0 0 10px rgba(255,215,0,0.3)} 50%{box-shadow:0 0 30px rgba(255,215,0,0.6)} }
        .nav-link:hover { color: #e10600 !important; }
        .row:hover { background: #141414 !important; }
        .row { transition: background 0.2s; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(10px)',
        borderBottom: '2px solid #e10600', padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            background: '#e10600', color: '#fff', fontWeight: 900, fontSize: '22px',
            letterSpacing: '2px', padding: '4px 12px',
            clipPath: 'polygon(0 0, 95% 0, 100% 100%, 5% 100%)',
          }}>MOTOGP</div>
          <span style={{ color: '#888', fontSize: '13px', letterSpacing: '4px', textTransform: 'uppercase' }}>BETTING</span>
        </a>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {[['Accueil', '/'], ['Pilotes', '/pilotes'], ['Grands Prix', '/grandsprix'], ['Parier', '/parier'], ['Classement', '/classement']].map(([label, href]) => (
            <a key={label} href={href} className="nav-link" style={{
              color: label === 'Classement' ? '#fff' : '#aaa',
              textDecoration: 'none', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600,
            }}>{label}</a>
          ))}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: '#e10600', fontSize: '13px', fontWeight: 700, letterSpacing: '2px' }}>🏁 {user?.pseudo}</span>
              <button onClick={logout} style={{
                background: 'transparent', color: '#888', border: '1px solid #333',
                padding: '8px 20px', fontSize: '12px', letterSpacing: '2px',
                textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
              }}>Déconnexion</button>
            </div>
          ) : (
            <button onClick={() => window.location.href = '/auth'} style={{
              background: '#e10600', color: '#fff', border: 'none', padding: '8px 20px',
              fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700,
              cursor: 'pointer', clipPath: 'polygon(0 0, 92% 0, 100% 100%, 8% 100%)',
            }}>Connexion</button>
          )}
        </div>
      </nav>

      {/* HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)',
        padding: '50px 40px 40px', borderBottom: '1px solid #1a1a1a',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '-20px', top: '-20px',
          fontSize: '250px', fontWeight: 900, color: 'rgba(225,6,0,0.04)',
          fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1, userSelect: 'none',
        }}>1</div>

        <div style={{
          display: 'inline-block', background: '#e10600', color: '#fff',
          fontSize: '11px', letterSpacing: '4px', padding: '4px 16px',
          marginBottom: '16px', textTransform: 'uppercase', fontWeight: 700,
        }}>🏆 Saison 2026</div>

        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900,
          textTransform: 'uppercase', letterSpacing: '-1px', lineHeight: 0.9,
          fontFamily: "'Barlow Condensed', sans-serif",
        }}>
          <span style={{ display: 'block', color: '#fff' }}>Classement</span>
          <span style={{ display: 'block', color: '#e10600' }}>Général</span>
        </h1>

        {isAuthenticated && monRang > 0 && (
          <div style={{
            marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '16px',
            background: '#0f0f0f', border: '1px solid #2a0000', padding: '16px 24px',
          }}>
            <div>
              <div style={{ fontSize: '10px', color: '#555', letterSpacing: '3px', textTransform: 'uppercase' }}>Votre position</div>
              <div style={{ fontSize: '36px', fontWeight: 900, color: '#e10600', fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>
                P{monRang}
              </div>
            </div>
            <div style={{ width: '1px', height: '40px', background: '#2a2a2a' }} />
            <div>
              <div style={{ fontSize: '10px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Points</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif" }}>
                {classement[monRang - 1]?.points ?? 0} pts
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '40px' }}>
        {loading ? (
          <div style={{ color: '#555', letterSpacing: '3px', fontSize: '12px', textTransform: 'uppercase' }}>Chargement...</div>
        ) : classement.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#333', fontSize: '18px', letterSpacing: '2px' }}>
            Aucun joueur classé pour l'instant
          </div>
        ) : (
          <>
            {/* TOP 3 PODIUM */}
            {top3.length >= 1 && (
              <div style={{ marginBottom: '48px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '3px', height: '24px', background: '#e10600' }} />
                  <span style={{ fontSize: '11px', letterSpacing: '4px', color: '#888', textTransform: 'uppercase' }}>Podium</span>
                </div>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'flex-end' }}>
                  {/* Ordre visuel : P2, P1, P3 */}
                  {[1, 0, 2].map(pos => {
                    const joueur = top3[pos];
                    if (!joueur) return null;
                    const isFirst = pos === 0;
                    const color = podiumColors[pos];
                    const heights = ['200px', '160px', '130px'];

                    return (
                      <div key={pos} style={{
                        flex: isFirst ? '1.2' : '1',
                        maxWidth: isFirst ? '280px' : '220px',
                        animation: `fadeUp 0.6s ease ${pos * 0.1}s both`,
                      }}>
                        {/* Card joueur */}
                        <div style={{
                          background: isFirst ? 'linear-gradient(135deg, #1a1000, #0f0f0f)' : '#0f0f0f',
                          border: `1px solid ${color}`,
                          borderTop: `4px solid ${color}`,
                          padding: isFirst ? '28px 24px' : '20px 16px',
                          textAlign: 'center',
                          animation: isFirst ? 'glow 2s infinite' : 'none',
                          marginBottom: '0',
                        }}>
                          <div style={{ fontSize: isFirst ? '48px' : '36px', marginBottom: '8px' }}>{podiumEmoji[pos]}</div>
                          <div style={{ fontSize: isFirst ? '28px' : '22px', fontWeight: 900, textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '1px' }}>
                            {joueur.pseudo}
                          </div>
                          <div style={{ fontSize: isFirst ? '40px' : '32px', fontWeight: 900, color, fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1, marginTop: '8px' }}>
                            {joueur.points}
                            <span style={{ fontSize: '16px', color: '#555', marginLeft: '4px' }}>pts</span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', marginTop: '8px' }}>
                            {joueur.nombreParis} paris
                          </div>
                        </div>

                        {/* Marche podium */}
                        <div style={{
                          height: heights[pos],
                          background: `linear-gradient(180deg, ${color}22, ${color}08)`,
                          border: `1px solid ${color}`,
                          borderTop: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span style={{ fontSize: '48px', fontWeight: 900, color: `${color}44`, fontFamily: "'Barlow Condensed', sans-serif" }}>
                            {pos + 1}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TABLEAU CLASSEMENT */}
            {reste.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '3px', height: '24px', background: '#e10600' }} />
                  <span style={{ fontSize: '11px', letterSpacing: '4px', color: '#888', textTransform: 'uppercase' }}>Classement complet</span>
                </div>

                {/* Header tableau */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr 120px 120px',
                  padding: '10px 20px', background: '#0d0d0d',
                  borderBottom: '2px solid #e10600',
                }}>
                  {['Rang', 'Joueur', 'Paris', 'Points'].map(h => (
                    <div key={h} style={{ fontSize: '10px', color: '#555', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700 }}>{h}</div>
                  ))}
                </div>

                {/* Lignes */}
                {reste.map((joueur: any, index: number) => {
                  const rang = index + 4;
                  const estMoi = joueur.pseudo === user?.pseudo;

                  return (
                    <div key={joueur.id} className="row" style={{
                      display: 'grid', gridTemplateColumns: '60px 1fr 120px 120px',
                      padding: '16px 20px',
                      background: estMoi ? '#130000' : '#0f0f0f',
                      borderLeft: `3px solid ${estMoi ? '#e10600' : 'transparent'}`,
                      borderBottom: '1px solid #1a1a1a',
                      animation: `fadeUp 0.4s ease ${index * 0.03}s both`,
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#333', fontFamily: "'Barlow Condensed', sans-serif" }}>
                        {rang}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '32px', height: '32px', background: '#1a1a1a',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '12px', fontWeight: 900, color: estMoi ? '#e10600' : '#555',
                          fontFamily: "'Barlow Condensed', sans-serif",
                        }}>
                          {joueur.pseudo.substring(0, 2).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif", color: estMoi ? '#fff' : '#aaa' }}>
                          {joueur.pseudo}
                          {estMoi && <span style={{ fontSize: '10px', color: '#e10600', marginLeft: '8px', letterSpacing: '2px' }}>VOUS</span>}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: '#555', alignSelf: 'center' }}>{joueur.nombreParis}</div>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", alignSelf: 'center' }}>
                        {joueur.points} <span style={{ fontSize: '12px', color: '#555' }}>pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Classement;