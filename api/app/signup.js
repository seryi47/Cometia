// POST /api/app/signup { email, password, orgName? }
//   Crea la cuenta YA CONFIRMADA en el servidor (service_role). Sin correos de
//   confirmación: el usuario entra al instante con email + contraseña.
//   El trigger handle_new_user crea su organización (usa org_name si viene).
import { serviceClient, isConfigured } from '../_lib/supabase.js';
import { readBody, json } from '../_lib/http.js';

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  if (!isConfigured()) return json(res, 503, { error: 'Backend no configurado.' });
  if (req.method !== 'POST') return json(res, 405, { error: 'Método no permitido.' });

  const b = await readBody(req);
  const email = String(b.email || '').trim().toLowerCase();
  const password = String(b.password || '');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(res, 400, { error: 'Escribe un email válido.' });
  if (password.length < 8) return json(res, 400, { error: 'La contraseña debe tener al menos 8 caracteres.' });

  const svc = serviceClient();
  const user_metadata = b.orgName ? { org_name: String(b.orgName).slice(0, 80) } : {};
  const { data, error } = await svc.auth.admin.createUser({ email, password, email_confirm: true, user_metadata });
  if (error) {
    const m = (error.message || '').toLowerCase();
    if (m.includes('already') || m.includes('registered') || m.includes('exists') || error.status === 422)
      return json(res, 409, { error: 'Ya hay una cuenta con ese email. Entra con tu contraseña.' });
    return json(res, 500, { error: error.message });
  }
  return json(res, 200, { ok: true, userId: data.user && data.user.id });
}
