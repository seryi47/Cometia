// POST /api/app/checkout { plan: 'starter'|'agency' } → URL de Stripe Checkout (suscripción).
import { serviceClient, userFromRequest, userOrgIds, isConfigured } from '../_lib/supabase.js';
import { stripe, stripeConfigured, PLAN_LIMIT } from '../_lib/stripe.js';
import { readBody, json } from '../_lib/http.js';

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  if (!isConfigured() || !stripeConfigured()) return json(res, 503, { error: 'Pagos no configurados todavía.' });
  if (req.method !== 'POST') return json(res, 405, { error: 'Método no permitido.' });
  const user = await userFromRequest(req);
  if (!user) return json(res, 401, { error: 'No autenticado.' });
  const svc = serviceClient();
  const orgs = await userOrgIds(svc, user.id);
  if (!orgs.length) return json(res, 403, { error: 'Sin organización.' });
  const orgId = orgs[0];

  const b = await readBody(req);
  const prices = { starter: process.env.STRIPE_PRICE_STARTER, agency: process.env.STRIPE_PRICE_AGENCY };
  const price = prices[b.plan];
  if (!price) return json(res, 400, { error: 'Plan no válido.' });

  const { data: org } = await svc.from('organizations').select('*').eq('id', orgId).single();
  const appUrl = process.env.PUBLIC_APP_URL || 'https://cometia.es';
  const meta = { org_id: orgId, plan: b.plan, website_limit: PLAN_LIMIT[b.plan] || 1 };
  const params = {
    mode: 'subscription',
    line_items: [{ price, quantity: 1 }],
    success_url: appUrl + '/app/plan?ok=1',
    cancel_url: appUrl + '/app/plan',
    client_reference_id: orgId,
    metadata: meta,
    subscription_data: { metadata: meta },
    allow_promotion_codes: true,
  };
  if (org && org.stripe_customer_id) params.customer = org.stripe_customer_id;
  else params.customer_email = user.email;

  try {
    const session = await stripe('/checkout/sessions', params);
    return json(res, 200, { url: session.url });
  } catch (e) {
    return json(res, 500, { error: e.message });
  }
}
