import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { toggleTheme } from '../utils/theme';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark'; // Valor por defecto si window no está definido
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localTheme = localStorage.getItem('theme');
      if (localTheme) {
        setTheme(localTheme);
      } else {
        localStorage.setItem('theme', theme);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleToggleClick = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <style>
        {`
          #themeToggle {
            border: 0;
            background: none;
          }
          .sun { fill: ${theme === 'dark' ? 'transparent' : 'black'}; }
          .moon { fill: ${theme === 'light' ? 'transparent' : 'white'}; }
        `}
      </style>
      <button id="themeToggle" type="button" aria-label="Theme toggle" onClick={handleToggleClick}>
        <svg width="32px" fill-rule="evenodd" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path class="sun" d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
          <path class="moon" d="M16.5 6A10.5 10.5 0 0 1 4.7 16.4 8.5 8.5 0 1 0 16.4 4.7l.1 1.3zm-1.7-2a9 9 0 0 1 .2 2 9 9 0 0 1-11 8.8 9.4 9.4 0 0 1-.8-.3c-.4 0-.8.3-.7.7a10 10 0 0 0 .3.8 10 10 0 0 0 9.2 6 10 10 0 0 0 4-19.2 9.7 9.7 0 0 0-.9-.3c-.3-.1-.7.3-.6.7a9 9 0 0 1 .3.8z" fill-rule="evenodd"/>
        </svg>
      </button>
    </>
  );
};

export default ThemeToggle;
