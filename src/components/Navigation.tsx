'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();
  const tabs = [
    { name: 'Excel', path: '/' },
    { name: 'Assistant', path: '/assistant' },
    { name: 'SQL', path: '/sql' }
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-xl shadow-lg p-2 inline-flex">
        {tabs.map((tab, index) => (
          <Link
            key={tab.path}
            href={tab.path}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
              pathname === tab.path 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            } ${index === 0 ? 'rounded-l-lg' : ''} ${index === tabs.length - 1 ? 'rounded-r-lg' : ''}`}
          >
            {tab.name}
          </Link>
        ))}
      </div>
    </div>
  );
} 