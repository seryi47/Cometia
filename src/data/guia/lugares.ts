// Guía de bares y restaurantes de la zona (Gran Alacant, Santa Pola…).
// Datos de hecho procedentes de OpenStreetMap (© colaboradores de OSM, ODbL),
// enriquecidos con geocodificación inversa. Las descripciones son propias.
import raw from './lugares.json';
import descripcionesRaw from './descripciones.json';
import { LANG_META, LANGS, homeUrl, pageUrl, type Lang } from '../../i18n';
export type { Lang };

export interface Lugar {
  osm_id: string;
  slug: string;
  name: string;
  amenity: string;               // valor OSM crudo
  type: TypeKey;                 // clave normalizada
  cuisine?: string | null;
  lat: number;
  lng: number;
  street?: string | null;
  housenumber?: string | null;
  city?: string | null;
  postcode?: string | null;
  phone?: string | null;
  website?: string | null;
  opening_hours?: string | null;
  outdoor?: string | null;
  diet_veg?: string | null;
  zone: string;                 // 'Gran Alacant' | 'Santa Pola'
  neighbourhood?: string | null;
  photo?: string | null;        // URL de foto libre (Wikimedia/OSM) o subida
  photo_credit?: string | null; // atribución
  photo_fit?: 'cover' | 'contain' | null;
}

export type TypeKey = 'restaurante' | 'bar' | 'pub' | 'cafeteria' | 'comida-rapida' | 'cerveceria';

export const LUGARES: Lugar[] = raw as Lugar[];

export const DESCRIPCIONES: Record<string, Partial<Record<Lang, string>>> =
  descripcionesRaw as Record<string, Partial<Record<Lang, string>>>;

// ── Metadatos de categorías ────────────────────────────────────────────────
export const CATEGORIAS: Record<TypeKey, { icon: string }> = {
  'restaurante':   { icon: '🍽️' },
  'bar':           { icon: '🍺' },
  'pub':           { icon: '🍻' },
  'cafeteria':     { icon: '☕' },
  'comida-rapida': { icon: '🍔' },
  'cerveceria':    { icon: '🍺' },
};

// Etiquetas [singular, plural] por tipo e idioma.
export const CAT_LABEL: Record<TypeKey, Record<Lang, [string, string]>> = {
  'restaurante':   { es: ['Restaurante', 'Restaurantes'], en: ['Restaurant', 'Restaurants'], de: ['Restaurant', 'Restaurants'], fr: ['Restaurant', 'Restaurants'], nl: ['Restaurant', 'Restaurants'], no: ['Restaurant', 'Restauranter'], sv: ['Restaurang', 'Restauranger'] },
  'bar':           { es: ['Bar', 'Bares'], en: ['Bar', 'Bars'], de: ['Bar', 'Bars'], fr: ['Bar', 'Bars'], nl: ['Bar', 'Bars'], no: ['Bar', 'Barer'], sv: ['Bar', 'Barer'] },
  'pub':           { es: ['Pub', 'Pubs'], en: ['Pub', 'Pubs'], de: ['Pub', 'Pubs'], fr: ['Pub', 'Pubs'], nl: ['Pub', 'Pubs'], no: ['Pub', 'Puber'], sv: ['Pub', 'Pubar'] },
  'cafeteria':     { es: ['Cafetería', 'Cafeterías'], en: ['Café', 'Cafés'], de: ['Café', 'Cafés'], fr: ['Café', 'Cafés'], nl: ['Café', 'Cafés'], no: ['Kafé', 'Kafeer'], sv: ['Kafé', 'Kaféer'] },
  'comida-rapida': { es: ['Comida rápida', 'Comida rápida'], en: ['Fast food', 'Fast food'], de: ['Fast Food', 'Fast Food'], fr: ['Fast-food', 'Fast-foods'], nl: ['Fastfood', 'Fastfood'], no: ['Hurtigmat', 'Hurtigmat'], sv: ['Snabbmat', 'Snabbmat'] },
  'cerveceria':    { es: ['Cervecería', 'Cervecerías'], en: ['Beer garden', 'Beer gardens'], de: ['Bierlokal', 'Bierlokale'], fr: ['Brasserie', 'Brasseries'], nl: ['Bierlokaal', 'Bierlokalen'], no: ['Ølstue', 'Ølstuer'], sv: ['Ölhak', 'Ölhak'] },
};
export function tipoSingular(t: TypeKey, lang: Lang): string { return CAT_LABEL[t][lang][0]; }
export function tipoPlural(t: TypeKey, lang: Lang): string { return CAT_LABEL[t][lang][1]; }

