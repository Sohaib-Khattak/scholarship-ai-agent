import React from 'react';
import { TrendingUp, Clock, CheckCircle, Send } from 'lucide-react';

export default function StatsCard({ stats }) {
  const statCards = [
    {
      label: 'Total Found',
      value: stats?.total || 0,
      icon: TrendingUp,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    {
      label: 'Pending Review',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-100',
      textColor: 'text-yellow-700'
    },
    {
      label: 'Approved',
      value: stats?.approved || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
    {
      label: 'Published',
      value: stats?.posted || 0,
      icon: Send,
      color: 'bg-primary',
      lightColor: 'bg-indigo-100',
      textColor: 'text-primary'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
              </div>
              <div className={`${card.lightColor} p-3 rounded-lg`}>
                <Icon className={`${card.textColor}`} size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
