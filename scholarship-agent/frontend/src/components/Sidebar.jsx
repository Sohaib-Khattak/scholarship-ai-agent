import React, { useState } from 'react';
import { Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { label: 'Dashboard', icon: '📊', href: '/' },
    { label: 'Pending Review', icon: '⏳', href: '/pending' },
    { label: 'Published', icon: '✅', href: '/published' },
    { label: 'Analytics', icon: '📈', href: '/analytics' },
    { label: 'Settings', icon: '⚙️', href: '/settings' },
  ];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-primary to-secondary text-white transition-all duration-300 min-h-screen shadow-lg`}>
      <div className="p-4 flex items-center justify-between">
        {isOpen && <h2 className="text-xl font-bold">🎓 Agent</h2>}
        <button onClick={() => setIsOpen(!isOpen)} className="hover:bg-white/20 p-2 rounded">
          {isOpen ? '←' : '→'}
        </button>
      </div>

      <nav className="mt-8">
        {menuItems.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            className="flex items-center gap-4 px-4 py-3 hover:bg-white/20 transition-colors"
          >
            <span className="text-2xl">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </a>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button className="w-full flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
          <LogOut size={18} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
