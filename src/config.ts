/**
 * Configuración central de Cometia.
 *
 * Aquí viven TODAS las integraciones "de dinero" (enlaces de pago) y la
 * clave de la herramienta de auditoría (PageSpeed). Todo está GATED:
 * si un valor está vacío o es un placeholder (contiene TODO / XXXX),
 * la web NO muestra un botón roto — cae con elegancia en el formulario
 * de contacto / mailto ("Reserva tu plaza" / "Solicita tu auditoría").
 *
 * El dueño solo tiene que pegar sus enlaces reales aquí (o mediante
 * variables de entorno PUBLIC_*) para activar el cobro. Ver SETUP.md.
 */

/** Lee una variable de entorno PUBLIC_* con fallback a un valor por defecto. */
function env(key: string, fallback = ''): string {
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  return value ?? fallback;
}

/**
 * Devuelve true si un valor está REALMENTE configurado.
 * Un valor se considera placeholder (NO configurado) si está vacío
 * o contiene TODO / XXXX (en cualquier combinación de mayúsculas).
 */
export function isConfigured(value: string | undefined | null): boolean {
  if (!value) return false;
  const v = value.trim();
  if (v === '') return false;
  const upper = v.toUpperCase();
  if (upper.includes('TODO')) return false;
  if (upper.includes('XXXX')) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Marca
// ---------------------------------------------------------------------------
export const brand = {
  name: 'Cometia',
  legalName: 'Cometia',
  domain: 'cometia.es',
  url: 'https://cometia.es',
  email: 'cometia.es@gmail.com',
  tagline: 'Descubre por qué tu web pierde clientes en 60 segundos.',
  description:
    'El diagnóstico de tu web para pymes: qué falla, cuánto importa y qué arreglar primero, con datos reales de Google. Radiografía gratis, informe completo por 19 €, y si hace falta lo arreglamos.',
  parent: 'Órbita Labs',
  phone: '', // opcional, gated
  whatsapp: '34657884613', // número para wa.me (sin +, sin espacios)
  whatsappDisplay: '+34 657 88 46 13',
};

// ---------------------------------------------------------------------------
// Enlaces de pago (GATED) — uno por producto.
// Pega aquí tu enlace de Stripe Payment Link / PayPal.me / Bizum, etc.
// Mientras contengan TODO/XXXX o estén vacíos, el botón cae en contacto.
// ---------------------------------------------------------------------------
export const payment = {
  expres: env('PUBLIC_PAY_EXPRES', 'https://buy.stripe.com/8x2fZh2TKcmM4y2fU26c008'), // ✅ Cometia Exprés 4,90 €
  pro: env('PUBLIC_PAY_PRO', 'https://buy.stripe.com/4gM14neCsgD2d4yePY6c009'), // ✅ Cometia Pro 9,90 €
  a360: env('PUBLIC_PAY_360', 'https://buy.stripe.com/4gM9AT9i8dqQ0hMcHQ6c00a'), // ✅ Cometia 360 19,90 €
  pack3: env('PUBLIC_PAY_PACK3', 'https://buy.stripe.com/7sYcN5gKAgD2d4yazI6c00b'), // ✅ Pack 3 auditorías 12,90 €
  // Optimización de velocidad (WPO): 3 Payment Links en Stripe (15/29/49 €), campo "URL de tu web".
  informe: env('PUBLIC_PAY_INFORME', 'https://buy.stripe.com/dRmdR9cuk2Mc4y24bk6c00f'), // ✅ Informe completo 19,00 €
  wpoBasico: env('PUBLIC_PAY_WPO_BASICO', 'https://buy.stripe.com/cNi14n0LCfyYggKdLU6c00g'), // ✅ WPO Web pequeña 19 €
  wpoPro: env('PUBLIC_PAY_WPO_PRO', 'https://buy.stripe.com/3cI5kDgKA2Mc5C66js6c00h'), // ✅ WPO WordPress/tienda 25 €
  wpoPremium: env('PUBLIC_PAY_WPO_PREMIUM', 'https://buy.stripe.com/6oU6oHgKA9aA1lQfU26c00i'), // ✅ WPO Web grande 29 €
};

// ---------------------------------------------------------------------------
// Herramienta de auditoría GRATIS (PageSpeed Insights).
// FUNCIONA SIN CONFIGURACIÓN: la API v5 de Google corre sin API key (con
// límites de cuota), así que "Analiza tu web gratis" está operativo desde
// el minuto uno. La variable PAGESPEED_API_KEY (servidor) es OPCIONAL y
// solo se usa para ampliar la cuota. Por eso está siempre activa.
// ---------------------------------------------------------------------------
export const tool = {
  enabled: true,
  endpoint: '/api/audit',
};

// ---------------------------------------------------------------------------
// Productos / planes (copy real del plan)
// ---------------------------------------------------------------------------
export interface Plan {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  tagline: string;
  features: string[];
  featured?: boolean;
  paymentLink: string;
}

export const plans: Plan[] = [
  {
    id: 'expres',
    name: 'Cometia Exprés',
    price: 4.9,
    priceLabel: '4,90 €',
    tagline: 'El informe completo de tu web, a precio de entrada.',
    features: [
      'Informe profesional con nota global 0–100',
      'Semáforo por área: velocidad, SEO, accesibilidad, móvil y seguridad',
      'Datos oficiales de Google',
      'Recomendaciones priorizadas por impacto',
      'Informe al instante por email, en minutos',
    ],
    paymentLink: payment.expres,
  },
  {
    id: 'pro',
    name: 'Cometia Pro',
    price: 9.9,
    priceLabel: '9,90 €',
    tagline: 'El informe completo, más a fondo.',
    featured: true,
    features: [
      'Todo lo del plan Exprés',
      'Análisis ampliado de cada una de las 5 áreas',
      'Resolvemos tus dudas por email',
      'Qué arreglar primero y por qué, en cristiano',
      'Presupuesto orientativo de las mejoras',
    ],
    paymentLink: payment.pro,
  },
  {
    id: 'a360',
    name: 'Cometia 360',
    price: 19.9,
    priceLabel: '19,90 €',
    tagline: 'Diagnóstico, competencia y hoja de ruta.',
    features: [
      'Todo lo del plan Pro',
      'Análisis comparativo con tu competencia directa',
      'Plan de acción a 3 meses paso a paso',
      'Priorización por impacto/esfuerzo (quick wins primero)',
      'Seguimiento de resultados',
    ],
    paymentLink: payment.a360,
  },
];

// Producto único de informe (nuevo modelo: Radiografía gratis + este informe + WPO).
// Reutiliza el Payment Link de 19,90 € ya creado en Stripe.
export const informe = {
  name: 'Informe completo',
  priceLabel: '19 €',
  price: 19,
  paymentLink: payment.informe,
};

// Pack para gestorías / asociaciones que revenden
export const packReventa = {
  id: 'pack3',
  name: 'Pack 3 auditorías',
  price: 12.9,
  priceLabel: '12,90 €',
  tagline: 'Para gestorías y asociaciones que revenden a sus asociados (3 informes Exprés).',
  paymentLink: payment.pack3,
};

// ---------------------------------------------------------------------------
// Enlaces sociales (opcionales, gated)
// ---------------------------------------------------------------------------
export const social = {
  linkedin: env('PUBLIC_LINKEDIN', ''),
};

export const config = { brand, payment, tool, plans, packReventa, social };
export default config;
