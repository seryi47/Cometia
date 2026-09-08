import type { APIRoute } from 'astro';
import { LUGARES } from '../data/guia/lugares';

// Índice ligero para el buscador del cliente (nombre, slug, zona, tipo).
export const GET: APIRoute = () => {
  const data = LUGARES.map((l) => ({ n: l.name, s: l.slug, z: l.zone, t: l.type }));
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
