// Cliente mínimo de Stripe por fetch (sin SDK). Codifica params anidados al
// formato form-urlencoded que espera Stripe (metadata[x], line_items[0][price]…).
import crypto from 'node:crypto';

function flatten(obj, prefix, out) {
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (v == null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (item != null && typeof item === 'object') flatten(item, `${key}[${i}]`, out);
        else out.push([`${key}[${i}]`, String(item)]);
      });
    } else if (typeof v === 'object') {
      flatten(v, key, out);
    } else {
      out.push([key, String(v)]);
    }
  }
}
function formEncode(obj) {
  const out = [];
  flatten(obj, '', out);
  return out.map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&');
}

export function stripeConfigured() { return !!process.env.STRIPE_SECRET; }

export async function stripe(path, params, method = 'POST') {
  const key = process.env.STRIPE_SECRET;
  const r = await fetch('https://api.stripe.com/v1' + path, {
    method,
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params ? formEncode(params) : undefined,
  });
  const j = await r.json();
  if (!r.ok) throw new Error((j.error && j.error.message) || ('Stripe HTTP ' + r.status));
  return j;
}

// Verifica la firma HMAC-SHA256 de un webhook de Stripe (sin SDK).
export function verifySignature(raw, sigHeader, secret) {
  if (!sigHeader) return false;
  const parts = {};
  for (const kv of String(sigHeader).split(',')) {
    const i = kv.indexOf('=');
    if (i > 0) parts[kv.slice(0, i).trim()] = kv.slice(i + 1).trim();
  }
  const { t, v1 } = parts;
  if (!t || !v1) return false;
  const expected = crypto.createHmac('sha256', secret).update(t + '.' + raw, 'utf8').digest('hex');
  const a = Buffer.from(expected), b = Buffer.from(v1);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const PLAN_LIMIT = { free: 1, starter: 10, agency: 50 };
