import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Pilotes = () => {
    const [pilotes, setPilotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterEquipe, setFilterEquipe] = useState('');
    const { user, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        fetch('http://localhost:5000/api/pilotes')
            .then(res => res.json())
            .then(data => { setPilotes(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const equipes = pilotes
        .map((p: any) => p.equipe as string)
        .filter((equipe, index, self) => self.indexOf(equipe) === index);

    const pilotesFiltres = pilotes.filter((p: any) => {
        const matchSearch = `${p.prenom} ${p.nom}`.toLowerCase().includes(search.toLowerCase());
        const matchEquipe = filterEquipe === '' || p.equipe === filterEquipe;
        return matchSearch && matchEquipe;
    });

    const drapeaux: { [key: string]: string } = {
        'Italien': '🇮🇹', 'Espagnol': '🇪🇸', 'Français': '🇫🇷',
        'Brésilien': '🇧🇷', 'Australien': '🇦🇺', 'Japonais': '🇯🇵',
        'Sud-Africain': '🇿🇦', 'Turc': '🇹🇷',
    };

    const couleurEquipe: { [key: string]: string } = {
        'Ducati Lenovo Team': '#e10600',
        'Aprilia Racing': '#00a651',
        'Monster Energy Yamaha MotoGP': '#1a1aff',
        'Red Bull KTM Factory Racing': '#ff6600',
        'Red Bull KTM Tech3': '#ff6600',
        'Prima Pramac Yamaha MotoGP': '#1a1aff',
        'BK8 Gresini Racing MotoGP': '#e10600',
        'Pertamina Enduro VR46 Racing Team': '#ffdd00',
        'Honda HRC Castrol': '#e10600',
        'LCR Honda': '#e10600',
        'Trackhouse MotoGP Team': '#00aaff',
    };

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

        .pilote-card:hover {
          transform: translateY(-6px);
          border-color: var(--team-color) !important;
          box-shadow: 0 12px 40px rgba(225,6,0,0.2);
        }
        .pilote-card { transition: all 0.3s ease; }
        .nav-link:hover { color: #e10600 !important; }
        .search-input:focus { border-color: #e10600 !important; outline: none; }
        .filter-btn:hover { border-color: #e10600 !important; color: #fff !important; }
        .filter-btn-active { border-color: #e10600 !important; color: #e10600 !important; background: rgba(225,6,0,0.1) !important; }
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
                            color: label === 'Pilotes' ? '#fff' : '#aaa',
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
                position: 'relative', overflow: 'hidden',
                borderBottom: '1px solid #1a1a1a',
            }}>
                <div style={{
                    position: 'absolute', right: '-20px', top: '-20px',
                    fontSize: '250px', fontWeight: 900,
                    color: 'rgba(225,6,0,0.04)',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    lineHeight: 1, userSelect: 'none',
                }}>22</div>

                <div style={{
                    display: 'inline-block', background: '#e10600', color: '#fff',
                    fontSize: '11px', letterSpacing: '4px', padding: '4px 16px',
                    marginBottom: '16px', textTransform: 'uppercase', fontWeight: 700,
                }}>🏍️ Saison 2026</div>

                <h1 style={{
                    fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900,
                    textTransform: 'uppercase', letterSpacing: '-1px',
                    lineHeight: 0.9, fontFamily: "'Barlow Condensed', sans-serif",
                }}>
                    <span style={{ display: 'block', color: '#fff' }}>Les Pilotes</span>
                    <span style={{ display: 'block', color: '#e10600' }}>MotoGP</span>
                </h1>

                <p style={{
                    marginTop: '16px', color: '#555', fontSize: '14px',
                    fontFamily: "'Barlow', sans-serif",
                }}>
                    {pilotes.length} pilotes · Saison 2026
                </p>
            </div>

            {/* FILTRES */}
            <div style={{ padding: '24px 40px', borderBottom: '1px solid #1a1a1a', background: '#0d0d0d' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Search */}
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Rechercher un pilote..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            background: '#0a0a0a', border: '1px solid #2a2a2a',
                            color: '#fff', padding: '10px 16px',
                            fontSize: '13px', width: '240px',
                            fontFamily: "'Barlow', sans-serif",
                            transition: 'border-color 0.2s',
                        }}
                    />

                    {/* Filter équipes */}
                    <button
                        className={`filter-btn ${filterEquipe === '' ? 'filter-btn-active' : ''}`}
                        onClick={() => setFilterEquipe('')}
                        style={{
                            background: 'transparent', border: '1px solid #2a2a2a',
                            color: '#555', padding: '10px 16px',
                            fontSize: '11px', letterSpacing: '2px',
                            textTransform: 'uppercase', cursor: 'pointer',
                            fontFamily: "'Barlow Condensed', sans-serif",
                            transition: 'all 0.2s',
                        }}
                    >Toutes les équipes</button>

                    {equipes.map(equipe => (
                        <button
                            key={equipe}
                            className={`filter-btn ${filterEquipe === equipe ? 'filter-btn-active' : ''}`}
                            onClick={() => setFilterEquipe(equipe === filterEquipe ? '' : equipe)}
                            style={{
                                background: 'transparent',
                                border: `1px solid ${filterEquipe === equipe ? couleurEquipe[equipe] || '#e10600' : '#2a2a2a'}`,
                                color: filterEquipe === equipe ? couleurEquipe[equipe] || '#e10600' : '#555',
                                padding: '10px 16px', fontSize: '11px',
                                letterSpacing: '1px', textTransform: 'uppercase',
                                cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif",
                                transition: 'all 0.2s',
                            }}
                        >{equipe}</button>
                    ))}
                </div>
            </div>

            {/* GRILLE PILOTES */}
            <div style={{ padding: '40px' }}>
                {loading ? (
                    <div style={{ color: '#555', letterSpacing: '3px', fontSize: '12px', textTransform: 'uppercase' }}>
                        Chargement des pilotes...
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '16px',
                    }}>
                        {pilotesFiltres.map((pilote: any) => {
                            const teamColor = couleurEquipe[pilote.equipe] || '#e10600';
                            return (
                                <div key={pilote.id} className="pilote-card" style={{
                                    background: '#0f0f0f',
                                    border: '1px solid #1a1a1a',
                                    borderTop: `3px solid ${teamColor}`,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    animation: 'fadeUp 0.5s ease forwards',
                                }}>
                                    {/* Numéro en fond */}
                                    <div style={{
                                        position: 'absolute', right: '-10px', top: '-10px',
                                        fontSize: '100px', fontWeight: 900,
                                        color: 'rgba(255,255,255,0.03)',
                                        fontFamily: "'Barlow Condensed', sans-serif",
                                        lineHeight: 1, userSelect: 'none',
                                    }}>#{pilote.numero}</div>

                                    {/* Photo */}
                                    <div style={{
                                        height: '200px', overflow: 'hidden',
                                        background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        position: 'relative',
                                    }}>
                                        {pilote.photoUrl ? (
                                            <img
                                                src={pilote.photoUrl}
                                                alt={`${pilote.prenom} ${pilote.nom}`}
                                                style={{
                                                    width: '100%', height: '100%',
                                                    objectFit: 'cover', objectPosition: 'top',
                                                }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                fontSize: '64px', fontWeight: 900,
                                                color: teamColor, opacity: 0.3,
                                                fontFamily: "'Barlow Condensed', sans-serif",
                                            }}>#{pilote.numero}</div>
                                        )}

                                        {/* Overlay gradient */}
                                        <div style={{
                                            position: 'absolute', bottom: 0, left: 0, right: 0,
                                            height: '60px',
                                            background: 'linear-gradient(transparent, #0f0f0f)',
                                        }} />
                                    </div>

                                    {/* Infos */}
                                    <div style={{ padding: '16px' }}>
                                        <div style={{
                                            fontSize: '11px', color: teamColor,
                                            letterSpacing: '2px', textTransform: 'uppercase',
                                            marginBottom: '4px', fontWeight: 700,
                                        }}>#{pilote.numero}</div>

                                        <div style={{
                                            fontSize: '22px', fontWeight: 900,
                                            textTransform: 'uppercase', letterSpacing: '0.5px',
                                            fontFamily: "'Barlow Condensed', sans-serif",
                                            lineHeight: 1,
                                        }}>
                                            <span style={{ color: '#888', fontSize: '14px', display: 'block', fontWeight: 400 }}>{pilote.prenom}</span>
                                            {pilote.nom}
                                        </div>

                                        <div style={{
                                            marginTop: '12px', paddingTop: '12px',
                                            borderTop: '1px solid #1a1a1a',
                                            fontSize: '11px', color: '#555',
                                        }}>
                                            <div style={{ marginBottom: '4px' }}>
                                                {drapeaux[pilote.nationalite] || '🏁'} {pilote.nationalite}
                                            </div>
                                            <div style={{ color: '#444', fontSize: '10px', letterSpacing: '1px' }}>
                                                {pilote.equipe}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!loading && pilotesFiltres.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#333', padding: '60px', fontSize: '14px', letterSpacing: '2px' }}>
                        Aucun pilote trouvé
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pilotes;