"use client";

import React from 'react';
import Link from 'next/link';
import { MAIN_NAVIGATION } from '../../constants/navigation';

interface NavLinksProps {
  currentPath: string;
}

export default function NavLinks({ currentPath }: NavLinksProps) {
  const isActive = (path: string) => {
    return currentPath === path
      ? 'text-green-200'
      : 'text-white hover:text-green-200';
  };

  return (
    <div className="hidden md:flex space-x-8">
      {MAIN_NAVIGATION.map(({ path, label }) => (
        <Link
          key={path}
          href={path}
          className={`transition-colors ${isActive(path)}`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
