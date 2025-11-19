import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import inline from '@playform/inline';

// https://astro.build/config
export default defineConfig({
  site: 'https://denis-anfruns.dev',
  integrations: [tailwind(), react(), inline()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'ca'],
    routing: {
      prefixDefaultLocale: false
    }
  },
});