// ============================================================================
// Cometia — Alertas accionables por email (Resend).
//   Una alerta NO es "PageSpeed cambió 3 puntos". Es: qué pasó, cuánto cambió,
//   por qué creemos que pasó (con confianza) y qué hacer. Con botón al análisis.
// ============================================================================

const CONF = { medido: '🟢 Alta', inferido: '🟡 Media', hipotesis: '🔴 Baja' };
const SEV = { critico: '#c0392b', importante: '#d1571a', mejora: '#0a8a4a' };

function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

export function buildAlertEmail(change, website, appUrl) {
  const level = change.alert_level === 'critical' ? '🔴 REGRESIÓN IMPORTANTE' : '🟠 Cambio importante';
  const host = website.host || website.url;
  const subject = (change.alert_level === 'critical' ? '🔴' : '🟠') + ' Cometia: ' + host + ' ha cambiado';
  const link = (appUrl || 'https://cometia.es') + '/app/web/' + website.id;

  const rows = (change.changes || []).slice(0, 6).map((c) => {
    const col = SEV[c.severidad] || '#5c616b';
    return '<tr><td style="padding:8px 0;border-bottom:1px solid #eee">' +
      '<div style="font-weight:700;color:' + col + '">' + esc(c.titulo) + '</div>' +
      (c.evidencia ? '<div style="color:#5c616b;font-size:14px">' + esc(c.evidencia) + '</div>' : '') +
      '<div style="color:#8a8f98;font-size:12px;margin-top:2px">Confianza: ' + (CONF[c.confianza] || c.confianza) + '</div>' +
      '</td></tr>';
  }).join('');

  const causa = change.causa
    ? '<div style="margin:14px 0;padding:12px 14px;background:#fbf6ee;border-radius:8px">' +
      '<div style="font-weight:700">Posible causa</div>' +
      '<div style="color:#5c616b">' + esc(change.causa.texto) + '</div>' +
      '<div style="color:#8a8f98;font-size:12px;margin-top:2px">Confianza: ' + (CONF[change.causa.confianza] || change.causa.confianza) + '</div></div>'
    : '';

  const html =
    '<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;color:#15171b">' +
    '<div style="font-size:13px;color:#8a8f98;text-transform:uppercase;letter-spacing:.5px">Cometia · Alerta</div>' +
    '<h1 style="font-size:20px;margin:6px 0 2px">' + level + '</h1>' +
    '<p style="font-size:16px;margin:0 0 4px"><strong>' + esc(host) + '</strong> — ' + esc(change.headline || '') + '</p>' +
    (change.salud_delta != null ? '<p style="margin:0 0 12px;color:#5c616b">Salud: ' + esc(change.salud_delta) + ' puntos</p>' : '') +
    causa +
    '<table style="width:100%;border-collapse:collapse;margin-top:6px">' + rows + '</table>' +
    '<p style="margin:22px 0"><a href="' + esc(link) + '" style="background:#15171b;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700">Ver análisis →</a></p>' +
    '<p style="color:#8a8f98;font-size:12px">Recibes esto porque vigilas ' + esc(host) + ' con Cometia. — Cometia, un proyecto de Órbita Labs.</p>' +
    '</div>';

  return { subject, html };
}

async function sendResend(to, subject, html) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || 'Cometia <informe@cometia.es>';
  if (!key) return { ok: false, error: 'RESEND_API_KEY ausente' };
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!r.ok) return { ok: false, error: 'Resend HTTP ' + r.status };
  return { ok: true };
}

// Destinatario: el email configurado en la web, o el dueño de la organización.
async function resolveRecipient(svc, website) {
  if (website.alert_email) return website.alert_email;
  const { data: owner } = await svc.from('org_members').select('user_id').eq('org_id', website.org_id).eq('role', 'owner').limit(1).single();
  if (owner && owner.user_id) {
    const { data } = await svc.auth.admin.getUserById(owner.user_id);
    if (data && data.user) return data.user.email;
  }
  return null;
}

// Envía todas las alertas pendientes (llamado por cron y tras análisis manual).
export async function dispatchPendingAlerts(svc, appUrl) {
  const { data: pend } = await svc.from('alerts').select('*').eq('status', 'pending').limit(50);
  let sent = 0, failed = 0;
  for (const a of pend || []) {
    const { data: website } = await svc.from('websites').select('*').eq('id', a.website_id).single();
    const { data: change } = await svc.from('changes').select('*').eq('id', a.change_id).single();
    if (!website || !change) { await svc.from('alerts').update({ status: 'failed' }).eq('id', a.id); failed++; continue; }
    const to = await resolveRecipient(svc, website);
    if (!to) { await svc.from('alerts').update({ status: 'failed' }).eq('id', a.id); failed++; continue; }
    const { subject, html } = buildAlertEmail(change, website, appUrl);
    const res = await sendResend(to, subject, html);
    if (res.ok) { await svc.from('alerts').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', a.id); sent++; }
    else { await svc.from('alerts').update({ status: 'failed' }).eq('id', a.id); failed++; }
  }
  return { sent, failed };
}
