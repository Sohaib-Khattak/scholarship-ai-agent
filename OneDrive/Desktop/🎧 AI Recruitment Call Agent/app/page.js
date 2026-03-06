'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import StatsCard from '@/components/dashboard/StatsCard';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { getCandidates, getAnalytics } from '@/lib/api';
import { format } from 'date-fns';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [analyticsData, candidatesData] = await Promise.all([
          getAnalytics(),
          getCandidates({ limit: 5 })
        ]);

        setStats(analyticsData.stats);
        setRecentCandidates(candidatesData.candidates);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout title="Dashboard" subtitle="Overview of recruitment activities">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard" subtitle="Overview of recruitment activities">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Candidates"
          value={stats?.total || 0}
          icon="👥"
        />
        <StatsCard
          title="Approved"
          value={stats?.agree || 0}
          icon="✅"
        />
        <StatsCard
          title="Rejected"
          value={stats?.disagree || 0}
          icon="❌"
        />
        <StatsCard
          title="Success Rate"
          value={`${stats?.successRate || 0}%`}
          icon="📊"
        />
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Recent Candidates</h2>
          <Link href="/candidates" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
            View All →
          </Link>
        </div>

        {recentCandidates.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No candidates yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Skills</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Result</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Confidence</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentCandidates.map((candidate) => (
                  <tr key={candidate.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link href={`/candidates/${candidate.id}`} className="text-secondary-600 hover:text-secondary-700 font-medium transition-colors">
                        {candidate.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{candidate.skills || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <Badge status={candidate.evaluation_result} />
                    </td>
                    <td className="py-3 px-4 text-gray-600">{candidate.confidence_score}%</td>
                    <td className="py-3 px-4 text-gray-600">
                      {format(new Date(candidate.call_timestamp), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </Layout>
  );
}