export const TYPE_ORDER: TypeKey[] = ['restaurante', 'bar', 'pub', 'cafeteria', 'comida-rapida', 'cerveceria'];

export const ZONAS = ['Gran Alacant', 'Santa Pola', 'Alicante', 'Elche'] as const;

// ── Slugs de URL (zonas y tipos, por idioma) ───────────────────────────────
export const ZONA_SLUG: Record<string, string> = {
  'Gran Alacant': 'gran-alacant', 'Santa Pola': 'santa-pola', 'Alicante': 'alicante', 'Elche': 'elche',
};
export const TIPO_SLUG: Record<Lang, Record<TypeKey, string>> = {
  es: { 'restaurante': 'restaurantes', 'bar': 'bares', 'pub': 'pubs', 'cafeteria': 'cafeterias', 'comida-rapida': 'comida-rapida', 'cerveceria': 'cervecerias' },
  en: { 'restaurante': 'restaurants', 'bar': 'bars', 'pub': 'pubs', 'cafeteria': 'cafes', 'comida-rapida': 'fast-food', 'cerveceria': 'beer-gardens' },
  de: { 'restaurante': 'restaurants', 'bar': 'bars', 'pub': 'pubs', 'cafeteria': 'cafes', 'comida-rapida': 'fast-food', 'cerveceria': 'bierlokale' },
  fr: { 'restaurante': 'restaurants', 'bar': 'bars', 'pub': 'pubs', 'cafeteria': 'cafes', 'comida-rapida': 'fast-food', 'cerveceria': 'brasseries' },
  nl: { 'restaurante': 'restaurants', 'bar': 'bars', 'pub': 'pubs', 'cafeteria': 'cafes', 'comida-rapida': 'fastfood', 'cerveceria': 'bierlokalen' },
  no: { 'restaurante': 'restauranter', 'bar': 'barer', 'pub': 'puber', 'cafeteria': 'kafeer', 'comida-rapida': 'hurtigmat', 'cerveceria': 'olstuer' },
  sv: { 'restaurante': 'restauranger', 'bar': 'barer', 'pub': 'pubar', 'cafeteria': 'kafeer', 'comida-rapida': 'snabbmat', 'cerveceria': 'olhak' },
};
export function zonaSlug(z: string): string { return ZONA_SLUG[z] || ''; }
export function zonaFromSlug(s: string): string | undefined {
  return (Object.keys(ZONA_SLUG)).find((z) => ZONA_SLUG[z] === s);
}
export function tipoFromSlug(s: string, lang: Lang): TypeKey | undefined {
  return TYPE_ORDER.find((t) => TIPO_SLUG[lang][t] === s);
}
/** URL de una página de zona en el idioma dado. */
export function zonaUrl(z: string, lang: Lang): string {
  return `${LANG_META[lang].prefix}/${zonaSlug(z)}`;
}
/** URL de una página global de tipo. */
export function tipoUrl(t: TypeKey, lang: Lang): string {
  return `${LANG_META[lang].prefix}/${TIPO_SLUG[lang][t]}`;
}
/** URL de una página tipo+zona. */
export function zonaTipoUrl(z: string, t: TypeKey, lang: Lang): string {
  return `${LANG_META[lang].prefix}/${zonaSlug(z)}/${TIPO_SLUG[lang][t]}`;
}
/** URL de la ficha de un sitio en el idioma dado. */
export function fichaUrl(slug: string, lang: Lang): string {
  return lang === 'es' ? `/sitio/${slug}` : `${LANG_META[lang].prefix}/place/${slug}`;
}

