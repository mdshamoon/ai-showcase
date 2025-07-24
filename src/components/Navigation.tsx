'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();
  const tabs = [
    { name: 'Chat with Excel', path: '/' },
    { name: 'Assistant', path: '/assistant' },
    { name: 'Generate SQL', path: '/sql' }
  ];

  return (
    <div className="flex space-x-2">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          href={tab.path}
          className={`px-6 py-3 rounded-lg text-base font-semibold transition-all duration-200 border ${
            pathname === tab.path
              ? 'bg-blue-600 text-white shadow-lg border-blue-600 transform scale-105'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-gray-200 hover:border-blue-300 hover:shadow-md'
          }`}
        >
          {tab.name}
        </Link>
      ))}
    </div>
  );
}