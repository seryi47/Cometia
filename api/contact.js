// =============================================================
// Formulario de contacto de Cometia (vía Resend).
//   1) AVISO AL NEGOCIO → cometia.es@gmail.com con el mensaje (reply_to al visitante).
//   2) CONFIRMACIÓN AL VISITANTE → "¡Hemos recibido tu mensaje!" (email bonito).
// Requiere RESEND_API_KEY en Vercel. El dominio cometia.es ya está verificado en
// Resend (se usa para enviar los informes), así que la confirmación al visitante
// también funciona. Si el aviso al negocio fallara, se responde 502 con el email
// de contacto para que el usuario nunca se quede sin vía.
// =============================================================
const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEST = 'cometia.es@gmail.com';
const SITE = 'https://cometia.es';

function validEmail(e) {
  return typeof e === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// Cáscara de email branded (Cometia — editorial, papel cálido).
function shell(bodyHtml) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3eee3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#181510">
  <div style="max-width:560px;margin:0 auto;padding:24px 14px">
    <div style="background:#181510;padding:20px 26px">
      <span style="display:inline-flex;align-items:center;gap:9px;font-weight:800;font-size:22px;letter-spacing:-0.04em;color:#f3eee3">
        <span style="display:inline-block;width:12px;height:12px;background:#1b2ed8;border-radius:50%"></span>cometia
      </span>
    </div>
    <div style="background:#ffffff;border:1.5px solid #181510;border-top:0;padding:28px 26px">${bodyHtml}</div>
    <p style="text-align:center;color:#8a8272;font-size:12px;line-height:1.5;margin:16px 0 0">Cometia · Auditoría web y SEO para pymes<br>Un proyecto de Órbita Labs</p>
  </div>
</body></html>`;
}

function btn(href, label) {
  return `<a href="${href}" style="display:inline-block;background:#1b2ed8;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 22px;border:1.5px solid #1b2ed8">${label}</a>`;
}

function businessHtml(name, email, message) {
  return shell(
    `<h1 style="font-size:20px;margin:0 0 2px;color:#181510;letter-spacing:-0.02em">Nuevo mensaje de contacto</h1>
     <p style="color:#5b544a;margin:0 0 20px;font-size:13px">Recibido desde el formulario de cometia.es</p>
     <p style="margin:0 0 4px;color:#5b544a;font-size:13px">De</p>
     <p style="margin:0 0 16px;font-size:16px;font-weight:700;color:#181510">${esc(name)} &lt;<a href="mailto:${esc(email)}" style="color:#1b2ed8;text-decoration:none">${esc(email)}</a>&gt;</p>
     <div style="background:#faf7f0;border-left:3px solid #1b2ed8;padding:14px 16px">
       <p style="margin:0;white-space:pre-wrap;font-size:15px;line-height:1.55;color:#181510">${esc(message)}</p>
     </div>
     <p style="margin:22px 0 0">${btn('mailto:' + esc(email) + '?subject=' + encodeURIComponent('Re: tu mensaje a Cometia'), 'Responder a ' + esc(name))}</p>`
  );
}

function visitorHtml(name, message) {
  return shell(
    `<h1 style="font-size:22px;margin:0 0 10px;color:#181510;letter-spacing:-0.02em">¡Hemos recibido tu mensaje! 📩</h1>
     <p style="font-size:15px;line-height:1.6;margin:0 0 16px;color:#181510">Hola <strong>${esc(name)}</strong>, gracias por escribirnos. Hemos recibido tu mensaje y te responderemos lo antes posible (normalmente el mismo día laborable).</p>
     <p style="margin:0 0 6px;color:#5b544a;font-size:13px">Esto es lo que nos has contado:</p>
     <div style="background:#faf7f0;border-left:3px solid #1b2ed8;padding:14px 16px;margin-bottom:22px">
       <p style="margin:0;white-space:pre-wrap;font-size:15px;line-height:1.55;color:#181510">${esc(message)}</p>
     </div>
     <p style="font-size:15px;line-height:1.6;margin:0 0 16px;color:#181510">Mientras tanto, si quieres, analiza tu web gratis en 60 segundos y mira sus notas reales de Google:</p>
     <p style="margin:0 0 8px">${btn(SITE + '/#analizar', 'Analizar mi web gratis')}</p>
     <p style="color:#8a8272;font-size:12px;line-height:1.5;margin:22px 0 0">Mensaje automático de confirmación. Si no has escrito tú, puedes ignorarlo.</p>`
  );
}

async function sendEmail(key, payload) {
  const r = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return r.ok;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || typeof body !== 'object') body = {};

  const name = String(body.name || '').trim().slice(0, 120);
  const email = String(body.email || '').trim().slice(0, 160);
  const message = String(body.message || '').trim().slice(0, 4000);

  if (!name || !validEmail(email) || message.length < 5) {
    res.status(400).json({ error: 'Revisa los datos: nombre, un email válido y un mensaje.' });
    return;
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    res.status(200).json({ ok: false, configured: false, message: 'Escríbenos directamente a ' + DEST });
    return;
  }
  const from = process.env.RESEND_FROM || 'Cometia <onboarding@resend.dev>';

  // 1) Aviso al negocio (imprescindible: es donde ves y respondes las consultas).
  let businessOk = false;
  try {
    businessOk = await sendEmail(key, {
      from,
      to: [DEST],
      reply_to: email,
      subject: `📩 Contacto Cometia — ${name}`,
      html: businessHtml(name, email, message),
    });
  } catch (e) {
    businessOk = false;
  }

  // 2) Confirmación bonita al visitante (best-effort).
  try {
    await sendEmail(key, {
      from,
      to: [email],
      subject: '¡Hemos recibido tu mensaje! — Cometia',
      html: visitorHtml(name, message),
    });
  } catch (e) {
    /* No rompemos el flujo si la confirmación falla. */
  }

  if (businessOk) {
    res.status(200).json({ ok: true });
    return;
  }
  res.status(502).json({ ok: false, error: 'No se ha podido enviar ahora. Escríbenos a ' + DEST });
}
