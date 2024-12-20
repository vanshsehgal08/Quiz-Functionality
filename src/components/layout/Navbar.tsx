"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import NavLinks from './NavLinks';

export default function Navbar() {
  const currentPath = usePathname();

  return (
    <nav className="bg-green-600 dark:bg-green-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8" />
            <span className="font-bold text-xl">GreenQuest</span>
          </Link>
          <div className="flex items-center space-x-4">
            <NavLinks currentPath={currentPath} />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
