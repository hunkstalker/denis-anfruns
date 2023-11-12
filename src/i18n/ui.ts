export const languages = {
  es: 'Espñaol',
  ca: 'Català',
  en: 'English',
};

export const defaultLang = 'en';

export const ui = {
  es: {
    'nav.projects': 'proyectos',
    'nav.videogames': 'videojuegos',
    'nav.devblog': 'dev blog',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.astro': 'Impulsado por ',
  },
  ca: {
    'nav.projects': 'projectes',
    'nav.videogames': 'videojocs',
    'nav.devblog': 'dev blog',
    'footer.rights': 'Tots els drets reservats.',
    'footer.astro': 'Impulsat per ',
  },
  en: {
    'nav.projects': 'projects',
    'nav.videogames': 'video games',
    'nav.devblog': 'dev blog',
    'footer.rights': 'All rights reserved.',
    'footer.astro': 'Powered by ',
  },
} as const;