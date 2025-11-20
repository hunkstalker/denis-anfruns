export interface Project {
  title: string;
  progress: number;
  description: string;
  tags: string[]; // Technology IDs from technologies.ts
  images: string[];
  link?: string;
}

export const projects: Project[] = [
  {
    title: 'TPRESTO - Inventory HQ',
    progress: 50,
    description: 'Proyecto de gestión de intercambio de videojuegos.',
    tags: ['astro', 'svelte', 'native-web-api', 'cloudflare-workers', 'd1', 'kv', 'tailwind'],
    images: [
      '/images/projects/tpresto_1.png',
      '/images/projects/tpresto_2.png',
      '/images/projects/tpresto_3.png'
    ]
  },
  {
    title: 'HOBBY TRACKING',
    progress: 0,
    description: 'App para hacer el seguimiento de juegos terminados con representaación de datos y gráficos',
    tags: ['react', 'd1', 'typescript', 'tailwind'],
    images: [
      '/images/projects/hooby_1.png',
      '/images/projects/hooby_2.png',
      '/images/projects/hooby_3.png'
    ]
  },
  {
    title: 'STEAM VIDEO',
    progress: 0,
    description: 'Un Netflix con las ideas de Steam',
    tags: ['aspnet', 'react', 'entity-framework', 'tailwind'],
    images: [
      '/images/projects/steamvideo_1.png',
      'https://placehold.co/1200x600/4a4a4a/ffffff?text=SteamVideo+Screen+2',
      'https://placehold.co/1200x600/3a3a3a/ffffff?text=SteamVideo+Screen+3'
    ]
  },
  {
    title: 'MATCHapp',
    progress: 0,
    description: 'Aplicación social para conocer gente compartiendo tus "feels"',
    tags: ['react', 'firebase', 'mobile', 'tailwind'],
    images: [
      'https://placehold.co/1200x600/4a4a4a/ffffff?text=Matchapp+Screen+1',
      'https://placehold.co/1200x600/5a5a5a/ffffff?text=Matchapp+Screen+2',
      'https://placehold.co/1200x600/4a4a4a/ffffff?text=Matchapp+Screen+3'
    ]
  },
  {
    title: 'MicroServices',
    progress: 0,
    description: 'Microservices API gateway built with Node.js and Express. Handles rate limiting and auth.',
    tags: ['aspnet', 'react', 'entity-framework', 'tailwind'],
    images: [
      'https://placehold.co/1200x600/5a5a5a/ffffff?text=MicroServices+Editor',
      'https://placehold.co/1200x600/6a6a6a/ffffff?text=MicroServices+Demo',
      'https://placehold.co/1200x600/5a5a5a/ffffff?text=MicroServices+Physics'
    ]
  },
  {
    title: 'API Gateway',
    progress: 0,
    description: 'Microservices API gateway built with Node.js and Express. Handles rate limiting and auth.',
    tags: ['nodejs', 'express', 'tailwind'],
    images: [
      'https://placehold.co/1200x600/6a6a6a/ffffff?text=API+Gateway+Dashboard',
      'https://placehold.co/1200x600/7a7a7a/ffffff?text=API+Gateway+Metrics',
      'https://placehold.co/1200x600/6a6a6a/ffffff?text=API+Gateway+Logs'
    ]
  },
  {
    title: 'AI Chatbot',
    progress: 0,
    description: 'Intelligent customer support chatbot using OpenAI API and Python. Integrates with Slack and Discord.',
    tags: ['python', 'openai', 'tailwind'],
    images: [
      'https://placehold.co/1200x600/7a7a7a/ffffff?text=AI+Chatbot+Interface',
      'https://placehold.co/1200x600/8a8a8a/ffffff?text=AI+Chatbot+Training',
      'https://placehold.co/1200x600/7a7a7a/ffffff?text=AI+Chatbot+Analytics'
    ]
  }
];
