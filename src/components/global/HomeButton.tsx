import React from 'react';
import { Home } from 'lucide-react';

export default function HomeButton() {
  return (
    <a
      href="https://green-quest-zeta.vercel.app/"
      className="fixed bottom-6 right-6 p-4 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50"
      aria-label="Go to home"
      rel="noopener noreferrer" // Security best practice when opening external links
    >
      <Home className="h-6 w-6 text-white" />
    </a>
  );
}
