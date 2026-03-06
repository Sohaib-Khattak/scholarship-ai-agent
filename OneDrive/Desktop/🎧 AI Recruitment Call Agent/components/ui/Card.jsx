export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}
