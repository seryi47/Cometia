// =============================================================
// Webhook de Stripe → ENTREGA AUTOMÁTICA del informe Cometia.
// -------------------------------------------------------------
// Cuando un pago se completa (checkout.session.completed), extrae:
//   · el email del cliente (Stripe lo recoge en el checkout), y
//   · la URL analizada (viaja en client_reference_id, codificada en base64url),
// y llama a /api/deliver, que genera el PDF con datos de Google y lo envía por email.
//
// SETUP (una sola vez, en el panel de Stripe):
//   1. Developers → Webhooks → "Add endpoint"
//        URL:     https://cometia.es/api/stripe-webhook
//        Evento:  checkout.session.completed
//   2. Copia el "Signing secret" (empieza por whsec_...).
//   3. Añádelo en Vercel (Project → Settings → Environment Variables) como
//        STRIPE_WEBHOOK_SECRET = whsec_...
//   Mientras no exista ese secreto, el webhook responde 200 sin hacer nada
//   (no rompe nada; la entrega manual sigue disponible).
// =============================================================
import crypto from 'node:crypto';

export const config = { api: { bodyParser: false } };

const DELIVER_URL = 'https://cometia.es/api/deliver';

function readRaw(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

// Verifica la firma de Stripe (HMAC-SHA256) sin depender del SDK.
function verifySignature(raw, sigHeader, secret) {
  if (!sigHeader) return false;
  const parts = {};
  for (const kv of String(sigHeader).split(',')) {
    const i = kv.indexOf('=');
    if (i > 0) parts[kv.slice(0, i).trim()] = kv.slice(i + 1).trim();
  }
  const { t, v1 } = parts;
  if (!t || !v1) return false;
  const expected = crypto.createHmac('sha256', secret).update(t + '.' + raw, 'utf8').digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(v1);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// client_reference_id (base64url) → URL original.
function urlFromRef(ref) {
  if (!ref) return '';
  try {
    const s = String(ref).replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(s, 'base64').toString('utf8');
  } catch {
    return '';
  }
}

// Devuelve el valor del campo personalizado "URL de tu web" (key = "web"),
// que sí llevan los Payment Links de WPO. Si existe la clave, es un pago WPO.
function customField(session, key) {
  const fields = (session && session.custom_fields) || [];
  for (const f of fields) {
    if (f && f.key === key) {
      return { present: true, value: (f.text && f.text.value) || '' };
    }
  }
  return { present: false, value: '' };
}

function planFromAmount(cents) {
  if (cents === 2900) return 'Básico';
  if (cents === 5900) return 'Pro';
  if (cents === 9900) return 'Premium';
  return 'WPO';
}

// Plan de informe según lo pagado, para que /api/deliver escale el informe.
function tierFromAmount(cents) {
  if (cents === 490) return 'expres';
  if (cents === 990) return 'pro';
  if (cents === 1990) return 'a360';
  if (cents === 1290) return 'expres'; // Pack 3: cada informe es un Exprés
  return 'pro';
}

// Aviso al dueño (cometia.es@gmail.com) cuando alguien contrata un plan WPO.
// La entrega del servicio es manual, así que este correo es el que dispara el trabajo.
async function notifyWpoSale({ email, web, amount }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return; // sin Resend no rompemos: el pago sigue en Stripe
  const from = process.env.RESEND_FROM || 'Cometia <onboarding@resend.dev>';
  const plan = planFromAmount(amount);
  const eur = (amount / 100).toFixed(2).replace('.', ',');
  const webRow = web
    ? '<a href="' + web + '" style="color:#1b2ed8">' + web + '</a>'
    : '<span style="color:#c0392b">— no indicada por el cliente —</span>';
  const html =
    '<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">' +
    '<div style="background:#0f1533;color:#fff;padding:22px 26px;border-radius:12px 12px 0 0">' +
    '<div style="font:600 12px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;opacity:.8">Cometia · Venta WPO</div>' +
    '<div style="font-size:22px;font-weight:800;margin-top:6px">💰 Nuevo pago: plan ' + plan + ' (' + eur + ' €)</div></div>' +
    '<div style="border:1px solid #e6e6e0;border-top:0;border-radius:0 0 12px 12px;padding:24px 26px">' +
    '<p style="margin:0 0 16px;color:#5c616b">Alguien ha contratado una optimización de velocidad. Ponte en contacto para empezar:</p>' +
    '<table style="width:100%;border-collapse:collapse;font-size:15px">' +
    '<tr><td style="padding:10px 0;border-bottom:1px solid #ececE6;color:#8a8f98">Plan</td><td style="padding:10px 0;border-bottom:1px solid #ececE6;font-weight:700;text-align:right">' + plan + ' — ' + eur + ' €</td></tr>' +
    '<tr><td style="padding:10px 0;border-bottom:1px solid #ececE6;color:#8a8f98">Email cliente</td><td style="padding:10px 0;border-bottom:1px solid #ececE6;font-weight:700;text-align:right"><a href="mailto:' + email + '" style="color:#1b2ed8">' + (email || '—') + '</a></td></tr>' +
    '<tr><td style="padding:10px 0;color:#8a8f98">Web a optimizar</td><td style="padding:10px 0;font-weight:700;text-align:right">' + webRow + '</td></tr>' +
    '</table>' +
    '<p style="margin:20px 0 0;color:#98a2c0;font-size:12px">Puedes responder a este correo para escribir directamente al cliente. · Cometia, un proyecto de Órbita Labs.</p>' +
    '</div></div>';
  try {
    const body = {
      from,
      to: 'cometia.es@gmail.com',
      subject: '💰 Nuevo pago WPO — plan ' + plan + ' (' + eur + ' €)',
      html,
    };
    if (email) body.reply_to = email;
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    // No rompemos el webhook: el pago queda registrado en Stripe.
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end('Method not allowed');
  }
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const raw = await readRaw(req);

  if (!secret) {
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: false, reason: 'STRIPE_WEBHOOK_SECRET no configurado' }));
  }
  if (!verifySignature(raw, req.headers['stripe-signature'], secret)) {
    res.statusCode = 400;
    return res.end('Invalid signature');
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    res.statusCode = 400;
    return res.end('Bad payload');
  }

  if (event.type === 'checkout.session.completed') {
    const s = event.data && event.data.object ? event.data.object : {};
    if (s.payment_status === 'paid') {
      const email = (s.customer_details && s.customer_details.email) || s.customer_email || '';
      const auditWeb = customField(s, 'urldetuweb'); // campo de los enlaces de auditoría
      // La web del informe llega por client_reference_id (flujo del analizador) o, si no,
      // por el campo "URL de tu web" que el cliente rellenó en el checkout.
      const url = urlFromRef(s.client_reference_id || '') || (auditWeb.present ? auditWeb.value : '');
      const wpo = customField(s, 'web'); // presente solo en los Payment Links de WPO

      if (email && url) {
        // Producto de auditoría → entrega automática del informe según el plan pagado
        // (Exprés / Pro / 360). El 360 puede incluir la web de un competidor.
        const tier = tierFromAmount(s.amount_total || 0);
        const competitor = customField(s, 'competidor').value;
        try {
          await fetch(DELIVER_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-deliver-secret': process.env.DELIVER_SECRET || '',
            },
            body: JSON.stringify({ url, email, tier, competitor }),
          });
        } catch (e) {
          // No rompemos el webhook: devolvemos 200 igualmente para evitar reintentos en bucle.
          // (Si fallara la entrega, el pedido queda en Stripe para envío manual.)
        }
      } else if (wpo.present) {
        // Servicio WPO → entrega manual: avisamos al dueño para que empiece el trabajo.
        await notifyWpoSale({ email, web: wpo.value, amount: s.amount_total || 0 });
      }
    }
  }

  res.statusCode = 200;
  return res.end(JSON.stringify({ received: true }));
}
