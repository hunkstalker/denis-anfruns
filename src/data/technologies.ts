export interface Technology {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'mobile' | 'devops' | 'ai' | 'language';
  color?: string; // Color for badges
  lightColor?: string; // Lighter color for unselected state (useful for dark colors)
}

export const technologies: Record<string, Technology> = {
  // Frontend Frameworks & Libraries
  'react': { id: 'react', name: 'React', category: 'frontend', color: '#61DAFB' },
  'svelte': { id: 'svelte', name: 'Svelte', category: 'frontend', color: '#FF3E00' },
  'astro': { id: 'astro', name: 'Astro', category: 'frontend', color: '#FF5D01' },
  'd3': { id: 'd3', name: 'D3.js', category: 'frontend', color: '#F9A03C' },
  'tailwind': { id: 'tailwind', name: 'Tailwind', category: 'frontend', color: '#06B6D4' },
  
  // Backend Frameworks & Tools
  'nodejs': { id: 'nodejs', name: 'Node.js', category: 'backend', color: '#339933' },
  'express': { id: 'express', name: 'Express', category: 'backend', color: '#000000', lightColor: '#9CA3AF' },
  'aspnet': { id: 'aspnet', name: 'ASP.NET', category: 'backend', color: '#512BD4' },
  'native-web-api': { id: 'native-web-api', name: 'Native Web API', category: 'backend', color: '#5A67D8' },
  
  // Database & Storage
  'firebase': { id: 'firebase', name: 'Firebase', category: 'database', color: '#b38600' },
  'd1': { id: 'd1', name: 'D1', category: 'database', color: '#b38600'},
  'kv': { id: 'kv', name: 'KV', category: 'database', color: '#000000', lightColor: '#9CA3AF' },
  'entity-framework': { id: 'entity-framework', name: 'Entity Framework', category: 'database', color: '#512BD4' },
  
  // Mobile
  'mobile': { id: 'mobile', name: 'Mobile', category: 'mobile', color: '#34A853' },
  
  // DevOps & Infrastructure
  'cloudflare-workers': { id: 'cloudflare-workers', name: 'Cloudflare Workers', category: 'devops', color: '#F38020' },
  
  // AI & ML
  'openai': { id: 'openai', name: 'OpenAI', category: 'ai', color: '#10A37F' },
  
  // Programming Languages
  'typescript': { id: 'typescript', name: 'TypeScript', category: 'language', color: '#3178C6' },
  'python': { id: 'python', name: 'Python', category: 'language', color: '#3776AB' },
};

export const categories = {
  frontend: { name: 'Frontend', icon: '🎨', color: '#61DAFB' },
  backend: { name: 'Backend', icon: '⚙️', color: '#339933' },
  database: { name: 'Database', icon: '💾', color: '#FFCA28' },
  mobile: { name: 'Mobile', icon: '📱', color: '#34A853' },
  devops: { name: 'DevOps', icon: '🚀', color: '#F38020' },
  ai: { name: 'AI', icon: '🤖', color: '#10A37F' },
  language: { name: 'Languages', icon: '💻', color: '#3178C6' },
};

// Helper to get technology object by ID
export function getTechnology(id: string): Technology | undefined {
  return technologies[id];
}

// Helper to get all technologies in a category
export function getTechnologiesByCategory(category: keyof typeof categories): Technology[] {
  return Object.values(technologies).filter(tech => tech.category === category);
}

// Helper to get all unique categories from a list of tech IDs
export function getCategoriesFromTechIds(techIds: string[]): (keyof typeof categories)[] {
  const categorySet = new Set<keyof typeof categories>();
  techIds.forEach(id => {
    const tech = getTechnology(id);
    if (tech) categorySet.add(tech.category);
  });
  return Array.from(categorySet);
}
