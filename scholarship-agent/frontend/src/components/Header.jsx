import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Header({ onScrape, loading }) {
  const [scraping, setScraping] = useState(false);

  const handleScrape = async () => {
    setScraping(true);
    const result = await onScrape();
    if (result.success) {
      toast.success('🔍 Scraping started! Check back in a few minutes.');
    } else {
      toast.error('Failed to start scraping');
    }
    setScraping(false);
  };

  return (
    <header className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">🎓 Scholarship Agent</h1>
            <p className="text-indigo-100">Powered by Sohaib Khattak ✨</p>
          </div>
          <button
            onClick={handleScrape}
            disabled={scraping || loading}
            className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 shadow-lg"
          >
            <RefreshCw size={20} className={scraping ? 'animate-spin' : ''} />
            {scraping ? 'Scraping...' : 'Manual Scrape'}
          </button>
        </div>
      </div>
    </header>
  );
}
