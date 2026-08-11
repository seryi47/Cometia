#!/usr/bin/env node
/**
 * Cometia · Outreach con nota real de Google
 * ------------------------------------------------------------------
 * Coge una lista de webs de pymes (CSV) y, para cada una, saca su nota
 * REAL de velocidad/SEO en móvil con PageSpeed Insights (Google) y
 * redacta un email en frío PERSONALIZADO con ese dato. Es el gancho que
 * convierte un correo genérico en uno imposible de ignorar:
 *   "He analizado tuweb.es: saca 34/100 en velocidad móvil (Google)."
 *
 * USO:
 *   node scripts/outreach.mjs [ruta-csv]
 *   node scripts/outreach.mjs scripts/prospects.csv
 *
 * El CSV admite cabecera con columnas (en cualquier orden): empresa, web, email
 * (email es opcional). También admite una web por línea sin cabecera.
 *
 * SALIDA:
 *   scripts/outreach-emails.md   → borradores legibles listos para enviar a mano
 *   scripts/outreach-emails.csv  → mismos datos en tabla (empresa,web,notas,asunto,cuerpo,prioridad)
 *
 * OPCIONES:
 *   PAGESPEED_API_KEY=xxx   (env, opcional) → más cuota, evita 429. Muy recomendable para listas largas.
 *   --send                  → además de los borradores, ENVÍA por Resend a los prospectos que traigan email.
 *                             Requiere RESEND_API_KEY (y RESEND_FROM). Úsalo con cabeza: el email en frío
 *                             B2B es legítimo (interés legítimo + baja incluida), pero enviar a mansalva
 *                             desde tu dominio puede dañar tu reputación de correo. Empieza SIEMPRE a mano.
 *
 * SIN IA: solo datos de Google (PageSpeed) + plantilla determinista.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import nodemailer from 'nodemailer';

const PSI = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const RESEND = 'https://api.resend.com/emails';
const SIGNATURE_NAME = 'Sergio'; // cámbialo por quien firme los correos

const args = process.argv.slice(2);
const SEND = args.includes('--send');
const csvPath = args.find((a) => !a.startsWith('--')) || 'scripts/prospects.csv';

// ---------- utilidades ----------
function normalizeUrl(raw) {
  if (!raw || typeof raw !== 'string') return null;
  let v = raw.trim();
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
  try {
    const u = new URL(v);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    const host = u.hostname.toLowerCase();
    if (['localhost', '127.0.0.1', '0.0.0.0'].includes(host) || host.endsWith('.local')) return null;
    if (!host.includes('.')) return null;
    return u.toString();
  } catch {
    return null;
  }
}
function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}
function toScore(cat) {
  return cat && typeof cat.score === 'number' ? Math.round(cat.score * 100) : null;
}
function csvCell(s) {
  const v = String(s == null ? '' : s);
  return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- parseo del CSV de prospectos ----------
function parseProspects(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return [];
  const first = lines[0].toLowerCase();
  const hasHeader = /(^|,)\s*(empresa|web|url|email|correo)\s*(,|$)/.test(first);
  let cols = ['web'];
  let start = 0;
  if (hasHeader) {
    cols = lines[0].split(',').map((c) => c.trim().toLowerCase());
    start = 1;
  }
  const idx = (names) => cols.findIndex((c) => names.includes(c));
  const iEmp = idx(['empresa', 'nombre']);
  const iWeb = idx(['web', 'url', 'sitio']);
  const iMail = idx(['email', 'correo', 'mail']);
  const out = [];
  for (let i = start; i < lines.length; i++) {
    const parts = lines[i].split(',').map((p) => p.trim());
    const web = iWeb >= 0 ? parts[iWeb] : parts[0];
    if (!web) continue;
    out.push({
      empresa: iEmp >= 0 ? parts[iEmp] || '' : '',
      web,
      email: iMail >= 0 ? parts[iMail] || '' : '',
    });
  }
  return out;
}

// ---------- PageSpeed ----------
async function analyze(url, key) {
  const p = new URLSearchParams();
  p.set('url', url);
  p.set('strategy', 'mobile');
  if (key) p.set('key', key);
  for (const c of ['performance', 'seo', 'accessibility', 'best-practices']) p.append('category', c);
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 55000);
  try {
    const res = await fetch(`${PSI}?${p}`, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return { error: res.status === 429 ? 'cuota agotada (usa PAGESPEED_API_KEY)' : 'HTTP ' + res.status };
    const data = await res.json();
    const cats = (data.lighthouseResult && data.lighthouseResult.categories) || {};
    return {
      performance: toScore(cats.performance),
      seo: toScore(cats.seo),
      accessibility: toScore(cats.accessibility),
      bestPractices: toScore(cats['best-practices']),
    };
  } catch (e) {
    clearTimeout(t);
    return { error: e.name === 'AbortError' ? 'timeout' : 'error de red' };
  }
}

// ---------- redacción del email ----------
function band(perf) {
  if (perf == null) return {
    prio: 'media',
    linea: 'no he podido medir con fiabilidad su velocidad de carga, pero estaré encantado de revisarla contigo.',
  };
  if (perf < 50) return {
    prio: 'ALTA',
    linea: `su velocidad de carga en el móvil obtiene ${perf}/100, una puntuación baja. Dado que la mayor parte del tráfico llega desde el teléfono, una carga lenta hace que muchas visitas abandonen la página antes de que termine de cargar: son clientes potenciales que se pierden sin llegar a verte.`,
  };
  if (perf < 85) return {
    prio: 'media',
    linea: `su velocidad de carga en el móvil obtiene ${perf}/100, con un margen de mejora claro. Ganar velocidad suele traducirse en más consultas, más clientes y una mejor posición en Google.`,
  };
  return {
    prio: 'baja',
    linea: `su velocidad de carga en el móvil obtiene ${perf}/100, una buena base. Aun así, suele quedar recorrido y conviene revisar también otras áreas como el SEO, la accesibilidad o la seguridad.`,
  };
}

function scoreColor(v) {
  if (v == null) return '#5b544a';
  if (v >= 85) return '#1c7a4d';
  if (v >= 50) return '#915e00';
  return '#bd342b';
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function buildEmail({ empresa, host, scores }) {
  const perf = scores.performance;
  const b = band(perf);
  const saludo = empresa ? `Hola, equipo de ${empresa}:` : 'Buenos días:';
  const seoTxt = scores.seo != null && scores.seo < 90
    ? ` En el apartado de SEO técnico también he detectado margen de mejora (${scores.seo}/100).` : '';
  const subject = perf == null
    ? `Análisis de velocidad de ${host} (datos de Google)`
    : `${host}: ${perf}/100 en velocidad móvil según Google`;

  // --- Versión TEXTO (respaldo, buena para no caer en spam) ---
  const text =
`${saludo}

Soy ${SIGNATURE_NAME}, de Cometia. Reviso webs de empresas de Albacete con los datos oficiales de Google (PageSpeed) y, al mirar ${host}, ${b.linea}${seoTxt}

Te escribo solo por si te resulta útil: es un dato real de Google, no un correo automático. Si quieres, te preparo sin coste un breve resumen con los 2 o 3 puntos que más están frenando tu web y cómo se solucionarían, para que lo tengas —lo mires tú, lo comente quien te lleve la web, o le echemos un ojo juntos si te apetece—.

¿Te lo preparo? Con que respondas a este correo, me vale. Y si prefieres verlo tú mismo ahora, tienes el análisis gratuito en https://cometia.es.

Un cordial saludo,

${SIGNATURE_NAME}
Cometia · Auditoría web y optimización de velocidad (WPO)
Un proyecto de Órbita Labs
cometia.es · cometia.es@gmail.com · WhatsApp +34 657 88 46 13

—
Te escribo por interés profesional tras revisar tu web. Si no deseas recibir más comunicaciones, responde "BAJA" y no volveré a escribirte.`;

  // --- Versión HTML (cabecera Cometia + tarjeta con el favicon y la nota real de su web) ---
  const col = scoreColor(perf);
  const fav = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;
  const notaBig = perf == null ? '—' : String(perf);
  const html =
`<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#181510;max-width:560px;margin:0 auto">
  <div style="background:#181510;padding:16px 22px">
    <span style="display:inline-block;width:11px;height:11px;background:#1b2ed8;border-radius:50%;vertical-align:middle;margin-right:8px"></span>
    <span style="color:#f3eee3;font-weight:800;font-size:20px;letter-spacing:-0.03em;vertical-align:middle">cometia</span>
  </div>
  <div style="border:1.5px solid #181510;border-top:0;padding:24px 22px;background:#ffffff">
    <p style="margin:0 0 16px">${esc(saludo)}</p>
    <p style="margin:0 0 18px;line-height:1.6">Soy <strong>${esc(SIGNATURE_NAME)}</strong>, de Cometia. Analizamos la web de empresas con los datos oficiales de Google (PageSpeed) y, al revisar <strong>${esc(host)}</strong>, ${esc(b.linea)}${esc(seoTxt)}</p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #d9d1bf;background:#faf7f0;margin:0 0 20px;border-collapse:collapse">
      <tr>
        <td style="padding:14px 16px;vertical-align:middle">
          <img src="${fav}" width="32" height="32" alt="" style="vertical-align:middle;border-radius:6px;margin-right:10px">
          <span style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:14px;color:#181510;vertical-align:middle">${esc(host)}</span>
        </td>
        <td style="padding:12px 16px;text-align:right;vertical-align:middle;white-space:nowrap">
          <span style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:30px;font-weight:800;color:${col}">${notaBig}</span><span style="color:#8a8272;font-size:13px">/100</span><br>
          <span style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#8a8272">Velocidad móvil · Google</span>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 16px;line-height:1.6">Te escribo solo por si te resulta útil: es un dato real de Google, no un correo automático. Si quieres, te preparo <strong>sin coste</strong> un breve resumen con los 2 o 3 puntos que más están frenando tu web y cómo se solucionarían, para que lo tengas.</p>
    <p style="margin:0 0 20px;line-height:1.6">¿Te lo preparo? Con que respondas a este correo, me vale. Y si prefieres verlo tú mismo ahora, tienes el análisis gratuito aquí:</p>
    <p style="margin:0 0 24px"><a href="https://cometia.es" style="display:inline-block;background:#1b2ed8;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 22px">Ver el análisis de mi web →</a></p>
    <p style="margin:0;line-height:1.55;color:#5b544a;font-size:14px">Un cordial saludo,<br>
    <strong style="color:#181510">${esc(SIGNATURE_NAME)}</strong><br>
    Cometia · Auditoría web y optimización de velocidad (WPO)<br>
    Un proyecto de Órbita Labs<br>
    <a href="https://cometia.es" style="color:#1b2ed8">cometia.es</a> · cometia.es@gmail.com · WhatsApp +34 657 88 46 13</p>
  </div>
  <p style="color:#8a8272;font-size:12px;line-height:1.5;margin:12px 6px 0">Te escribo por interés profesional tras revisar tu web. Si no deseas recibir más comunicaciones, responde "BAJA" y no volveré a escribirte.</p>
</div>`;

  return { subject, text, html, prio: b.prio };
}

// ---------- envío por Gmail (SMTP con contraseña de aplicación) ----------
let _gmailTx;
async function sendViaGmail(to, subject, text, html) {
  const user = process.env.GMAIL_USER;
  const pass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, ''); // quita espacios del código de 16
  if (!user || !pass) return { ok: false, err: 'faltan GMAIL_USER / GMAIL_APP_PASSWORD' };
  if (!_gmailTx) _gmailTx = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  try {
    await _gmailTx.sendMail({ from: `Cometia <${user}>`, to, subject, text, html });
    return { ok: true, err: '' };
  } catch (e) {
    return { ok: false, err: (e && e.message ? e.message : 'error').slice(0, 90) };
  }
}

// ---------- envío opcional (Resend) ----------
async function sendViaResend(to, subject, text, html) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, err: 'sin RESEND_API_KEY' };
  const from = process.env.RESEND_FROM || 'Cometia <informe@cometia.es>';
  const replyTo = process.env.REPLY_TO || 'cometia.es@gmail.com';
  try {
    const res = await fetch(RESEND, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: replyTo, subject, text, html }),
    });
    return { ok: res.ok, err: res.ok ? '' : 'HTTP ' + res.status };
  } catch (e) {
    return { ok: false, err: 'error de red' };
  }
}

// ---------- main ----------
async function main() {
  const key = process.env.PAGESPEED_API_KEY && !/TODO|XXXX/i.test(process.env.PAGESPEED_API_KEY)
    ? process.env.PAGESPEED_API_KEY : '';
  let raw;
  try {
    raw = await readFile(csvPath, 'utf8');
  } catch {
    console.error(`No encuentro el CSV en "${csvPath}". Crea uno (mira scripts/prospects.example.csv) o pasa la ruta como argumento.`);
    process.exit(1);
  }
  const prospects = parseProspects(raw);
  if (!prospects.length) {
    console.error('El CSV no tiene prospectos válidos.');
    process.exit(1);
  }
  console.log(`\nAnalizando ${prospects.length} web(s) con PageSpeed${key ? ' (con API key)' : ' (sin key: cuidado con la cuota)'}…\n`);

  const rows = [];
  for (let i = 0; i < prospects.length; i++) {
    const pr = prospects[i];
    const url = normalizeUrl(pr.web);
    const host = url ? hostOf(url) : pr.web;
    process.stdout.write(`  [${i + 1}/${prospects.length}] ${host} … `);
    if (!url) {
      console.log('web inválida, saltada');
      rows.push({ ...pr, host, error: 'web inválida' });
      continue;
    }
    const scores = await analyze(url, key);
    if (scores.error) {
      console.log('✗ ' + scores.error);
      rows.push({ ...pr, host, error: scores.error });
    } else {
      const { subject, text, html, prio } = buildEmail({ empresa: pr.empresa, host, scores });
      console.log(`vel ${scores.performance ?? '—'}/100 · prioridad ${prio}`);
      let sent = '';
      if (SEND && pr.email) {
        // Si hay credenciales de Gmail, enviamos desde tu Gmail (aparece en Enviados);
        // si no, caemos a Resend (dominio cometia.es).
        const useGmail = !!process.env.GMAIL_APP_PASSWORD;
        const r = useGmail ? await sendViaGmail(pr.email, subject, text, html) : await sendViaResend(pr.email, subject, text, html);
        sent = r.ok ? (useGmail ? 'enviado (Gmail)' : 'enviado (Resend)') : 'fallo envío: ' + r.err;
      }
      rows.push({ ...pr, host, scores, subject, text, html, prio, sent });
    }
    // Respetamos la cuota de PageSpeed: pausa entre llamadas.
    if (i < prospects.length - 1) await sleep(key ? 400 : 1500);
  }

  // Orden: prioridad ALTA primero
  const order = { ALTA: 0, media: 1, baja: 2 };
  const ok = rows.filter((r) => !r.error).sort((a, b) => (order[a.prio] ?? 3) - (order[b.prio] ?? 3));
  const bad = rows.filter((r) => r.error);

  // --- salida markdown ---
  let md = `# Outreach Cometia — borradores personalizados\n\n> Generado a partir de ${csvPath}. ${ok.length} webs analizadas, ${bad.length} con error.\n> Ordenados por prioridad (webs más lentas primero). Revisa y envía a mano (o usa --send con cabeza).\n\n`;
  for (const r of ok) {
    md += `---\n\n## ${r.empresa || r.host}  ·  prioridad ${r.prio}\n\n`;
    md += `- **Web:** ${r.host}\n- **Email:** ${r.email || '— (búscalo)'}\n`;
    md += `- **Notas Google (móvil):** velocidad ${r.scores.performance ?? '—'} · SEO ${r.scores.seo ?? '—'} · accesibilidad ${r.scores.accessibility ?? '—'} · buenas prácticas ${r.scores.bestPractices ?? '—'}\n`;
    if (r.sent) md += `- **Envío:** ${r.sent}\n`;
    md += `\n**Asunto:** ${r.subject}\n\n\`\`\`\n${r.text}\n\`\`\`\n\n`;
  }
  if (bad.length) {
    md += `---\n\n## No analizadas\n\n`;
    for (const r of bad) md += `- ${r.host} — ${r.error}\n`;
  }
  const mdPath = path.join(path.dirname(csvPath), 'outreach-emails.md');
  await writeFile(mdPath, md, 'utf8');

  // --- salida csv ---
  let csv = 'empresa,web,velocidad,seo,accesibilidad,buenas_practicas,prioridad,asunto,cuerpo,envio\n';
  for (const r of ok) {
    csv += [
      r.empresa, r.host, r.scores.performance ?? '', r.scores.seo ?? '', r.scores.accessibility ?? '',
      r.scores.bestPractices ?? '', r.prio, r.subject, r.text, r.sent || '',
    ].map(csvCell).join(',') + '\n';
  }
  const csvOut = path.join(path.dirname(csvPath), 'outreach-emails.csv');
  await writeFile(csvOut, csv, 'utf8');

  // --- vista previa HTML (para verlo tal cual llegará al buzón) ---
  const preview = ok.map((r) => r.html).join('\n<hr style="border:0;border-top:2px dashed #d9d1bf;margin:44px 0">\n');
  const previewPath = path.join(path.dirname(csvPath), 'outreach-preview.html');
  await writeFile(previewPath, preview || '<p>Sin resultados.</p>', 'utf8');

  console.log(`\n✅ Listo.\n   ${mdPath}  (texto)\n   ${csvOut}  (tabla)\n   ${previewPath}  (vista previa HTML)\n`);
  if (!SEND) console.log('   No se ha enviado nada (modo borrador). Revisa el .md y envía a mano, o añade --send.\n');
}

main();
