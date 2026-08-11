// GET /api/app/cron → reanálisis programado (lo llama Vercel Cron).
//   Busca webs cuyo next_check_at ya venció, las reanaliza (con presupuesto de
//   tiempo), y envía las alertas pendientes. Idempotente: reprograma cada web
//   tras analizarla, así una segunda ejecución no la vuelve a coger.
//
//   Protección: Vercel Cron envía "Authorization: Bearer $CRON_SECRET".
//   También se acepta ?key=$CRON_SECRET para pruebas manuales.
import { serviceClient, isConfigured } from '../_lib/supabase.js';
import { runAnalysis } from '../_lib/store.js';
import { dispatchPendingAlerts } from '../_lib/alert-email.js';
import { json } from '../_lib/http.js';

export const config = { maxDuration: 60 }; // Hobby = 60 s; en Pro se puede subir

const BATCH = 8;              // máximo de webs por ejecución
const TIME_BUDGET_MS = 50000; // corta antes del límite de la función (deja margen)

function authorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // si no hay secreto configurado, no bloqueamos (dev)
  const h = req.headers['authorization'] || '';
  if (h === 'Bearer ' + secret) return true;
  const key = req.query && req.query.key;
  return key === secret;
}

export default async function handler(req, res) {
  if (!isConfigured()) return json(res, 503, { error: 'Backend no configurado.' });
  if (!authorized(req)) return json(res, 401, { error: 'No autorizado.' });

  const svc = serviceClient();
  const nowIso = new Date().toISOString();
  const { data: due } = await svc.from('websites')
    .select('*').eq('active', true)
    .or('next_check_at.is.null,next_check_at.lte.' + nowIso)
    .order('next_check_at', { ascending: true, nullsFirst: true })
    .limit(BATCH);

  const started = Date.now();
  let analizadas = 0, conCambio = 0, errores = 0;
  for (const website of due || []) {
    if (Date.now() - started > TIME_BUDGET_MS) break;
    const r = await runAnalysis(svc, website);
    analizadas++;
    if (!r.ok) errores++;
    else if (r.change) conCambio++;
  }

  const appUrl = process.env.PUBLIC_APP_URL || 'https://cometia.es';
  const dispatch = await dispatchPendingAlerts(svc, appUrl);

  return json(res, 200, { ok: true, analizadas, conCambio, errores, alertas: dispatch });
}
