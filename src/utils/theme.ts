export function getInitialTheme() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') || 'dark';
  }
  return 'dark';
}

export function toggleTheme() {
  const currentTheme = getInitialTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  if (typeof window !== 'undefined') {
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  }
}
