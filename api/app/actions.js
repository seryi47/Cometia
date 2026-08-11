// Acciones sobre una web.
//   POST  { websiteId, findingId, title, categoria }        → crear acción
//   PATCH { id, status }                                     → cambiar estado
//   PATCH { id, recheck:true }                               → re-analizar y medir resultado
import { serviceClient, userFromRequest, userOrgIds, isConfigured } from '../_lib/supabase.js';
import { runAnalysis } from '../_lib/store.js';
import { readBody, json } from '../_lib/http.js';

export const config = { maxDuration: 60 };

// Findings que se pueden medir con una métrica concreta (para el "antes → después").
const FINDING_METRIC = {
  'lcp-alto': { key: 'lcp', label: 'LCP', unit: 'ms' },
  'cls-inestable': { key: 'cls', label: 'CLS', unit: '' },
  'respuesta-servidor-lenta': { key: 'ttfb', label: 'Respuesta del servidor', unit: 'ms' },
};
function fmt(v, unit) {
  if (v == null) return '—';
  if (unit === 'ms') return v >= 1000 ? (v / 1000).toFixed(1).replace('.', ',') + ' s' : Math.round(v) + ' ms';
  return String(Math.round(v * 1000) / 1000).replace('.', ',');
}

export default async function handler(req, res) {
  if (!isConfigured()) return json(res, 503, { error: 'Backend no configurado.' });
  const user = await userFromRequest(req);
  if (!user) return json(res, 401, { error: 'No autenticado.' });
  const svc = serviceClient();
  const orgs = await userOrgIds(svc, user.id);
  if (!orgs.length) return json(res, 403, { error: 'Sin organización.' });

  if (req.method === 'POST') {
    const b = await readBody(req);
    const { data: website } = await svc.from('websites').select('*').eq('id', b.websiteId).single();
    if (!website || !orgs.includes(website.org_id)) return json(res, 404, { error: 'Web no encontrada.' });
    if (!b.title) return json(res, 400, { error: 'Falta el título de la acción.' });
    const { data, error } = await svc.from('actions').insert({
      org_id: website.org_id, website_id: website.id, finding_id: b.findingId || null,
      title: b.title, categoria: b.categoria || null, snapshot_before_id: website.last_snapshot_id || null,
    }).select('*').single();
    if (error) return json(res, 500, { error: error.message });
    return json(res, 200, { action: data });
  }

  if (req.method === 'PATCH') {
    const b = await readBody(req);
    const { data: action } = await svc.from('actions').select('*').eq('id', b.id).single();
    if (!action || !orgs.includes(action.org_id)) return json(res, 404, { error: 'Acción no encontrada.' });

    // Re-medir: nuevo análisis y comparar con el snapshot de antes.
    if (b.recheck) {
      const { data: website } = await svc.from('websites').select('*').eq('id', action.website_id).single();
      const r = await runAnalysis(svc, website);
      if (!r.ok) return json(res, 200, { ok: false, error: r.error });
      const after = r.snapshot;
      let before = null;
      if (action.snapshot_before_id) {
        const { data } = await svc.from('snapshots').select('*').eq('id', action.snapshot_before_id).single();
        before = data;
      }
      const antesSalud = before ? before.salud : null;
      const despuesSalud = after.salud;
      const resuelto = action.finding_id
        ? (!(after.findings || []).some((f) => f.id === action.finding_id)) && (!before || (before.findings || []).some((f) => f.id === action.finding_id))
        : null;
      const result = { antesSalud, despuesSalud, saludDelta: antesSalud != null ? despuesSalud - antesSalud : null, resuelto };
      const mm = action.finding_id && FINDING_METRIC[action.finding_id];
      if (mm && before && before.metrics && after.metrics && before.metrics[mm.key] != null && after.metrics[mm.key] != null) {
        const a = before.metrics[mm.key], d = after.metrics[mm.key];
        const mejora = a > 0 ? Math.round(((a - d) / a) * 100) : null;
        result.metric = { label: mm.label, antes: fmt(a, mm.unit), despues: fmt(d, mm.unit), mejoraPct: mejora };
      }
      result.texto = resuelto ? 'El problema ya no aparece.' : resuelto === false ? 'El problema sigue presente.' : 'Medición actualizada.';
      const { data } = await svc.from('actions').update({ status: 'verificada', snapshot_after_id: after.id, result }).eq('id', action.id).select('*').single();
      return json(res, 200, { ok: true, action: data });
    }

    // Cambio de estado normal.
    const allowed = ['pendiente', 'en_progreso', 'completada', 'verificando', 'verificada'];
    if (!allowed.includes(b.status)) return json(res, 400, { error: 'Estado no válido.' });
    const { data } = await svc.from('actions').update({ status: b.status }).eq('id', action.id).select('*').single();
    return json(res, 200, { ok: true, action: data });
  }

  return json(res, 405, { error: 'Método no permitido.' });
}
