import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const useScholarshipStore = create((set, get) => ({
  scholarships: [],
  pending: [],
  stats: null,
  loading: false,
  error: null,

  fetchPending: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/approvals/pending`);
      set({ pending: response.data.data, error: null });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/scholarships/stats/overview`);
      set({ stats: response.data.stats });
    } catch (error) {
      set({ error: error.message });
    }
  },

  approveScholarship: async (id) => {
    try {
      await axios.post(`${API_URL}/approvals/approve/${id}`);
      await get().fetchPending();
      await get().fetchStats();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  rejectScholarship: async (id) => {
    try {
      await axios.post(`${API_URL}/approvals/reject/${id}`);
      await get().fetchPending();
      await get().fetchStats();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  publishScholarship: async (id) => {
    try {
      await axios.post(`${API_URL}/approvals/approve-publish/${id}`);
      await get().fetchPending();
      await get().fetchStats();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  triggerScrape: async () => {
    try {
      await axios.post(`${API_URL}/agents/scrape`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}));
