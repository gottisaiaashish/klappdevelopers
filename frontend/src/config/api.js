/**
 * API Configuration for KLAPP Developers Frontend
 * Automatically determines whether to use local proxy or production Render backend URL.
 */

const RENDER_BACKEND_URL = 'https://klappdevelopers.onrender.com';

export const getApiBaseUrl = () => {
  // If explicitly configured via VITE_BACKEND_URL env variable
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '');
  }

  // During local development on localhost or 127.0.0.1
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return ''; // Uses Vite dev proxy (/api -> http://localhost:5000)
  }

  // Production domain (e.g. www.klappdevelopers.in or Vercel)
  return RENDER_BACKEND_URL;
};

export const API_BASE_URL = getApiBaseUrl();
