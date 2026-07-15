// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://cellularrealty.in',
  // Static by default; the lead API endpoint opts into on-demand via `prerender = false`.
  // Swap this adapter for @astrojs/cloudflare or @astrojs/vercel at deploy time.
  adapter: node({ mode: 'standalone' }),
  integrations: [preact({ compat: true }), sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    locales: ['en', 'hi'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
      // Hindi (hi) is scaffolded but not built until Phase 2 launch.
    },
  },
  image: {
    // Allow local project assets; responsive variants generated at build.
    responsiveStyles: true,
  },
});
