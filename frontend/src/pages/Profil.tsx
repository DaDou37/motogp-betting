import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profil = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [classement, setClassement] = useState<any[]>([]);
    const [paris, setParis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) return; // On attend sans rediriger

        Promise.all([
            fetch('http://localhost:5000/api/utilisateurs/classement').then(r => r.json()),
            fetch(`http://localhost:5000/api/paris/utilisateur/${user?.utilisateurId}`).then(r => r.json()),
        ]).then(([classementData, parisData]) => {
            setClassement(classementData);
            setParis(parisData);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [user?.utilisateurId, isAuthenticated]);

    const monRang = classement.findIndex(u => u.pseudo === user?.pseudo) + 1;
    const monScore = classement.find(u => u.pseudo === user?.pseudo);

    // Avatar DiceBear basé sur le pseudo
    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.pseudo}&backgroundColor=e10600&radius=50`;

    const parisValides = paris.filter(p => p.estValide);
    // const pariEnAttente = paris.filter(p => !p.estValide);
    const pointsTotal = monScore?.points ?? 0;

    const drapeaux: { [key: string]: string } = {
        'Thaïlande': '🇹🇭', 'Brésil': '🇧🇷', 'USA': '🇺🇸', 'Qatar': '🇶🇦',
        'Espagne': '🇪🇸', 'France': '🇫🇷', 'Italie': '🇮🇹', 'Hongrie': '🇭🇺',
        'Tchéquie': '🇨🇿', 'Pays-Bas': '🇳🇱', 'Allemagne': '🇩🇪', 'Royaume-Uni': '🇬🇧',
        'Autriche': '🇦🇹', 'Japon': '🇯🇵', 'Indonésie': '🇮🇩', 'Australie': '🇦🇺',
        'Malaisie': '🇲🇾', 'Portugal': '🇵🇹',
    };

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
        .nav-link:hover { color: #e10600 !important; }
        .pari-card:hover { border-color: #333 !important; }
        .pari-card { transition: border-color 0.2s; }
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
                            color: '#aaa', textDecoration: 'none', fontSize: '13px',
                            letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600,
                        }}>{label}</a>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <a href="/profil" style={{ color: '#e10600', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textDecoration: 'none' }}>
                            🏁 {user?.pseudo}
                        </a>
                        <button onClick={logout} style={{
                            background: 'transparent', color: '#888', border: '1px solid #333',
                            padding: '8px 20px', fontSize: '12px', letterSpacing: '2px',
                            textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
                        }}>Déconnexion</button>
                    </div>
                </div>
            </nav>

            {!isAuthenticated ? (
                <div style={{ textAlign: 'center', padding: '120px', color: '#555', letterSpacing: '3px', fontSize: '12px', textTransform: 'uppercase' }}>
                    Chargement...
                </div>
            ) : loading ? (
                <div style={{ textAlign: 'center', padding: '120px', color: '#555', letterSpacing: '3px', fontSize: '12px', textTransform: 'uppercase' }}>
                    Chargement...
                </div>
            ) : (
                <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>

                    {/* HEADER PROFIL */}
                    <div style={{
                        background: 'linear-gradient(135deg, #0f0f0f, #1a0000)',
                        border: '1px solid #1a1a1a', borderTop: '3px solid #e10600',
                        padding: '40px', marginBottom: '32px',
                        display: 'flex', gap: '40px', alignItems: 'center',
                        animation: 'fadeUp 0.5s ease forwards',
                    }}>
                        {/* Avatar */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '120px', height: '120px',
                                border: '3px solid #e10600',
                                borderRadius: '50%', overflow: 'hidden',
                                background: '#1a1a1a',
                            }}>
                                <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%' }} />
                            </div>
                            {monRang <= 3 && monRang > 0 && (
                                <div style={{
                                    position: 'absolute', bottom: '-8px', right: '-8px',
                                    fontSize: '28px',
                                }}>
                                    {monRang === 1 ? '🥇' : monRang === 2 ? '🥈' : '🥉'}
                                </div>
                            )}
                        </div>

                        {/* Infos */}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                Profil joueur
                            </div>
                            <h1 style={{
                                fontSize: '48px', fontWeight: 900, textTransform: 'uppercase',
                                fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '-1px', lineHeight: 1,
                            }}>{user?.pseudo}</h1>
                            <div style={{ color: '#555', fontSize: '14px', fontFamily: "'Barlow', sans-serif", marginTop: '4px' }}>
                                Saison MotoGP 2026
                            </div>
                        </div>

                        {/* Stats rapides */}
                        <div style={{ display: 'flex', gap: '24px' }}>
                            {[
                                { label: 'Classement', value: monRang > 0 ? `P${monRang}` : '-', color: '#e10600' },
                                { label: 'Points', value: `${pointsTotal}`, color: '#fff' },
                                { label: 'Paris', value: `${paris.length}`, color: '#fff' },
                                { label: 'Validés', value: `${parisValides.length}`, color: '#00c864' },
                            ].map((stat, i) => (
                                <div key={i} style={{ textAlign: 'center', padding: '16px 20px', background: '#0a0a0a', border: '1px solid #1a1a1a' }}>
                                    <div style={{ fontSize: '32px', fontWeight: 900, color: stat.color, fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>
                                        {stat.value}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px' }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* HISTORIQUE PARIS */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ width: '3px', height: '24px', background: '#e10600' }} />
                            <span style={{ fontSize: '11px', letterSpacing: '4px', color: '#888', textTransform: 'uppercase' }}>
                                Historique des paris ({paris.length})
                            </span>
                        </div>

                        {paris.length === 0 ? (
                            <div style={{
                                background: '#0f0f0f', border: '1px solid #1a1a1a',
                                padding: '60px', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏁</div>
                                <div style={{ color: '#555', fontSize: '14px', letterSpacing: '2px' }}>Aucun pari pour l'instant</div>
                                <button onClick={() => window.location.href = '/parier'} style={{
                                    marginTop: '24px', background: '#e10600', color: '#fff',
                                    border: 'none', padding: '12px 32px', fontSize: '13px',
                                    letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700,
                                    cursor: 'pointer', clipPath: 'polygon(0 0, 96% 0, 100% 100%, 4% 100%)',
                                }}>Parier maintenant</button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {paris.map((pari: any, index: number) => (
                                    <div key={pari.id} className="pari-card" style={{
                                        background: '#0f0f0f',
                                        border: `1px solid ${pari.estValide ? '#1a2a1a' : '#1a1a1a'}`,
                                        borderLeft: `3px solid ${pari.estValide ? '#00c864' : '#e10600'}`,
                                        padding: '20px 24px',
                                        display: 'flex', alignItems: 'center', gap: '24px',
                                        animation: `fadeUp 0.4s ease ${index * 0.05}s both`,
                                    }}>
                                        {/* GP Info */}
                                        <div style={{ minWidth: '200px' }}>
                                            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
                                                {drapeaux[pari.grandPrix?.pays] || '🏁'} {pari.grandPrix?.pays}
                                            </div>
                                            <div style={{ fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" }}>
                                                {pari.grandPrix?.nom?.replace(/Grand Prix of |Grand Prix du |Grand Prix de /i, '') || 'GP'}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#444', marginTop: '2px' }}>
                                                {pari.grandPrix?.dateCourse ? new Date(pari.grandPrix.dateCourse).toLocaleDateString('fr-FR') : ''}
                                            </div>
                                        </div>

                                        <div style={{ width: '1px', height: '50px', background: '#1a1a1a' }} />

                                        {/* Pronostic */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '10px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                                Pronostic
                                            </div>
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                {[
                                                    { pos: 'P1', pilote: pari.piloteP1, color: '#FFD700' },
                                                    { pos: 'P2', pilote: pari.piloteP2, color: '#C0C0C0' },
                                                    { pos: 'P3', pilote: pari.piloteP3, color: '#CD7F32' },
                                                ].map(({ pos, pilote, color }) => (
                                                    <div key={pos} style={{
                                                        background: '#0a0a0a', border: `1px solid ${color}33`,
                                                        padding: '8px 12px', minWidth: '100px',
                                                    }}>
                                                        <div style={{ fontSize: '10px', color, fontWeight: 700, marginBottom: '2px' }}>{pos}</div>
                                                        <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" }}>
                                                            {pilote?.nom || '?'}
                                                        </div>
                                                        <div style={{ fontSize: '10px', color: '#555' }}>#{pilote?.numero}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Points */}
                                        <div style={{ textAlign: 'right', minWidth: '100px' }}>
                                            {pari.estValide ? (
                                                <div>
                                                    <div style={{ fontSize: '36px', fontWeight: 900, color: '#00c864', fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>
                                                        +{pari.pointsGagnes}
                                                    </div>
                                                    <div style={{ fontSize: '10px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase' }}>points</div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div style={{ fontSize: '11px', color: '#e10600', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700 }}>
                                                        En attente
                                                    </div>
                                                    <div style={{ fontSize: '10px', color: '#333', marginTop: '4px' }}>Résultats à venir</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profil;