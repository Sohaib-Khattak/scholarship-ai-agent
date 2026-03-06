const API_BASE = '/api';

export async function getCandidates(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE}/candidates?${params}`);
  if (!response.ok) throw new Error('Failed to fetch candidates');
  return response.json();
}

export async function getCandidateById(id) {
  const response = await fetch(`${API_BASE}/candidates/${id}`);
  if (!response.ok) throw new Error('Failed to fetch candidate');
  return response.json();
}

export async function getAnalytics(period = 'daily') {
  const response = await fetch(`${API_BASE}/analytics?period=${period}`);
  if (!response.ok) throw new Error('Failed to fetch analytics');
  return response.json();
}

export async function getSettings() {
  const response = await fetch(`${API_BASE}/settings`);
  if (!response.ok) throw new Error('Failed to fetch settings');
  return response.json();
}

export async function updateSettings(data) {
  const response = await fetch(`${API_BASE}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update settings');
  return response.json();
}

export async function initDatabase() {
  const response = await fetch(`${API_BASE}/init`);
  if (!response.ok) throw new Error('Failed to initialize database');
  return response.json();
}
