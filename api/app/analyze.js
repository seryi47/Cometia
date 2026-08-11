// POST /api/app/analyze { websiteId } → reanaliza una web AHORA (loop completo).
import { serviceClient, userFromRequest, userOrgIds, isConfigured } from '../_lib/supabase.js';
import { runAnalysis } from '../_lib/store.js';
import { dispatchPendingAlerts } from '../_lib/alert-email.js';
import { readBody, json } from '../_lib/http.js';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (!isConfigured()) return json(res, 503, { error: 'Backend no configurado.' });
  if (req.method !== 'POST') return json(res, 405, { error: 'Método no permitido.' });
  const user = await userFromRequest(req);
  if (!user) return json(res, 401, { error: 'No autenticado.' });

  const svc = serviceClient();
  const orgs = await userOrgIds(svc, user.id);
  if (!orgs.length) return json(res, 403, { error: 'Sin organización.' });

  const b = await readBody(req);
  if (!b.websiteId) return json(res, 400, { error: 'Falta websiteId.' });

  const { data: website } = await svc.from('websites').select('*').eq('id', b.websiteId).single();
  if (!website || !orgs.includes(website.org_id)) return json(res, 404, { error: 'Web no encontrada.' });

  const r = await runAnalysis(svc, website);
  if (!r.ok) return json(res, 200, { ok: false, error: r.error });

  // Enviar alerta al momento si el análisis manual destapó una regresión.
  const appUrl = process.env.PUBLIC_APP_URL || 'https://cometia.es';
  if (r.alert) await dispatchPendingAlerts(svc, appUrl);

  return json(res, 200, {
    ok: true,
    salud: r.snapshot.salud,
    change: r.change ? { alert_level: r.change.alert_level, headline: r.change.headline, salud_delta: r.change.salud_delta, changes: r.change.changes, causa: r.change.causa } : null,
  });
}
