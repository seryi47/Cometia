// Webhook de Stripe para SUSCRIPCIONES → actualiza el plan y el cupo de la org.
//   Eventos: checkout.session.completed (alta), customer.subscription.updated/deleted.
//   Endpoint separado del webhook del informe (usa STRIPE_BILLING_WEBHOOK_SECRET).
import { serviceClient } from '../_lib/supabase.js';
import { verifySignature, PLAN_LIMIT } from '../_lib/stripe.js';

export const config = { api: { bodyParser: false } };

function readRaw(req) {
  return new Promise((resolve, reject) => {
    let d = '';
    req.on('data', (c) => (d += c));
    req.on('end', () => resolve(d));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.statusCode = 405; return res.end('Method not allowed'); }
  const secret = process.env.STRIPE_BILLING_WEBHOOK_SECRET;
  const raw = await readRaw(req);
  if (!secret) { res.statusCode = 200; return res.end(JSON.stringify({ ok: false, reason: 'sin secret' })); }
  if (!verifySignature(raw, req.headers['stripe-signature'], secret)) { res.statusCode = 400; return res.end('Invalid signature'); }

  let event;
  try { event = JSON.parse(raw); } catch { res.statusCode = 400; return res.end('Bad payload'); }

  const svc = serviceClient();
  try {
    if (event.type === 'checkout.session.completed') {
      const s = event.data.object;
      if (s.mode === 'subscription') {
        const orgId = s.client_reference_id || (s.metadata && s.metadata.org_id);
        const plan = (s.metadata && s.metadata.plan) || 'starter';
        if (orgId) await svc.from('organizations').update({
          plan, website_limit: PLAN_LIMIT[plan] || 1,
          stripe_customer_id: s.customer, stripe_subscription_id: s.subscription, subscription_status: 'active',
        }).eq('id', orgId);
      }
    } else if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object;
      const orgId = sub.metadata && sub.metadata.org_id;
      if (orgId) {
        const patch = { subscription_status: sub.status };
        if (sub.status === 'canceled' || sub.status === 'unpaid') { patch.plan = 'free'; patch.website_limit = 1; }
        await svc.from('organizations').update(patch).eq('id', orgId);
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      const orgId = sub.metadata && sub.metadata.org_id;
      if (orgId) await svc.from('organizations').update({
        plan: 'free', website_limit: 1, subscription_status: 'canceled', stripe_subscription_id: null,
      }).eq('id', orgId);
    }
  } catch (e) {
    // No rompemos: 200 para evitar reintentos en bucle. El estado real vive en Stripe.
  }

  res.statusCode = 200;
  return res.end(JSON.stringify({ received: true }));
}
