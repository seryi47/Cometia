// GET  /api/app/websites          → lista las webs de la organización
// POST /api/app/websites {url,...} → añade una web y hace el análisis inicial
import { serviceClient, userFromRequest, userOrgIds, isConfigured } from '../_lib/supabase.js';
import { normalizeUrl, hostOf } from '../_lib/engine.js';
import { runAnalysis } from '../_lib/store.js';
import { readBody, json } from '../_lib/http.js';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (!isConfigured()) return json(res, 503, { error: 'Backend no configurado (faltan variables de Supabase).' });
  const user = await userFromRequest(req);
  if (!user) return json(res, 401, { error: 'No autenticado.' });

  const svc = serviceClient();
  const orgs = await userOrgIds(svc, user.id);
  if (!orgs.length) return json(res, 403, { error: 'Tu usuario no tiene organización.' });
  const orgId = orgs[0]; // MVP: una organización por usuario

  if (req.method === 'GET') {
    const { data } = await svc.from('websites').select('*').eq('org_id', orgId).order('created_at', { ascending: false });
    return json(res, 200, { websites: data || [] });
  }

  if (req.method === 'POST') {
    const b = await readBody(req);
    const url = normalizeUrl(b.url || '');
    if (!url) return json(res, 400, { error: 'Introduce una URL válida, por ejemplo cliente.com' });

    const { data: org } = await svc.from('organizations').select('website_limit').eq('id', orgId).single();
    const { count } = await svc.from('websites').select('id', { count: 'exact', head: true }).eq('org_id', orgId);
    if (org && count != null && count >= org.website_limit)
      return json(res, 402, { error: 'Has alcanzado el límite de webs de tu plan.', limit: org.website_limit });

    const row = { org_id: orgId, url, host: hostOf(url), name: b.name || null, frequency: b.frequency === 'daily' ? 'daily' : 'weekly' };
    const { data: website, error } = await svc.from('websites').insert(row).select('*').single();
    if (error) {
      if (error.code === '23505') return json(res, 409, { error: 'Esa web ya está en tu cuenta.' });
      return json(res, 500, { error: error.message });
    }

    const r = await runAnalysis(svc, website);
    const { data: fresh } = await svc.from('websites').select('*').eq('id', website.id).single();
    return json(res, 200, { website: fresh || website, analysis: r.ok ? { salud: r.snapshot.salud } : { error: r.error } });
  }

  // Editar una web: pausar/reanudar, renombrar, frecuencia, email de alertas.
  if (req.method === 'PATCH') {
    const b = await readBody(req);
    const { data: website } = await svc.from('websites').select('org_id').eq('id', b.id).single();
    if (!website || website.org_id !== orgId) return json(res, 404, { error: 'Web no encontrada.' });
    const patch = {};
    if (typeof b.active === 'boolean') patch.active = b.active;
    if (typeof b.name === 'string') patch.name = b.name.slice(0, 120) || null;
    if (b.frequency === 'daily' || b.frequency === 'weekly') patch.frequency = b.frequency;
    if (typeof b.alert_email === 'string') patch.alert_email = b.alert_email.trim() || null;
    if (!Object.keys(patch).length) return json(res, 400, { error: 'Nada que actualizar.' });
    const { data, error } = await svc.from('websites').update(patch).eq('id', b.id).select('*').single();
    if (error) return json(res, 500, { error: error.message });
    return json(res, 200, { website: data });
  }

  // Borrar una web (y en cascada sus snapshots/cambios/alertas/acciones).
  if (req.method === 'DELETE') {
    const b = await readBody(req);
    const wid = b.id || (req.query && req.query.id);
    const { data: website } = await svc.from('websites').select('org_id').eq('id', wid).single();
    if (!website || website.org_id !== orgId) return json(res, 404, { error: 'Web no encontrada.' });
    await svc.from('websites').delete().eq('id', wid);
    return json(res, 200, { ok: true });
  }

  return json(res, 405, { error: 'Método no permitido.' });
}
