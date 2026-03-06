import Card from '../ui/Card';

export default function StatsCard({ title, value, icon, trend, trendValue }) {
  return (
    <Card className="hover:scale-105 transition-transform duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </p>
          )}
        </div>
        <div className="text-5xl opacity-80">{icon}</div>
      </div>
    </Card>
  );
}
