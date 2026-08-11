# Auditalia — Puesta en marcha

Sitio estático de **Auditalia** (auditoría web y SEO exprés) construido con
**Astro**. Incluye una herramienta serverless que analiza URLs con la API de
**Google PageSpeed Insights** (sin IA, sin tokens).

> Auditalia es un proyecto de **Órbita Labs**.

## 1. Requisitos

- Node.js 18.20+ o 20+ (recomendado 20 o superior)
- npm

## 2. Arrancar en local

```bash
npm install      # instala dependencias (proyecto nuevo)
npm run dev      # servidor de desarrollo en http://localhost:4321
npm run build    # genera el sitio en dist/
npm run preview  # sirve el build de dist/
```

## 3. Activar el COBRO (lo que pega el dueño)

Todos los botones de compra están **GATED**: mientras no pegues tus enlaces
reales, el botón NO se rompe — cae en un `mailto:` de contacto
("Reserva tu plaza"). Para activar el cobro solo tienes que dar de alta
enlaces de pago (Stripe Payment Links, PayPal.me, Bizum web, etc.).

Puedes hacerlo de dos formas:

### Opción A — Variables de entorno (recomendado en Vercel)

Crea un archivo `.env` en la raíz (o configúralas en Vercel → Settings →
Environment Variables). Deben empezar por `PUBLIC_` para que lleguen al
navegador:

```bash
PUBLIC_PAY_EXPRES=https://buy.stripe.com/tu_enlace_expres
PUBLIC_PAY_PRO=https://buy.stripe.com/tu_enlace_pro
PUBLIC_PAY_360=https://buy.stripe.com/tu_enlace_360
PUBLIC_PAY_PACK3=https://buy.stripe.com/tu_enlace_pack3
```

### Opción B — Editar `src/config.ts`

Sustituye los valores `TODO_ENLACE_PAGO_*` por tus enlaces reales en el objeto
`payment`.

En cuanto un enlace deja de ser un placeholder (deja de estar vacío y de
contener `TODO` o `XXXX`), el botón pasa automáticamente de
**"Reserva tu plaza" (mailto)** a **"Contratar auditoría" (enlace de pago)**.

## 4. La HERRAMIENTA de auditoría GRATIS (PageSpeed) — ya funciona

La herramienta del hero ("Analiza tu web gratis") llama a la función
serverless `api/audit.js`, que usa la **API de PageSpeed Insights de Google**.

**No necesitas configurar nada para que funcione.** La API v5 `runPagespeed`
responde **sin API key** (con límites de cuota), así que el análisis gratis
está operativo desde el primer despliegue: el usuario mete su URL y ve las
notas reales.

### (Opcional) Ampliar la cuota con una API key

Si esperas mucho volumen y quieres evitar los límites de la cuota anónima,
añade una API key gratuita de Google (25.000 consultas/día):

1. Consíguela en:
   <https://developers.google.com/speed/docs/insights/v5/get-started>
2. En Vercel → Settings → Environment Variables, añade:

   ```bash
   PAGESPEED_API_KEY=tu_api_key_de_google
   ```

   (Variable **de servidor**, NO lleva prefijo `PUBLIC_` y nunca se expone al
   navegador. Si está presente, se usa; si no, se llama sin key igualmente.)

Si Google devuelve un error puntual (cuota temporal, web inaccesible), el
formulario muestra un mensaje claro o cae con elegancia en un `mailto:` de
contacto. Nunca se queda roto.

## 5. Desplegar en Vercel

El proyecto está pensado para **Vercel**:

- Framework detectado: **Astro** (sitio estático en `dist/`).
- La carpeta `api/` se despliega automáticamente como **Vercel Functions**
  (Node.js), así que `/api/audit` funcionará sin configuración extra.

```bash
# con Vercel CLI
vercel        # despliegue de prueba
vercel --prod # producción
```

Recuerda configurar el dominio `auditalia.es` y las variables de entorno del
paso 3 y 4 en el panel de Vercel.

## 6. Personalizar

- **Marca, dominio, email:** `src/config.ts` (objeto `brand`).
- **Precios y qué incluye cada plan:** `src/config.ts` (array `plans`).
- **Textos de la web:** `src/pages/index.astro`.
- **Datos legales** ([NOMBRE / NIF / DOMICILIO]): `src/pages/aviso-legal.astro`
  y `src/pages/privacidad.astro`.
- **Diseño / colores:** `src/styles/global.css` (variables CSS en `:root`).

## 7. Resumen: qué se paga y sin tokens

- **Dominio:** ~12 €/año.
- **Hosting Vercel:** gratis (plan hobby).
- **PageSpeed API:** gratis (25k/día).
- **LLM / tokens:** **0 € — no se usan.** Todo es API de Google + reglas.
