// Guía de bares y restaurantes de la zona (Gran Alacant, Santa Pola…).
// Datos de hecho procedentes de OpenStreetMap (© colaboradores de OSM, ODbL),
// enriquecidos con geocodificación inversa. Las descripciones son propias.
import raw from './lugares.json';
import descripcionesRaw from './descripciones.json';

export type Lang = 'es' | 'en';

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

export const DESCRIPCIONES: Record<string, { es?: string; en?: string }> =
  descripcionesRaw as Record<string, { es?: string; en?: string }>;

// ── Metadatos de categorías (bilingüe) ─────────────────────────────────────
export const CATEGORIAS: Record<TypeKey, { es: string; en: string; plural_es: string; plural_en: string; icon: string }> = {
  'restaurante':   { es: 'Restaurante', en: 'Restaurant',  plural_es: 'Restaurantes', plural_en: 'Restaurants', icon: '🍽️' },
  'bar':           { es: 'Bar',         en: 'Bar',          plural_es: 'Bares',        plural_en: 'Bars',        icon: '🍺' },
  'pub':           { es: 'Pub',         en: 'Pub',          plural_es: 'Pubs',         plural_en: 'Pubs',        icon: '🍻' },
  'cafeteria':     { es: 'Cafetería',   en: 'Café',         plural_es: 'Cafeterías',   plural_en: 'Cafés',       icon: '☕' },
  'comida-rapida': { es: 'Comida rápida', en: 'Fast food',  plural_es: 'Comida rápida', plural_en: 'Fast food', icon: '🍔' },
  'cerveceria':    { es: 'Cervecería',  en: 'Beer garden',  plural_es: 'Cervecerías',  plural_en: 'Beer gardens', icon: '🍺' },
};

export const TYPE_ORDER: TypeKey[] = ['restaurante', 'bar', 'pub', 'cafeteria', 'comida-rapida', 'cerveceria'];

export const ZONAS = ['Gran Alacant', 'Santa Pola', 'Alicante', 'Elche'] as const;

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
  return DESCRIPCIONES[l.osm_id]?.[lang];
}

export function direccion(l: Lugar): string {
  const parts = [
    l.street ? `${l.street}${l.housenumber ? ', ' + l.housenumber : ''}` : null,
    l.neighbourhood && l.neighbourhood !== l.street ? l.neighbourhood : null,
    l.zone,
  ].filter(Boolean);
  return parts.join(' · ');
}

/** Título legible de tipo + cocina para subtítulos. */
export function tipoLabel(l: Lugar, lang: Lang): string {
  return CATEGORIAS[l.type]?.[lang] ?? l.type;
}

/** ¿Pinta de sitio británico/expat? (nombre en inglés o pub). Para el filtro "British-friendly". */
export function esBritanico(l: Lugar): boolean {
  if (l.type === 'pub') return true;
  const n = l.name.toLowerCase();
  return /\b(the|british|english|grill|tavern|inn|lounge|fish|chips|breakfast|pub)\b/.test(n) || / & /.test(l.name);
}

export const TOTAL = LUGARES.length;
