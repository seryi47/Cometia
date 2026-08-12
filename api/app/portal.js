// POST /api/app/portal → URL del portal de cliente de Stripe (gestionar/cancelar).
import { serviceClient, userFromRequest, userOrgIds, isConfigured } from '../_lib/supabase.js';
import { stripe, stripeConfigured } from '../_lib/stripe.js';
import { json } from '../_lib/http.js';

export const config = { maxDuration: 20 };

export default async function handler(req, res) {
  if (!isConfigured() || !stripeConfigured()) return json(res, 503, { error: 'Pagos no configurados.' });
  if (req.method !== 'POST') return json(res, 405, { error: 'Método no permitido.' });
  const user = await userFromRequest(req);
  if (!user) return json(res, 401, { error: 'No autenticado.' });
  const svc = serviceClient();
  const orgs = await userOrgIds(svc, user.id);
  if (!orgs.length) return json(res, 403, { error: 'Sin organización.' });

  const { data: org } = await svc.from('organizations').select('stripe_customer_id').eq('id', orgs[0]).single();
  if (!org || !org.stripe_customer_id) return json(res, 400, { error: 'No tienes una suscripción activa.' });

  const appUrl = process.env.PUBLIC_APP_URL || 'https://cometia.es';
  try {
    const sess = await stripe('/billing_portal/sessions', { customer: org.stripe_customer_id, return_url: appUrl + '/app/plan' });
    return json(res, 200, { url: sess.url });
  } catch (e) {
    return json(res, 500, { error: e.message });
  }
}
