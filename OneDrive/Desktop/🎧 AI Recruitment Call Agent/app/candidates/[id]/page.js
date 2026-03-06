'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { getCandidateById } from '@/lib/api';
import { format } from 'date-fns';

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCandidate() {
      try {
        const data = await getCandidateById(params.id);
        setCandidate(data.candidate);
      } catch (error) {
        console.error('Error fetching candidate:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchCandidate();
    }
  }, [params.id]);

  if (loading) {
    return (
      <Layout title="Candidate Details" subtitle="Loading candidate information">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!candidate) {
    return (
      <Layout title="Candidate Not Found" subtitle="The requested candidate could not be found">
        <Card>
          <p className="text-gray-500 text-center py-12">Candidate not found</p>
          <div className="flex justify-center mt-4">
            <Button onClick={() => router.push('/candidates')}>
              ← Back to Candidates
            </Button>
          </div>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout title={candidate.name} subtitle="Candidate Profile">
      <div className="mb-4">
        <Button variant="secondary" onClick={() => router.push('/candidates')}>
          ← Back to Candidates
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">Personal Information</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-600">Name</label>
                <p className="text-gray-900 mt-1">{candidate.name}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Age</label>
                <p className="text-gray-900 mt-1">{candidate.age || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Qualification</label>
                <p className="text-gray-900 mt-1">{candidate.qualification || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Experience</label>
                <p className="text-gray-900 mt-1">{candidate.experience || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Preferred Country</label>
                <p className="text-gray-900 mt-1">{candidate.preferred_country || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Expected Salary</label>
                <p className="text-gray-900 mt-1">{candidate.expected_salary || 'N/A'}</p>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-600">Skills</label>
              <p className="text-gray-900 mt-1">{candidate.skills || 'N/A'}</p>
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-600">Summary</label>
              <p className="text-gray-900 mt-1">{candidate.summary_text || 'No summary available'}</p>
            </div>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">Evaluation</h2>

            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-600">Result</label>
              <div className="mt-2">
                <Badge status={candidate.evaluation_result} />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-600">Confidence Score</label>
              <div className="mt-2">
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                      style={{ width: `${candidate.confidence_score}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-900 font-semibold">{candidate.confidence_score}%</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">Call Information</h2>

            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-600">Call ID</label>
              <p className="text-gray-900 mt-1 text-sm font-mono">{candidate.call_id}</p>
            </div>

            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-600">Call Date</label>
              <p className="text-gray-900 mt-1">
                {format(new Date(candidate.call_timestamp), 'MMMM dd, yyyy')}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Call Time</label>
              <p className="text-gray-900 mt-1">
                {format(new Date(candidate.call_timestamp), 'HH:mm:ss')}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
