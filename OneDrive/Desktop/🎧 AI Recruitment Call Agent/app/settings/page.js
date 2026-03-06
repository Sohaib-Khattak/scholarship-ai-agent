'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { getSettings, updateSettings, initDatabase } from '@/lib/api';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    assistant_id: '',
    api_key: '',
    environment_mode: 'sandbox',
  });
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSettings();
        if (data.settings) {
          setSettings({
            assistant_id: data.settings.assistant_id || '',
            api_key: '',
            environment_mode: data.settings.environment_mode || 'sandbox',
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const data = await updateSettings(settings);
      setWebhookUrl(data.webhook_url);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleInitDatabase = async () => {
    try {
      await initDatabase();
      setMessage({ type: 'success', text: 'Database initialized successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to initialize database.' });
    }
  };

  if (loading) {
    return (
      <Layout title="Settings" subtitle="Configure your AI recruitment assistant">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Settings" subtitle="Configure your AI recruitment assistant">
      <div className="max-w-3xl">
        <Card className="mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">Assistant Configuration</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assistant ID
              </label>
              <input
                type="text"
                value={settings.assistant_id}
                onChange={(e) => setSettings({ ...settings, assistant_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter your assistant ID"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                API Key
              </label>
              <input
                type="password"
                value={settings.api_key}
                onChange={(e) => setSettings({ ...settings, api_key: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter your API key"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Your API key will be encrypted before storage</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Environment Mode
              </label>
              <select
                value={settings.environment_mode}
                onChange={(e) => setSettings({ ...settings, environment_mode: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="sandbox">Sandbox</option>
                <option value="production">Production</option>
              </select>
            </div>

            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </Card>

        {webhookUrl && (
          <Card className="mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">Webhook URL</h2>
            <p className="text-sm text-gray-600 mb-2">Use this URL in your AI assistant configuration:</p>
            <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm break-all">
              {webhookUrl}
            </div>
          </Card>
        )}

        <Card>
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">Database Management</h2>
          <p className="text-gray-600 mb-4">
            Initialize the database tables if this is your first time setting up the application.
          </p>
          <Button variant="secondary" onClick={handleInitDatabase}>
            Initialize Database
          </Button>
        </Card>
      </div>
    </Layout>
  );
}
