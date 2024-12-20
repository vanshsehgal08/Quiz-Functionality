import React from 'react';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomeButton() {
  return (
    <Link
      to="/"
      className="fixed bottom-6 right-6 p-4 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50"
      aria-label="Go to home"
    >
      <Home className="h-6 w-6 text-white" />
    </Link>
  );
}