// ── Helpers ────────────────────────────────────────────────────────────────
export function getLugar(slug: string): Lugar | undefined {
  return LUGARES.find((l) => l.slug === slug);
}

export function porZona(zona: string): Lugar[] {
  return LUGARES.filter((l) => l.zone === zona);
}

export function porTipo(tipo: TypeKey): Lugar[] {
  return LUGARES.filter((l) => l.type === tipo);
}

export function descripcion(l: Lugar, lang: Lang): string | undefined {
  const d = DESCRIPCIONES[l.osm_id];
  return d?.[lang] || d?.en || d?.es;
}

export function direccion(l: Lugar): string {
  const parts = [
    l.street ? `${l.street}${l.housenumber ? ', ' + l.housenumber : ''}` : null,
    l.neighbourhood && l.neighbourhood !== l.street ? l.neighbourhood : null,
    l.zone,
  ].filter(Boolean);
  return parts.join(' · ');
}

/** Título legible de tipo para subtítulos. */
export function tipoLabel(l: Lugar, lang: Lang): string {
  return CAT_LABEL[l.type] ? CAT_LABEL[l.type][lang][0] : l.type;
}

/** ¿Pinta de sitio británico/expat? (nombre en inglés o pub). Para el filtro "British-friendly". */
export function esBritanico(l: Lugar): boolean {
  if (l.type === 'pub') return true;
  const n = l.name.toLowerCase();
  return /\b(the|british|english|grill|tavern|inn|lounge|fish|chips|breakfast|pub)\b/.test(n) || / & /.test(l.name);
}

export function porZonaTipo(zona: string, tipo: TypeKey): Lugar[] {
  return LUGARES.filter((l) => l.zone === zona && l.type === tipo);
}

/** Sitios relacionados (misma zona y tipo; rellena con la misma zona) para enlazado interno. */
export function relacionados(l: Lugar, n = 6): Lugar[] {
  const mismo = LUGARES.filter((x) => x.slug !== l.slug && x.zone === l.zone && x.type === l.type);
  const zona = LUGARES.filter((x) => x.slug !== l.slug && x.zone === l.zone && x.type !== l.type);
  const conFoto = (a: Lugar, b: Lugar) => (b.photo ? 1 : 0) - (a.photo ? 1 : 0);
  return [...mismo.sort(conFoto), ...zona.sort(conFoto)].slice(0, n);
}

export const TOTAL = LUGARES.length;
export const N_FOTOS = LUGARES.filter((l) => l.photo).length;

// ── Mapas de alternativas por idioma (para hreflang y selector de idioma) ───
type Alt = Partial<Record<Lang, string>>;
function mapLangs(fn: (l: Lang) => string): Alt {
  const o: Alt = {};
  for (const l of LANGS) o[l] = fn(l);
  return o;
}
export const altHome = (): Alt => mapLangs((l) => homeUrl(l));
export const altZona = (z: string): Alt => mapLangs((l) => zonaUrl(z, l));
export const altTipo = (t: TypeKey): Alt => mapLangs((l) => tipoUrl(t, l));
export const altZonaTipo = (z: string, t: TypeKey): Alt => mapLangs((l) => zonaTipoUrl(z, t, l));
export const altFicha = (slug: string): Alt => mapLangs((l) => fichaUrl(slug, l));
export const altMap = (): Alt => mapLangs((l) => pageUrl('map', l));
export const altPage = (p: 'about' | 'contact' | 'privacy'): Alt => mapLangs((l) => pageUrl(p, l));
