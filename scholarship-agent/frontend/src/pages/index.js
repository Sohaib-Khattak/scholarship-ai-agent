import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import ScholarshipCard from '@/components/ScholarshipCard';
import { useScholarshipStore } from '@/utils/store';

export default function Home() {
  const {
    pending,
    stats,
    loading,
    fetchPending,
    fetchStats,
    approveScholarship,
    rejectScholarship,
    publishScholarship,
    triggerScrape
  } = useScholarshipStore();

  useEffect(() => {
    fetchPending();
    fetchStats();

    const interval = setInterval(() => {
      fetchPending();
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <Header onScrape={triggerScrape} loading={loading} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <StatsCard stats={stats} />

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            ⏳ Pending Approval ({pending.length})
          </h2>

          {pending.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">✨ No pending scholarships. All caught up!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pending.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  onApprove={approveScholarship}
                  onReject={rejectScholarship}
                  onPublish={publishScholarship}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
