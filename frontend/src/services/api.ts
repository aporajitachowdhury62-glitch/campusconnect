import { Student, Shopkeeper } from '../types';

/**
 * Base API URL read from Vite environment variable.
 * When deployed, set VITE_API_URL on Vercel to your deployed backend URL:
 * e.g. https://campusconnect-backend.onrender.com
 * In local development, defaults to empty or http://127.0.0.1:8000
 */
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '');

export const api = {
  baseUrl: API_URL,

  async isOnline(): Promise<boolean> {
    if (!API_URL) return false;
    try {
      const res = await fetch(`${API_URL}/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getStudents(): Promise<Student[] | null> {
    if (!API_URL) return null;
    try {
      const res = await fetch(`${API_URL}/students`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn('API getStudents failed, using fallback data:', e);
      return null;
    }
  },

  async getShops(): Promise<Shopkeeper[] | null> {
    if (!API_URL) return null;
    try {
      const res = await fetch(`${API_URL}/shops`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn('API getShops failed, using fallback data:', e);
      return null;
    }
  },

  async createStudent(student: Student): Promise<Student | null> {
    if (!API_URL) return null;
    try {
      const res = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn('API createStudent failed:', e);
      return null;
    }
  },

  async createShop(shop: Shopkeeper): Promise<Shopkeeper | null> {
    if (!API_URL) return null;
    try {
      const res = await fetch(`${API_URL}/shops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shop),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn('API createShop failed:', e);
      return null;
    }
  },
};
