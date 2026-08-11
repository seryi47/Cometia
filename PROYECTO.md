# Cometia  ·  cometia.es

> Auditoría web y SEO para pymes.

**Estado:** LIVE en cometia.es. Stripe (4 Payment Links) y Resend operativos; informe en PDF automático por email en minutos. SEO 100 y Accesibilidad 100.
**Precio / modelo:** Informe desde 9,90 € — Exprés 9,90 · Pro 19 · 360º 39 · Pack 3 reventa 24. IVA no incluido.
**Stack:** Astro 7 (+ @astrojs/sitemap) · funciones serverless en `/api` (audit, deliver) con `pdf-lib` · deploy en Vercel

## Qué es
Cometia analiza cualquier web al instante y devuelve las 4 notas oficiales de Google (velocidad, SEO, accesibilidad y buenas prácticas) mediante la API de PageSpeed Insights. El informe de pago añade las 5 dimensiones a fondo —velocidad, SEO, accesibilidad, móvil y seguridad— con recomendaciones priorizadas por impacto, y se entrega en PDF por correo en minutos. Dirigido a pymes y autónomos españoles que quieren saber qué falla en su web y qué arreglar primero, sin jerga.

## Pendiente para lanzar
- [ ] Rellenar los datos legales: `[NOMBRE / RAZÓN SOCIAL]`, `[NIF]` y `[DOMICILIO]` siguen como placeholders en `src/pages/aviso-legal.astro` y `src/pages/privacidad.astro` (y arrastrados al `dist/`).
- [ ] Regenerar el build (`npm run build`) y redesplegar tras corregir los legales: el `dist/` publicado todavía contiene esos placeholders.
- [ ] (Opcional) Homogeneizar el naming heredado: `package.json` y el proyecto de Vercel siguen como `auditalia`, y el `README.md` describe la versión antigua (Auditalia, 99–199 €), no la ficha actual de Cometia.

## Notas
- Carpeta: `OrbitaLabs/cometia`
- Build en `dist/`: **sí** (generado el 2026-07-28, con los 4 enlaces de Stripe ya incrustados y las páginas legales con placeholders).
- `.vercel` conectado: **sí** (`project.json` presente; `projectName: auditalia`, nombre heredado).
- No es repositorio Git (sin remoto ni control de versiones local).
- Pagos: los 4 Payment Links de Stripe están configurados como fallback en `src/config.ts` (arquitectura "gated": si un enlace fuese placeholder, el botón cae con elegancia en contacto/mailto).
- Envío por email (Resend) y PageSpeed van por variables de entorno en Vercel (`RESEND_API_KEY`, `RESEND_FROM`, `PAGESPEED_API_KEY`); no están en el `.env.local` local (solo un `VERCEL_OIDC_TOKEN` vacío), lo cual es normal. La herramienta de análisis gratis funciona sin API key.
- Docs internas presentes: `README.md` (plan de negocio, desactualizado), `SETUP.md` y `OUTREACH-FISIOS-ALBACETE.md`.

---
*Portfolio de Órbita Labs · ficha revisable.*
