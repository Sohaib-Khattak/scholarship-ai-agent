export default function Badge({ status, className = '' }) {
  const styles = {
    AGREE: 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200',
    DISAGREE: 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${styles[status] || 'bg-gray-100 text-gray-800 border border-gray-200'} ${className}`}>
      {status}
    </span>
  );
}
