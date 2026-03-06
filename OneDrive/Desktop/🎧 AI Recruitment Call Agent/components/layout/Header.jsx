export default function Header({ title, subtitle }) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">{title}</h1>
      {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
    </header>
  );
}
