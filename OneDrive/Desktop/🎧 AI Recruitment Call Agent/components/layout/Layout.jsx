'use client';

import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <Header title={title} subtitle={subtitle} />
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
