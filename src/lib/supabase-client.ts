// Cliente Supabase para el navegador (dashboard). Usa la anon key + RLS:
// el usuario solo ve datos de su organización. Las operaciones que necesitan
// la API key de PageSpeed o lógica de servidor pasan por /api/app/* con el JWT.
import { createClient, type Session } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL as string;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// Exige sesión; si no hay, manda al login (guardando a dónde iba).
export async function requireAuth(): Promise<Session> {
  const s = await getSession();
  if (!s) {
    const next = encodeURIComponent(location.pathname + location.search);
    location.href = '/app/login?next=' + next;
    throw new Error('sin sesión');
  }
  return s;
}

export async function signOut() {
  await supabase.auth.signOut();
  location.href = '/app/login';
}

// Llama a una función serverless firmando con el JWT del usuario.
export async function api(path: string, opts: { method?: string; body?: any } = {}) {
  const s = await getSession();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (s) headers.Authorization = 'Bearer ' + s.access_token;
  const r = await fetch(path, {
    method: opts.method || 'GET',
    headers,
    body: opts.body != null ? JSON.stringify(opts.body) : undefined,
  });
  let body: any = {};
  try { body = await r.json(); } catch { /* vacío */ }
  return { status: r.status, ok: r.ok, body };
}
