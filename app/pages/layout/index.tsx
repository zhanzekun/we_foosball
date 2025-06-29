'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface TabItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

const tabItems: TabItem[] = [
  { id: 'match', label: '匹配', icon: '🎯', path: '/match' },
  { id: 'ranking', label: '排行', icon: '🏆', path: '/ranking' },
  { id: 'data', label: '数据', icon: '📊', path: '/data' },
  { id: 'profile', label: '个人', icon: '👤', path: '/profile' },
];

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 主内容区域 */}
      <main className="flex-1 overflow-y-auto pb-16">
        {children}
      </main>

      {/* 底部 Tabbar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          {tabItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.path)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
