import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Auth = ({ onLogin }: { onLogin?: (user: any) => void }) => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

    const [loginForm, setLoginForm] = useState({ email: '', motDePasse: '' });
    const [registerForm, setRegisterForm] = useState({ pseudo: '', email: '', motDePasse: '', confirm: '' });

    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch('http://localhost:5000/api/utilisateurs/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginForm.email, motDePasse: loginForm.motDePasse }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data);
            login(data);
            setMessage({ text: 'Connexion réussie ! Redirection...', type: 'success' });
            setTimeout(() => window.location.href = '/', 1000);
        } catch (err: any) {
            setMessage({ text: err.message || 'Erreur de connexion', type: 'error' });
        }
        setLoading(false);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (registerForm.motDePasse !== registerForm.confirm) {
            setMessage({ text: 'Les mots de passe ne correspondent pas.', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/utilisateurs/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pseudo: registerForm.pseudo, email: registerForm.email, motDePasse: registerForm.motDePasse }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data);
            setMessage({ text: 'Inscription réussie ! Vous pouvez vous connecter.', type: 'success' });
            setMode('login');
        } catch (err: any) {
            setMessage({ text: err.message || "Erreur lors de l'inscription", type: 'error' });
        }
        setLoading(false);
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        background: '#0a0a0a',
        border: '1px solid #2a2a2a',
        borderBottom: '2px solid #333',
        color: '#fff',
        padding: '14px 16px',
        fontSize: '14px',
        fontFamily: "'Barlow', sans-serif",
        outline: 'none',
        transition: 'border-color 0.2s',
        marginBottom: '16px',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '10px',
        letterSpacing: '3px',
        color: '#555',
        textTransform: 'uppercase',
        marginBottom: '6px',
        display: 'block',
        fontFamily: "'Barlow Condensed', sans-serif",
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            fontFamily: "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif",
            display: 'flex',
            flexDirection: 'column',
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .auth-input:focus {
          border-bottom-color: #e10600 !important;
          border-color: #333 !important;
          border-bottom: 2px solid #e10600 !important;
        }
        .cta-btn:hover { background: #c00500 !important; }
        .cta-btn { transition: background 0.2s ease; }
        .tab:hover { color: #fff !important; }
      `}</style>

            {/* NAVBAR */}
            <nav style={{
                borderBottom: '2px solid #e10600',
                padding: '0 40px',
                display: 'flex', alignItems: 'center',
                height: '64px', background: '#0a0a0a',
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
            </nav>

            {/* MAIN */}
            <div style={{
                flex: 1, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                padding: '40px 20px',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)',
                position: 'relative', overflow: 'hidden',
            }}>

                {/* Background number */}
                <div style={{
                    position: 'absolute', left: '-40px', bottom: '-40px',
                    fontSize: '400px', fontWeight: 900,
                    color: 'rgba(225,6,0,0.03)',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    lineHeight: 1, userSelect: 'none',
                }}>1</div>

                <div style={{
                    width: '100%', maxWidth: '440px',
                    animation: 'fadeUp 0.6s ease forwards',
                    position: 'relative',
                }}>

                    {/* Logo */}
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{
                            display: 'inline-block',
                            background: '#e10600', color: '#fff',
                            fontWeight: 900, fontSize: '28px',
                            letterSpacing: '2px', padding: '6px 20px',
                            clipPath: 'polygon(0 0, 95% 0, 100% 100%, 5% 100%)',
                            marginBottom: '12px',
                        }}>MOTOGP</div>
                        <div style={{ color: '#555', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase' }}>
                            Betting 2026
                        </div>
                    </div>

                    {/* Card */}
                    <div style={{
                        background: '#0f0f0f',
                        border: '1px solid #1a1a1a',
                        borderTop: '3px solid #e10600',
                        padding: '40px',
                    }}>

                        {/* Tabs */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr',
                            gap: '0', marginBottom: '36px',
                            borderBottom: '1px solid #1a1a1a',
                        }}>
                            {(['login', 'register'] as const).map(tab => (
                                <button key={tab} className="tab" onClick={() => { setMode(tab); setMessage(null); }} style={{
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: mode === tab ? '2px solid #e10600' : '2px solid transparent',
                                    color: mode === tab ? '#fff' : '#555',
                                    padding: '12px',
                                    fontSize: '12px', letterSpacing: '3px',
                                    textTransform: 'uppercase', fontWeight: 700,
                                    cursor: 'pointer',
                                    fontFamily: "'Barlow Condensed', sans-serif",
                                    marginBottom: '-1px',
                                    transition: 'color 0.2s',
                                }}>
                                    {tab === 'login' ? 'Connexion' : 'Inscription'}
                                </button>
                            ))}
                        </div>

                        {/* Message */}
                        {message && (
                            <div style={{
                                padding: '12px 16px',
                                background: message.type === 'error' ? 'rgba(225,6,0,0.1)' : 'rgba(0,200,100,0.1)',
                                border: `1px solid ${message.type === 'error' ? '#e10600' : '#00c864'}`,
                                color: message.type === 'error' ? '#e10600' : '#00c864',
                                fontSize: '13px', marginBottom: '24px',
                                fontFamily: "'Barlow', sans-serif",
                            }}>
                                {message.text}
                            </div>
                        )}

                        {/* LOGIN FORM */}
                        {mode === 'login' && (
                            <form onSubmit={handleLogin}>
                                <div>
                                    <label style={labelStyle}>Email</label>
                                    <input
                                        className="auth-input"
                                        type="email" required
                                        placeholder="votre@email.com"
                                        value={loginForm.email}
                                        onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Mot de passe</label>
                                    <input
                                        className="auth-input"
                                        type="password" required
                                        placeholder="••••••••"
                                        value={loginForm.motDePasse}
                                        onChange={e => setLoginForm({ ...loginForm, motDePasse: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <button className="cta-btn" type="submit" disabled={loading} style={{
                                    width: '100%',
                                    background: '#e10600', color: '#fff',
                                    border: 'none', padding: '16px',
                                    fontSize: '13px', letterSpacing: '3px',
                                    textTransform: 'uppercase', fontWeight: 800,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1,
                                    fontFamily: "'Barlow Condensed', sans-serif",
                                    clipPath: 'polygon(0 0, 97% 0, 100% 100%, 3% 100%)',
                                    marginTop: '8px',
                                }}>
                                    {loading ? 'Connexion...' : 'Se connecter →'}
                                </button>

                                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                    <span style={{ color: '#555', fontSize: '12px' }}>Pas encore de compte ? </span>
                                    <button type="button" onClick={() => setMode('register')} style={{
                                        background: 'none', border: 'none',
                                        color: '#e10600', fontSize: '12px',
                                        cursor: 'pointer', fontWeight: 700,
                                        letterSpacing: '1px',
                                    }}>S'inscrire</button>
                                </div>
                            </form>
                        )}

                        {/* REGISTER FORM */}
                        {mode === 'register' && (
                            <form onSubmit={handleRegister}>
                                <div>
                                    <label style={labelStyle}>Pseudo</label>
                                    <input
                                        className="auth-input"
                                        type="text" required
                                        placeholder="VotrePseudo"
                                        value={registerForm.pseudo}
                                        onChange={e => setRegisterForm({ ...registerForm, pseudo: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Email</label>
                                    <input
                                        className="auth-input"
                                        type="email" required
                                        placeholder="votre@email.com"
                                        value={registerForm.email}
                                        onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Mot de passe</label>
                                    <input
                                        className="auth-input"
                                        type="password" required
                                        placeholder="••••••••"
                                        value={registerForm.motDePasse}
                                        onChange={e => setRegisterForm({ ...registerForm, motDePasse: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Confirmer le mot de passe</label>
                                    <input
                                        className="auth-input"
                                        type="password" required
                                        placeholder="••••••••"
                                        value={registerForm.confirm}
                                        onChange={e => setRegisterForm({ ...registerForm, confirm: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <button className="cta-btn" type="submit" disabled={loading} style={{
                                    width: '100%',
                                    background: '#e10600', color: '#fff',
                                    border: 'none', padding: '16px',
                                    fontSize: '13px', letterSpacing: '3px',
                                    textTransform: 'uppercase', fontWeight: 800,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1,
                                    fontFamily: "'Barlow Condensed', sans-serif",
                                    clipPath: 'polygon(0 0, 97% 0, 100% 100%, 3% 100%)',
                                    marginTop: '8px',
                                }}>
                                    {loading ? 'Inscription...' : "S'inscrire →"}
                                </button>

                                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                    <span style={{ color: '#555', fontSize: '12px' }}>Déjà un compte ? </span>
                                    <button type="button" onClick={() => setMode('login')} style={{
                                        background: 'none', border: 'none',
                                        color: '#e10600', fontSize: '12px',
                                        cursor: 'pointer', fontWeight: 700,
                                        letterSpacing: '1px',
                                    }}>Se connecter</button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Info points */}
                    <div style={{
                        marginTop: '24px',
                        background: '#0f0f0f',
                        border: '1px solid #1a1a1a',
                        padding: '20px 24px',
                        display: 'flex', gap: '24px', justifyContent: 'center',
                    }}>
                        {[
                            { pts: '10pts', label: '1er trouvé' },
                            { pts: '7pts', label: '2ème trouvé' },
                            { pts: '5pts', label: '3ème trouvé' },
                            { pts: '+15pts', label: 'Ordre parfait' },
                        ].map((item, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '16px', fontWeight: 900, color: '#e10600', fontFamily: "'Barlow Condensed', sans-serif" }}>{item.pts}</div>
                                <div style={{ fontSize: '10px', color: '#444', letterSpacing: '1px', textTransform: 'uppercase' }}>{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;