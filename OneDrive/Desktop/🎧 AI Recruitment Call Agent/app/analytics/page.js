'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatsCard from '@/components/dashboard/StatsCard';
import { getAnalytics } from '@/lib/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [skills, setSkills] = useState([]);
  const [countries, setCountries] = useState([]);
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const data = await getAnalytics(period);
        setStats(data.stats);
        setTrends(data.trends.reverse());
        setSkills(data.skills);
        setCountries(data.countries);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [period]);

  if (loading) {
    return (
      <Layout title="Analytics" subtitle="Recruitment trends and insights">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Analytics" subtitle="Recruitment trends and insights">
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

      <Card className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Candidate Trends</h2>
          <div className="flex gap-2">
            <Button
              variant={period === 'daily' ? 'primary' : 'secondary'}
              onClick={() => setPeriod('daily')}
            >
              Daily
            </Button>
            <Button
              variant={period === 'weekly' ? 'primary' : 'secondary'}
              onClick={() => setPeriod('weekly')}
            >
              Weekly
            </Button>
            <Button
              variant={period === 'monthly' ? 'primary' : 'secondary'}
              onClick={() => setPeriod('monthly')}
            >
              Monthly
            </Button>
          </div>
        </div>

        {trends.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No trend data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="agree" stroke="#10b981" name="Approved" strokeWidth={3} />
              <Line type="monotone" dataKey="disagree" stroke="#ef4444" name="Rejected" strokeWidth={3} />
              <Line type="monotone" dataKey="total" stroke="#f97316" name="Total" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">Top Skills</h2>
          {skills.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No skills data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skills}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skills" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="url(#colorGradient)" />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">Country Preferences</h2>
          {countries.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No country data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="preferred_country" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="url(#colorGradient2)" />
                <defs>
                  <linearGradient id="colorGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </Layout>
  );
}
