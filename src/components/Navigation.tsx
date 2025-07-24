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
    <div className="flex space-x-1">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          href={tab.path}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            pathname === tab.path
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          {tab.name}
        </Link>
      ))}
    </div>
  );
}