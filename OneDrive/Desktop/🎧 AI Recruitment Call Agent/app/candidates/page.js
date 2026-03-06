'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { getCandidates } from '@/lib/api';
import { format } from 'date-fns';
import Link from 'next/link';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [offset, setOffset] = useState(0);
  const limit = 20;

  useEffect(() => {
    async function fetchCandidates() {
      setLoading(true);
      try {
        const params = { limit, offset };
        if (filter) params.evaluation_result = filter;

        const data = await getCandidates(params);
        setCandidates(data.candidates);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCandidates();
  }, [filter, offset]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setOffset(0);
  };

  return (
    <Layout title="Candidates" subtitle="All recruitment call candidates">
      <div className="mb-6 flex gap-4">
        <Button
          variant={filter === '' ? 'primary' : 'secondary'}
          onClick={() => handleFilterChange('')}
        >
          All
        </Button>
        <Button
          variant={filter === 'AGREE' ? 'primary' : 'secondary'}
          onClick={() => handleFilterChange('AGREE')}
        >
          Approved
        </Button>
        <Button
          variant={filter === 'DISAGREE' ? 'primary' : 'secondary'}
          onClick={() => handleFilterChange('DISAGREE')}
        >
          Rejected
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : candidates.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No candidates found</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Age</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Skills</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Experience</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Result</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Confidence</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Link href={`/candidates/${candidate.id}`} className="text-secondary-600 hover:text-secondary-700 font-medium transition-colors">
                          {candidate.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{candidate.age || 'N/A'}</td>
                      <td className="py-3 px-4 text-gray-600">{candidate.skills || 'N/A'}</td>
                      <td className="py-3 px-4 text-gray-600">{candidate.experience || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <Badge status={candidate.evaluation_result} />
                      </td>
                      <td className="py-3 px-4 text-gray-600">{candidate.confidence_score}%</td>
                      <td className="py-3 px-4 text-gray-600">
                        {format(new Date(candidate.call_timestamp), 'MMM dd, yyyy HH:mm')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6">
              <Button
                variant="secondary"
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
              >
                ← Previous
              </Button>
              <span className="text-gray-600">
                Showing {offset + 1} - {offset + candidates.length}
              </span>
              <Button
                variant="secondary"
                onClick={() => setOffset(offset + limit)}
                disabled={candidates.length < limit}
              >
                Next →
              </Button>
            </div>
          </>
        )}
      </Card>
    </Layout>
  );
}
