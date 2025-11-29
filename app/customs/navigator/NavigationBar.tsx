// frontend/app/components/NavigationBar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, MessageSquare, User } from 'lucide-react';

export default function NavigationBar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/article', label: 'Article', icon: FileText },
    { href: '/chat', label: 'Chat with Author', icon: MessageSquare },
    { href: '/about', label: 'About', icon: User }
  ];

  return (
    <nav className="w-full bg-slate-900 text-white shadow-lg">
      <div className="w-full px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo/Brand */}
          <Link 
            href="/" 
            className="text-xl font-bold hover:opacity-80 transition-opacity"
          >
            JCUS.link
          </Link>
          
          {/* Center: Menu Items */}
          <div className="flex space-x-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-white bg-opacity-20'
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          
          {/* Right: Empty space for future features */}
          <div className="w-24"></div>
        </div>
      </div>
    </nav>
  );
}