/**
 * API Configuration for KLAPP Developers Frontend
 * Uses relative path (/api) which is seamlessly proxied by Vite in dev and Vercel in production.
 */

const RENDER_BACKEND_URL = 'https://klappdevelopers.onrender.com';

export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '');
  }
  // Return empty string for relative paths (/api) so Vercel rewrites & Vite dev proxy work 100%
  return '';
};

export const API_BASE_URL = getApiBaseUrl();
