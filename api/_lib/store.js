// ============================================================================
// Cometia — Pipeline de análisis (el LOOP, lado servidor).
//   runAnalysis(svc, website):
//     buildSnapshot → guardar snapshot → cargar el anterior → diff →
//     guardar change (si hay cambios) → encolar alerta (si es alertable) →
//     actualizar estado de la web y programar el próximo análisis.
//
//   Idempotente en lo que importa: la alerta tiene índice único por change_id,
//   así que un doble disparo del cron no duplica avisos.
// ============================================================================
import { buildSnapshot } from './snapshot.js';
import { diffSnapshots } from './diff.js';

const HOUR = 3600 * 1000;

export function nextCheckAt(frequency) {
  const ms = frequency === 'daily' ? 24 * HOUR : 7 * 24 * HOUR;
  return new Date(Date.now() + ms).toISOString();
}

function statusFromSalud(salud, change) {
  if (change && (change.alert_level === 'critical' || change.alert_level === 'important')) return 'revisar';
  if (change && change.alert_level === 'minor') return 'vigilar';
  if (salud == null) return 'error';
  if (salud >= 70) return 'ok';
  if (salud >= 45) return 'vigilar';
  return 'revisar';
}

// Reconstruye la forma de snapshot que espera diff.js a partir de una fila DB.
function snapFromRow(row, host) {
  return {
    host,
    salud: row.salud,
    metrics: row.metrics || {},
    resources: row.resources || {},
    findings: row.findings || [],
    signals: row.signals || null,
  };
}

/**
 * Ejecuta un análisis completo de una web y persiste todo.
 * @param {object} svc      service client (salta RLS)
 * @param {object} website  fila de la tabla websites
 * @returns {Promise<{ok:boolean, snapshot?, change?, alert?, error?}>}
 */
export async function runAnalysis(svc, website) {
  const apiKey = process.env.PAGESPEED_API_KEY;
  const snap = await buildSnapshot(website.url, { apiKey, strategy: 'mobile' });

  // Web caída / PSI falla → guardamos snapshot de error, marcamos estado, reprogramamos.
  if (snap.error) {
    await svc.from('snapshots').insert({
      website_id: website.id, org_id: website.org_id, reachable: false, error: String(snap.error),
    });
    await svc.from('websites').update({
      status: 'error', last_checked_at: new Date().toISOString(), next_check_at: nextCheckAt(website.frequency),
    }).eq('id', website.id);
    return { ok: false, error: snap.error };
  }

  // Guardar el nuevo snapshot.
  const { data: newSnap, error: insErr } = await svc.from('snapshots').insert({
    website_id: website.id, org_id: website.org_id, strategy: snap.strategy, reachable: true,
    salud: snap.salud, global: snap.global, counts: snap.counts, scores: snap.scores,
    metrics: snap.metrics, resources: snap.resources, findings: snap.findings, ok: snap.ok, signals: snap.signals,
  }).select('*').single();
  if (insErr) return { ok: false, error: insErr.message };

  // Cargar el snapshot alcanzable inmediatamente anterior.
  const { data: prevRows } = await svc.from('snapshots')
    .select('*').eq('website_id', website.id).eq('reachable', true)
    .lt('created_at', newSnap.created_at).order('created_at', { ascending: false }).limit(1);
  const prev = prevRows && prevRows[0];

  let change = null, alert = null;
  if (prev) {
    const thr = website.thresholds || undefined;
    const d = diffSnapshots(snapFromRow(prev, website.host), snapFromRow(newSnap, website.host), thr);
    if (d.changes.length) {
      const { data: ch } = await svc.from('changes').insert({
        website_id: website.id, org_id: website.org_id, snapshot_id: newSnap.id, prev_snapshot_id: prev.id,
        salud_delta: d.saludDelta, alert_level: d.alertLevel, headline: d.headline, changes: d.changes, causa: d.causa,
      }).select('*').single();
      change = ch;
      if (d.alertable && ch) {
        // Idempotente: uq_alerts_change evita duplicados si el cron se repite.
        const { data: al } = await svc.from('alerts').insert({
          org_id: website.org_id, website_id: website.id, change_id: ch.id, level: d.alertLevel, headline: d.headline,
        }).select('*').single();
        alert = al || null;
      }
    }
  }

  await svc.from('websites').update({
    status: statusFromSalud(snap.salud, change),
    last_salud: snap.salud, last_snapshot_id: newSnap.id,
    last_checked_at: new Date().toISOString(), next_check_at: nextCheckAt(website.frequency),
  }).eq('id', website.id);

  return { ok: true, snapshot: newSnap, change, alert };
}
