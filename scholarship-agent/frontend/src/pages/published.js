import React, { useState, useEffect } from 'react';
import { useScholarshipStore } from '@/utils/store';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import ScholarshipCard from '@/components/ScholarshipCard';
import toast from 'react-hot-toast';

export default function Published() {
  const [published, setPublished] = useState([]);
  const [loading, setLoading] = useState(true);
  const { triggerScrape } = useScholarshipStore();

  useEffect(() => {
    fetchPublished();
  }, []);

  const fetchPublished = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/scholarships?status=posted&limit=100`
      );
      const data = await response.json();
      setPublished(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch published scholarships');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onScrape={triggerScrape} loading={loading} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          ✅ Published Scholarships ({published.length})
        </h2>

        {published.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No published scholarships yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {published.map((scholarship) => (
              <div
                key={scholarship.id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">{scholarship.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    🌍 {scholarship.country}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    📚 {scholarship.degree_level}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{scholarship.description}</p>
                <div className="text-xs text-gray-500">
                  Posted: {new Date(scholarship.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
