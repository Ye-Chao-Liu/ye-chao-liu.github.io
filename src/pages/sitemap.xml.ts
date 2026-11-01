import type { APIRoute } from 'astro';
import { site } from '../data/site';

export const GET: APIRoute = ({ site: origin }) => new Response(
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
  site.navigation.map(({ path }) => `<url><loc>${new URL(path, origin).href}</loc></url>`).join('') +
  '</urlset>',
  { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
);
