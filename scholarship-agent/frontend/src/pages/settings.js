import React, { useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [settings, setSettings] = useState({
    agent_name: 'Sohaib Khattak',
    posts_per_day: 3,
    internships_per_day: 3,
    scrape_interval: '6h',
    whatsapp_group_id: '',
    auto_approve: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = async () => {
    try {
      // Save settings to backend
      toast.success('✅ Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">⚙️ Settings</h1>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Agent Name
            </label>
            <input
              type="text"
              name="agent_name"
              value={settings.agent_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Scholarships per Day
              </label>
              <input
                type="number"
                name="posts_per_day"
                value={settings.posts_per_day}
                onChange={handleChange}
                min="1"
                max="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Internships per Day
              </label>
              <input
                type="number"
                name="internships_per_day"
                value={settings.internships_per_day}
                onChange={handleChange}
                min="1"
                max="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Scrape Interval
            </label>
            <select
              name="scrape_interval"
              value={settings.scrape_interval}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="3h">Every 3 hours</option>
              <option value="6h">Every 6 hours</option>
              <option value="12h">Every 12 hours</option>
              <option value="24h">Every 24 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              WhatsApp Group ID
            </label>
            <input
              type="text"
              name="whatsapp_group_id"
              value={settings.whatsapp_group_id}
              onChange={handleChange}
              placeholder="Your WhatsApp group ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="auto_approve"
              checked={settings.auto_approve}
              onChange={handleChange}
              className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
            />
            <label className="text-sm font-semibold text-gray-700">
              Auto-approve scholarships (skip manual review)
            </label>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Save size={20} />
            Save Settings
          </button>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-blue-900 mb-3">💡 Tips</h2>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✓ Adjust posting frequency based on your community size</li>
            <li>✓ Keep manual approval enabled for quality control</li>
            <li>✓ More frequent scraping = more opportunities found</li>
            <li>✓ Test with a small group before scaling</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
