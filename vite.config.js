import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const entry = path => fileURLToPath(new URL(path, import.meta.url));

// Static pages: the app at /deeptalk/, plus the product page and the two legal
// documents. Each of those is built twice — as <name>.html and as <name>/index.html —
// so /deeptalk/<name> resolves whichever shape the host prefers.
export default defineConfig({
  plugins: [react()],
  base: '/deeptalk/',
  build: {
    rollupOptions: {
      input: {
        main: entry('./index.html'),
        about: entry('./about.html'),
        aboutIndex: entry('./about/index.html'),
        terms: entry('./terms.html'),
        termsIndex: entry('./terms/index.html'),
        privacy: entry('./privacy.html'),
        privacyIndex: entry('./privacy/index.html')
      }
    }
  }
});
