import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [grandsPrix, setGrandsPrix] = useState<any[]>([]);
    const [pilotes, setPilotes] = useState<any[]>([]);
    const [selectedGP, setSelectedGP] = useState<any>(null);
    const [podium, setPodium] = useState<[any, any, any]>([null, null, null]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (!isAuthenticated) return;
        if (!user?.estAdmin) { window.location.href = '/'; return; }

        Promise.all([
            fetch('http://localhost:5000/api/grandsprix').then(r => r.json()),
            fetch('http://localhost:5000/api/pilotes').then(r => r.json()),
        ]).then(([gps, pils]) => {
            setGrandsPrix(gps);
            setPilotes(pils);
            setLoading(false);
        });
    }, [isAuthenticated, user]);

    const drapeaux: { [key: string]: string } = {
        'Thaïlande': '🇹🇭', 'Brésil': '🇧🇷', 'USA': '🇺🇸', 'Qatar': '🇶🇦',
        'Espagne': '🇪🇸', 'France': '🇫🇷', 'Italie': '🇮🇹', 'Hongrie': '🇭🇺',
        'Tchéquie': '🇨🇿', 'Pays-Bas': '🇳🇱', 'Allemagne': '🇩🇪', 'Royaume-Uni': '🇬🇧',
        'Autriche': '🇦🇹', 'Japon': '🇯🇵', 'Indonésie': '🇮🇩', 'Australie': '🇦🇺',
        'Malaisie': '🇲🇾', 'Portugal': '🇵🇹',
    };

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

    const soumettrResultats = async () => {
        if (!selectedGP) { setMessage({ text: 'Choisissez un Grand Prix.', type: 'error' }); return; }
        if (podium.some(p => p === null)) { setMessage({ text: 'Sélectionnez les 3 pilotes du podium.', type: 'error' }); return; }

        setSubmitting(true);
        setMessage(null);

        try {
            // 1. Sauvegarder les résultats
            const resResultats = await fetch('http://localhost:5000/api/resultats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify({
                    grandPrixId: selectedGP.id,
                    piloteP1Id: podium[0].id,
                    piloteP2Id: podium[1].id,
                    piloteP3Id: podium[2].id,
                }),
            });
            if (!resResultats.ok) throw new Error(await resResultats.text());

            // 2. Calculer les points
            const resPoints = await fetch(`http://localhost:5000/api/paris/calculer/${selectedGP.id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user?.token}` },
            });
            if (!resPoints.ok) throw new Error(await resPoints.text());

            setMessage({ text: `✅ Résultats enregistrés et points calculés pour ${selectedGP.nom} !`, type: 'success' });
            setPodium([null, null, null]);
            setSelectedGP(null);

            // Refresh des GP
            fetch('http://localhost:5000/api/grandsprix').then(r => r.json()).then(setGrandsPrix);

        } catch (err: any) {
            setMessage({ text: err.message || 'Erreur', type: 'error' });
        }
        setSubmitting(false);
    };

    const podiumColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
    const podiumLabels = ['P1', 'P2', 'P3'];

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
        .pilote-card:hover { border-color: #e10600 !important; transform: translateY(-2px); }
        .pilote-card { transition: all 0.2s ease; cursor: pointer; }
        .pilote-selected { border-color: #e10600 !important; background: #1a0000 !important; }
        .gp-option:hover { border-color: #e10600 !important; background: #1a0000 !important; }
        .gp-option { transition: all 0.2s; cursor: pointer; }
        .submit-btn:hover { background: #c00500 !important; }
        .submit-btn { transition: background 0.2s; }
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
                    <div style={{
                        background: '#e10600', color: '#fff', fontSize: '10px',
                        letterSpacing: '2px', padding: '4px 12px', fontWeight: 700,
                        textTransform: 'uppercase',
                    }}>⚙️ ADMIN</div>
                    <a href="/profil" style={{ color: '#e10600', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textDecoration: 'none' }}>
                        🏁 {user?.pseudo}
                    </a>
                    <button onClick={logout} style={{
                        background: 'transparent', color: '#888', border: '1px solid #333',
                        padding: '8px 20px', fontSize: '12px', letterSpacing: '2px',
                        textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
                    }}>Déconnexion</button>
                </div>
            </nav>

            <div style={{ padding: '40px' }}>
                {/* HEADER */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{
                        display: 'inline-block', background: '#e10600', color: '#fff',
                        fontSize: '11px', letterSpacing: '4px', padding: '4px 16px',
                        marginBottom: '16px', textTransform: 'uppercase', fontWeight: 700,
                    }}>⚙️ Administration</div>
                    <h1 style={{
                        fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900,
                        textTransform: 'uppercase', letterSpacing: '-1px', lineHeight: 0.9,
                    }}>
                        <span style={{ display: 'block' }}>Saisir les</span>
                        <span style={{ display: 'block', color: '#e10600' }}>Résultats</span>
                    </h1>
                </div>

                {loading ? (
                    <div style={{ color: '#555', letterSpacing: '3px', fontSize: '12px', textTransform: 'uppercase' }}>Chargement...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>

                        {/* COLONNE GAUCHE */}
                        <div>
                            {/* STEP 1 : Choisir le GP */}
                            <div style={{ marginBottom: '40px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                    <div style={{
                                        width: '28px', height: '28px', background: '#e10600',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '14px', fontWeight: 900,
                                        clipPath: 'polygon(0 0, 85% 0, 100% 100%, 15% 100%)',
                                    }}>1</div>
                                    <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>
                                        Choisir le Grand Prix
                                    </span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {grandsPrix.map((gp: any) => (
                                        <div key={gp.id} className="gp-option"
                                            onClick={() => { setSelectedGP(gp); setPodium([null, null, null]); setMessage(null); }}
                                            style={{
                                                background: '#0f0f0f',
                                                border: `1px solid ${selectedGP?.id === gp.id ? '#e10600' : '#1a1a1a'}`,
                                                padding: '14px 20px',
                                                display: 'flex', alignItems: 'center', gap: '16px',
                                                opacity: 1,
                                            }}>
                                            <span style={{ fontSize: '24px' }}>{drapeaux[gp.pays] || '🏁'}</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" }}>
                                                    {gp.nom}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#555', fontFamily: "'Barlow', sans-serif" }}>{gp.circuit}</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {gp.estTermine && (
                                                    <span style={{ fontSize: '10px', color: '#00c864', letterSpacing: '2px', textTransform: 'uppercase', border: '1px solid #00c864', padding: '2px 8px' }}>
                                                        ✓ Terminé
                                                    </span>
                                                )}
                                                <div style={{ fontSize: '13px', color: selectedGP?.id === gp.id ? '#e10600' : '#555', fontWeight: 700 }}>
                                                    {new Date(gp.dateCourse).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }).toUpperCase()}
                                                </div>
                                                {selectedGP?.id === gp.id && <span style={{ color: '#e10600' }}>✓</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* STEP 2 : Sélectionner les pilotes */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                    <div style={{
                                        width: '28px', height: '28px', background: '#e10600',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '14px', fontWeight: 900,
                                        clipPath: 'polygon(0 0, 85% 0, 100% 100%, 15% 100%)',
                                    }}>2</div>
                                    <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>
                                        Sélectionner le podium réel
                                    </span>
                                    <span style={{ color: '#555', fontSize: '12px' }}>({pilotesEnPodium.length}/3)</span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
                                    {pilotes.map((pilote: any) => {
                                        const enPodium = pilotesEnPodium.includes(pilote.id);
                                        const position = podium.findIndex(p => p?.id === pilote.id);
                                        const teamColor = couleurEquipe[pilote.equipe] || '#e10600';

                                        return (
                                            <div key={pilote.id}
                                                className={`pilote-card ${enPodium ? 'pilote-selected' : ''}`}
                                                onClick={() => ajouterAuPodium(pilote)}
                                                style={{
                                                    background: enPodium ? '#1a0000' : '#0f0f0f',
                                                    border: `1px solid ${enPodium ? teamColor : '#1a1a1a'}`,
                                                    borderTop: `3px solid ${teamColor}`,
                                                    padding: '12px', position: 'relative',
                                                    opacity: pilotesEnPodium.length >= 3 && !enPodium ? 0.4 : 1,
                                                }}>
                                                {enPodium && (
                                                    <div style={{
                                                        position: 'absolute', top: '8px', right: '8px',
                                                        background: podiumColors[position],
                                                        color: '#000', fontSize: '10px', fontWeight: 900,
                                                        padding: '2px 6px',
                                                    }}>{podiumLabels[position]}</div>
                                                )}
                                                <div style={{ fontSize: '11px', color: teamColor, fontWeight: 700, letterSpacing: '1px', marginBottom: '4px' }}>
                                                    #{pilote.numero}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#888' }}>{pilote.prenom}</div>
                                                <div style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" }}>
                                                    {pilote.nom}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* COLONNE DROITE : RÉSUMÉ */}
                        <div style={{ position: 'sticky', top: '84px' }}>
                            <div style={{
                                background: '#0f0f0f', border: '1px solid #1a1a1a',
                                borderTop: '3px solid #e10600', padding: '32px 24px',
                            }}>
                                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                    <div style={{ fontSize: '11px', color: '#555', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                        Résultats officiels
                                    </div>
                                    {selectedGP ? (
                                        <div>
                                            <div style={{ fontSize: '20px' }}>{drapeaux[selectedGP.pays] || '🏁'}</div>
                                            <div style={{ fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" }}>
                                                {selectedGP.nom.replace(/Grand Prix of |Grand Prix du |Grand Prix de /i, '')}
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ color: '#333', fontSize: '13px' }}>Sélectionnez un GP</div>
                                    )}
                                </div>

                                {/* Podium résumé */}
                                <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {[0, 1, 2].map(pos => (
                                        <div key={pos} style={{
                                            display: 'flex', alignItems: 'center', gap: '16px',
                                            padding: '12px 16px',
                                            background: '#0a0a0a',
                                            border: `1px solid ${podium[pos] ? podiumColors[pos] + '44' : '#1a1a1a'}`,
                                            borderLeft: `3px solid ${podium[pos] ? podiumColors[pos] : '#1a1a1a'}`,
                                        }}>
                                            <span style={{ fontSize: '20px', fontWeight: 900, color: podiumColors[pos], fontFamily: "'Barlow Condensed', sans-serif", minWidth: '30px' }}>
                                                {podiumLabels[pos]}
                                            </span>
                                            {podium[pos] ? (
                                                <div>
                                                    <div style={{ fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" }}>
                                                        {podium[pos].nom}
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: '#555' }}>#{podium[pos].numero} · {podium[pos].prenom}</div>
                                                </div>
                                            ) : (
                                                <span style={{ color: '#333', fontSize: '12px', letterSpacing: '1px' }}>Non sélectionné</span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Message */}
                                {message && (
                                    <div style={{
                                        padding: '12px 16px', marginBottom: '16px',
                                        background: message.type === 'error' ? 'rgba(225,6,0,0.1)' : 'rgba(0,200,100,0.1)',
                                        border: `1px solid ${message.type === 'error' ? '#e10600' : '#00c864'}`,
                                        color: message.type === 'error' ? '#e10600' : '#00c864',
                                        fontSize: '13px', fontFamily: "'Barlow', sans-serif",
                                    }}>
                                        {message.text}
                                    </div>
                                )}

                                <button className="submit-btn" onClick={soumettrResultats} disabled={submitting} style={{
                                    width: '100%', background: '#e10600', color: '#fff',
                                    border: 'none', padding: '18px',
                                    fontSize: '14px', letterSpacing: '3px',
                                    textTransform: 'uppercase', fontWeight: 900,
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    opacity: submitting ? 0.7 : 1,
                                    fontFamily: "'Barlow Condensed', sans-serif",
                                    clipPath: 'polygon(0 0, 97% 0, 100% 100%, 3% 100%)',
                                }}>
                                    {submitting ? 'Enregistrement...' : '✅ Valider les résultats'}
                                </button>

                                <div style={{ marginTop: '16px', fontSize: '11px', color: '#444', textAlign: 'center', fontFamily: "'Barlow', sans-serif" }}>
                                    Cette action marquera le GP comme terminé et calculera les points de tous les parieurs.
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;