import React, { useEffect, useState } from 'react';
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

const Profil = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [classement, setClassement] = useState<any[]>([]);
    const [paris, setParis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pariAModifier, setPariAModifier] = useState<any>(null);
    const [pilotes, setPilotes] = useState<any[]>([]);
    const [podiumModif, setPodiumModif] = useState<[any, any, any]>([null, null, null]);
    const [submittingModif, setSubmittingModif] = useState(false);
    const [messageModif, setMessageModif] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) return;
        Promise.all([
            fetch(`${API_URL}/utilisateurs/classement`).then(r => r.json()),
            fetch(`${API_URL}/paris/utilisateur/${user?.utilisateurId}`).then(r => r.json()),
            fetch(`${API_URL}/pilotes`).then(r => r.json()),
        ]).then(([classementData, parisData, pilotesData]) => {
            setClassement(classementData);
            setParis(parisData);
            setPilotes(pilotesData);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [user?.utilisateurId, isAuthenticated]);

    const monRang = classement.findIndex(u => u.pseudo === user?.pseudo) + 1;
    const monScore = classement.find(u => u.pseudo === user?.pseudo);
    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.pseudo}&backgroundColor=e10600&radius=50`;
    const parisValides = paris.filter(p => p.estValide);
    const pointsTotal = monScore?.points ?? 0;

    const drapeaux: { [key: string]: string } = {
        'Thaïlande': '🇹🇭', 'Brésil': '🇧🇷', 'USA': '🇺🇸', 'Qatar': '🇶🇦',
        'Espagne': '🇪🇸', 'France': '🇫🇷', 'Italie': '🇮🇹', 'Hongrie': '🇭🇺',
        'Tchéquie': '🇨🇿', 'Pays-Bas': '🇳🇱', 'Allemagne': '🇩🇪', 'Royaume-Uni': '🇬🇧',
        'Autriche': '🇦🇹', 'Japon': '🇯🇵', 'Indonésie': '🇮🇩', 'Australie': '🇦🇺',
        'Malaisie': '🇲🇾', 'Portugal': '🇵🇹',
    };

    const ouvrirModification = (pari: any) => {
        setPariAModifier(pari);
        setPodiumModif([pari.piloteP1, pari.piloteP2, pari.piloteP3]);
        setMessageModif(null);
    };

    const fermerModification = () => {
        setPariAModifier(null);
        setPodiumModif([null, null, null]);
        setMessageModif(null);
    };

    const togglePilote = (pilote: any) => {
        const pos = podiumModif.findIndex(p => p?.id === pilote.id);
        if (pos !== -1) {
            const n = [...podiumModif] as [any, any, any];
            n[pos] = null;
            setPodiumModif(n);
            return;
        }
        const idx = podiumModif.findIndex(p => p === null);
        if (idx === -1) return;
        const n = [...podiumModif] as [any, any, any];
        n[idx] = pilote;
        setPodiumModif(n);
    };

    const sauvegarderModification = async () => {
        if (podiumModif.some(p => p === null)) {
            setMessageModif('Sélectionnez les 3 pilotes du podium');
            return;
        }
        setSubmittingModif(true);
        try {
            const res = await fetch(`${API_URL}/paris/${pariAModifier.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify({
                    utilisateurId: user?.utilisateurId,
                    grandPrixId: pariAModifier.grandPrixId,
                    piloteP1Id: podiumModif[0].id,
                    piloteP2Id: podiumModif[1].id,
                    piloteP3Id: podiumModif[2].id,
                }),
            });
            if (!res.ok) throw new Error(await res.text());
            // Refresh paris
            const parisData = await fetch(`${API_URL}/paris/utilisateur/${user?.utilisateurId}`).then(r => r.json());
            setParis(parisData);
            fermerModification();
        } catch (err: any) {
            setMessageModif(err.message || 'Erreur lors de la modification');
        }
        setSubmittingModif(false);
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
        .pilote-modif:hover { border-color: #e10600 !important; cursor: pointer; }
        .pilote-modif { transition: all 0.2s; }
        .modifier-btn:hover { background: #1a1a1a !important; border-color: #e10600 !important; color: #e10600 !important; }
        .modifier-btn { transition: all 0.2s; }
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

            {/* MODAL MODIFICATION */}
            {pariAModifier && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 200,
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px',
                }}>
                    <div style={{
                        background: '#0f0f0f', border: '1px solid #1a1a1a',
                        borderTop: '3px solid #e10600',
                        width: '100%', maxWidth: '800px',
                        maxHeight: '90vh', overflowY: 'auto',
                        padding: '32px',
                    }}>
                        {/* Header modal */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#e10600', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    Modifier le pari
                                </div>
                                <div style={{ fontSize: '22px', fontWeight: 800, textTransform: 'uppercase' }}>
                                    {pariAModifier.grandPrix?.nom?.replace(/Grand Prix of |Grand Prix du |Grand Prix de /i, '') || 'GP'}
                                </div>
                            </div>
                            <button onClick={fermerModification} style={{
                                background: 'transparent', border: '1px solid #333',
                                color: '#888', padding: '8px 16px', cursor: 'pointer',
                                fontSize: '12px', letterSpacing: '1px',
                            }}>✕ Fermer</button>
                        </div>

                        {/* Podium actuel */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                            {[0, 1, 2].map(pos => (
                                <div key={pos} style={{
                                    flex: 1, background: '#0a0a0a',
                                    border: `2px solid ${podiumModif[pos] ? PODIUM_COLORS[pos] : '#2a2a2a'}`,
                                    padding: '16px', textAlign: 'center',
                                    cursor: podiumModif[pos] ? 'pointer' : 'default',
                                }} onClick={() => podiumModif[pos] && (() => {
                                    const n = [...podiumModif] as [any, any, any];
                                    n[pos] = null;
                                    setPodiumModif(n);
                                })()}>
                                    <div style={{ fontSize: '12px', fontWeight: 900, color: PODIUM_COLORS[pos], marginBottom: '8px' }}>
                                        {PODIUM_LABELS[pos]}
                                    </div>
                                    {podiumModif[pos] ? (
                                        <>
                                            <div style={{ fontSize: '16px', fontWeight: 800, textTransform: 'uppercase' }}>
                                                {podiumModif[pos].nom}
                                            </div>
                                            <div style={{ fontSize: '10px', color: '#555', marginTop: '4px' }}>Cliquer pour retirer</div>
                                        </>
                                    ) : (
                                        <div style={{ fontSize: '12px', color: '#333' }}>Vide</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Message erreur */}
                        {messageModif && (
                            <div style={{
                                padding: '12px 16px', marginBottom: '16px',
                                background: 'rgba(225,6,0,0.1)', border: '1px solid #e10600',
                                color: '#e10600', fontSize: '13px',
                            }}>{messageModif}</div>
                        )}

                        {/* Liste pilotes */}
                        <div style={{ fontSize: '10px', color: '#555', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
                            Sélectionner les pilotes
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px', marginBottom: '24px' }}>
                            {pilotes.map((pilote: any) => {
                                const pos = podiumModif.findIndex(p => p?.id === pilote.id);
                                const enPodium = pos !== -1;
                                const teamColor = couleurEquipe[pilote.equipe] || '#e10600';
                                return (
                                    <div key={pilote.id} className="pilote-modif"
                                        onClick={() => togglePilote(pilote)}
                                        style={{
                                            background: enPodium ? '#1a0000' : '#0a0a0a',
                                            border: `1px solid ${enPodium ? PODIUM_COLORS[pos] : '#1a1a1a'}`,
                                            borderLeft: `3px solid ${teamColor}`,
                                            padding: '10px 12px',
                                            opacity: !enPodium && podiumModif.filter(Boolean).length >= 3 ? 0.3 : 1,
                                            position: 'relative',
                                        }}>
                                        {enPodium && (
                                            <div style={{
                                                position: 'absolute', top: '6px', right: '6px',
                                                background: PODIUM_COLORS[pos], color: '#000',
                                                fontSize: '9px', fontWeight: 900, padding: '1px 5px',
                                            }}>{PODIUM_LABELS[pos]}</div>
                                        )}
                                        <div style={{ fontSize: '11px', color: teamColor, fontWeight: 700 }}>#{pilote.numero}</div>
                                        <div style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase' }}>{pilote.nom}</div>
                                        <div style={{ fontSize: '10px', color: '#555' }}>{pilote.prenom}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bouton sauvegarder */}
                        <button onClick={sauvegarderModification} disabled={submittingModif} style={{
                            width: '100%', background: '#e10600', color: '#fff',
                            border: 'none', padding: '16px', fontSize: '13px',
                            letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 900,
                            cursor: submittingModif ? 'not-allowed' : 'pointer',
                            opacity: submittingModif ? 0.7 : 1,
                            clipPath: 'polygon(0 0, 98% 0, 100% 100%, 2% 100%)',
                        }}>
                            {submittingModif ? 'Sauvegarde...' : '✅ Sauvegarder les modifications'}
                        </button>
                    </div>
                </div>
            )}

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
                                <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', fontSize: '28px' }}>
                                    {monRang === 1 ? '🥇' : monRang === 2 ? '🥈' : '🥉'}
                                </div>
                            )}
                        </div>

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

                                        {/* Points + Bouton modifier */}
                                        <div style={{ textAlign: 'right', minWidth: '120px' }}>
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
                                                    <div style={{ fontSize: '10px', color: '#333', marginTop: '4px', marginBottom: '8px' }}>Résultats à venir</div>
                                                    <button className="modifier-btn" onClick={() => ouvrirModification(pari)} style={{
                                                        background: 'transparent', border: '1px solid #333',
                                                        color: '#555', padding: '6px 14px',
                                                        fontSize: '10px', letterSpacing: '2px',
                                                        textTransform: 'uppercase', fontWeight: 700,
                                                        cursor: 'pointer',
                                                    }}>✏️ Modifier</button>
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