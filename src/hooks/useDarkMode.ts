import { useState, useEffect } from 'react';

const getInitialMode = () => {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    const savedMode = window.localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  }
  return false;
};

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(getInitialMode);

  useEffect(() => {
    // Only access localStorage in useEffect (client-side only)
    window.localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return { isDarkMode, toggleDarkMode };
}