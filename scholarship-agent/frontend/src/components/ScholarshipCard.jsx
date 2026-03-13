import React from 'react';
import { CheckCircle, XCircle, Send, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ScholarshipCard({ scholarship, onApprove, onReject, onPublish, loading }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-primary">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-2">{scholarship.title}</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              🌍 {scholarship.country}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              📚 {scholarship.degree_level}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              💰 {scholarship.funding_type}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{scholarship.relevance_score}/10</div>
          <div className="text-xs text-gray-500">Relevance</div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{scholarship.description}</p>

      <div className="bg-gray-50 p-3 rounded mb-4 text-sm">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">📅 Deadline:</span>
          <span className="font-semibold text-gray-800">{scholarship.deadline}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">⏰ Found:</span>
          <span className="text-gray-600">{formatDistanceToNow(new Date(scholarship.date_found), { addSuffix: true })}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onApprove(scholarship.id)}
          disabled={loading}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <CheckCircle size={18} />
          Approve
        </button>
        <button
          onClick={() => onPublish(scholarship.id)}
          disabled={loading}
          className="flex-1 bg-primary hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <Send size={18} />
          Publish
        </button>
        <button
          onClick={() => onReject(scholarship.id)}
          disabled={loading}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <XCircle size={18} />
          Reject
        </button>
      </div>

      <a
        href={scholarship.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block text-center text-primary hover:text-indigo-700 text-sm font-semibold flex items-center justify-center gap-2"
      >
        <Eye size={16} />
        View Source
      </a>
    </div>
  );
}
