import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Pilotes
export const getPilotes = () => api.get('/pilotes');
export const getPilote = (id: number) => api.get(`/pilotes/${id}`);
export const createPilote = (pilote: any) => api.post('/pilotes', pilote);

// Grands Prix
export const getGrandsPrix = () => api.get('/grandsprix');
export const getGrandPrix = (id: number) => api.get(`/grandsprix/${id}`);
export const createGrandPrix = (gp: any) => api.post('/grandsprix', gp);

// Paris
export const getParis = () => api.get('/paris');
export const getParisByUtilisateur = (userId: number) => api.get(`/paris/utilisateur/${userId}`);
export const createPari = (pari: any) => api.post('/paris', pari);

export default api;