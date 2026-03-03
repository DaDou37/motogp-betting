import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Accueil from './pages/Accueil';
import Pilotes from './pages/Pilotes';
import GrandsPrix from './pages/GrandsPrix';
import Parier from './pages/Parier';
import Classement from './pages/Classement';
import Profil from './pages/Profil';
import Admin from './pages/Admin';
import AuthPage from './pages/Auth';



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/pilotes" element={<Pilotes />} />
          <Route path="/grandsprix" element={<GrandsPrix />} />
          <Route path="/parier" element={<Parier />} />
          <Route path="/classement" element={<Classement />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;