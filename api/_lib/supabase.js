// ============================================================================
// Cometia — Cliente Supabase para funciones serverless.
//   · serviceClient(): salta RLS (para cron/análisis/escrituras del sistema).
//   · userFromRequest(): verifica el JWT del usuario (dashboard) y devuelve el
//     usuario autenticado. El aislamiento entre organizaciones lo garantiza RLS.
// ============================================================================
import { createClient } from '@supabase/supabase-js';

const URL = process.env.SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE;
const ANON = process.env.SUPABASE_ANON_KEY;

export function isConfigured() { return !!(URL && SERVICE); }

export function serviceClient() {
  return createClient(URL, SERVICE, { auth: { persistSession: false, autoRefreshToken: false } });
}

// Verifica el token Bearer y devuelve el usuario, o null.
export async function userFromRequest(req) {
  const h = req.headers['authorization'] || req.headers['Authorization'] || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return null;
  const c = createClient(URL, ANON, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await c.auth.getUser(token);
  if (error || !data || !data.user) return null;
  return data.user;
}

// Devuelve las org_id a las que pertenece el usuario (para validar acceso).
export async function userOrgIds(svc, userId) {
  const { data } = await svc.from('org_members').select('org_id').eq('user_id', userId);
  return (data || []).map((r) => r.org_id);
}
