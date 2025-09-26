// Vite 기준
import axios from 'axios';

const RAW = import.meta.env.VITE_API_BASE_URL || '';
const BASE = RAW.endsWith('/') ? RAW.slice(0, -1) : RAW;

const api = axios.create({
  baseURL: BASE || 'https://pwd-week4-rhdelife.onrender.com', // 폴백
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export default api;
