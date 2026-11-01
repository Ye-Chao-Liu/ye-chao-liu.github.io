import { defineConfig } from 'astro/config';
export default defineConfig({
  output: 'static',
  devToolbar: { enabled: false },
  site: 'https://ye-chao-liu.github.io',
  trailingSlash: 'always',
});

