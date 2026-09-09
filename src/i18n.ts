// Sistema i18n de Cometia — 7 idiomas.
// ES en la raíz; el resto con prefijo (/en, /de, /fr, /nl, /no, /sv).

export const LANGS = ['es', 'en', 'de', 'fr', 'nl', 'no', 'sv'] as const;
export type Lang = typeof LANGS[number];
export const DEFAULT_LANG: Lang = 'es';

export const LANG_META: Record<Lang, { label: string; flag: string; htmlLang: string; prefix: string; ogLocale: string }> = {
  es: { label: 'Español',    flag: '🇪🇸', htmlLang: 'es', prefix: '',    ogLocale: 'es_ES' },
  en: { label: 'English',    flag: '🇬🇧', htmlLang: 'en', prefix: '/en', ogLocale: 'en_GB' },
  de: { label: 'Deutsch',    flag: '🇩🇪', htmlLang: 'de', prefix: '/de', ogLocale: 'de_DE' },
  fr: { label: 'Français',   flag: '🇫🇷', htmlLang: 'fr', prefix: '/fr', ogLocale: 'fr_FR' },
  nl: { label: 'Nederlands', flag: '🇳🇱', htmlLang: 'nl', prefix: '/nl', ogLocale: 'nl_NL' },
  no: { label: 'Norsk',      flag: '🇳🇴', htmlLang: 'nb', prefix: '/no', ogLocale: 'nb_NO' },
  sv: { label: 'Svenska',    flag: '🇸🇪', htmlLang: 'sv', prefix: '/sv', ogLocale: 'sv_SE' },
};

/** Reemplaza {clave} por vars[clave]. */
export function fmt(str: string, vars: Record<string, string | number> = {}): string {
  return str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

// Slugs de páginas fijas (ES en la raíz con nombre español; resto en inglés).
export const PAGE_SLUG: Record<'map' | 'about' | 'contact' | 'privacy', { es: string; other: string }> = {
  map: { es: 'mapa', other: 'map' },
  about: { es: 'sobre', other: 'about' },
  contact: { es: 'contacto', other: 'contact' },
  privacy: { es: 'privacidad', other: 'privacy' },
};
export function homeUrl(lang: Lang): string { return LANG_META[lang].prefix || '/'; }
export function pageUrl(page: 'map' | 'about' | 'contact' | 'privacy', lang: Lang): string {
  const s = lang === 'es' ? PAGE_SLUG[page].es : PAGE_SLUG[page].other;
  return `${LANG_META[lang].prefix}/${s}`;
}

type Dict = Record<string, string>;

export const UI: Record<Lang, Dict> = {
  es: {
    slogan: 'COMER Y TAPEAR · COSTA BLANCA', tagline: 'Guía de bares y restaurantes de la Costa Blanca',
    nav_map: 'Mapa', nav_about: 'Sobre', nav_contact: 'Contacto', nav_home: 'Inicio', nav_privacy: 'Privacidad',
    langAria: 'Cambiar idioma',
    foot_attr: 'Datos de negocios de los colaboradores de OpenStreetMap (ODbL). Fotos de fachada © sus autores vía Mapillary (CC BY-SA). Las descripciones son propias. Las valoraciones, cuando aparecen, enlazan a Google.',
    card_view: 'Ver ficha →', card_terrace: 'Terraza', card_british: 'British',
    hero_eyebrow: 'Tu guía de la Costa Blanca', hero_h1a: 'Dónde comer y tapear en', hero_grad: 'la Costa Blanca',
    hero_sub: 'Bares, restaurantes, pubs y cafeterías de Gran Alacant, Santa Pola, Alicante y Elche. Con mapa, horarios y ficha de cada sitio.',
    hero_search: 'Busca un bar o restaurante…', cta_map: '🗺️ Ver el mapa', cta_zones: 'Explorar por zona',
    st_places: 'sitios', st_areas: 'zonas', st_photos: 'con foto', st_bilingual: 'idiomas', bilingual_val: '7 idiomas',
    zones_h: 'Explora por zona', zones_lead: 'Elige tu ciudad y descubre todos los sitios para comer, tapear o tomar algo.',
    types_h: 'Explora por tipo', types_lead: 'Restaurantes, bares de tapas, pubs, cafeterías y más — por toda la Costa Blanca.',
    featured_h: 'Sitios destacados', featured_link: 'Ver todos en el mapa →',
    mapband_h: '🗺️ Todos los sitios en un mapa', mapband_p: 'Explora los {n} bares y restaurantes sobre el plano. Filtra por tipo y zona y pulsa cada pin para ver fotos y la ficha completa.', mapband_cta: 'Abrir el mapa interactivo',
    why_h: 'Por qué Cometia', faq_h: 'Preguntas frecuentes',
    z_places: 'sitios', z_seeall: 'Ver los {n} {p} →', z_back: '← Volver a la guía',
    t_best: 'Los mejores {p} de la Costa Blanca', t_intro: 'Guía completa de {p} en Gran Alacant, Santa Pola, Alicante y Elche. {n} sitios con dirección, mapa, horarios y una descripción honesta.', t_inarea: '{n} {p} en {z}', t_seeall: 'Ver los {n} {p} de {z} →', t_count: '{n} {p}',
    zt_best: 'Los mejores {p} de {z}', zt_intro: '{n} {p} en {z} (Costa Blanca), con dirección, mapa, horarios y una descripción honesta. Consulta la guía local completa.', zt_backzone: 'Todos los bares y restaurantes de {z}', zt_backtype: '{p} de toda la Costa Blanca',
    m_crumb: 'Mapa', m_h1a: 'El mapa de la', m_sub: 'Todos los bares, restaurantes, pubs y cafeterías en un solo mapa. Pulsa un pin para ver fotos y la ficha completa.', m_all: 'Todos', m_allz: 'Todas las zonas', m_ver: 'Ver ficha', m_note: 'Cartografía © colaboradores de OpenStreetMap · libre y gratuita · sin tracking', m_terr: 'terrazas',
    f_howto: 'Cómo llegar', f_details: 'Información', f_gmaps: 'Ver en Google Maps y reseñas', f_more: '← Más en {z}', f_website: 'Sitio web', f_related: 'Otros sitios en {z}', f_seealltype: 'Ver todos los {p} de {z} →',
    zona_h1: 'Bares y restaurantes en {z}',
  },
  en: {
    slogan: 'EAT & DRINK · COSTA BLANCA', tagline: 'Costa Blanca food & drink guide',
    nav_map: 'Map', nav_about: 'About', nav_contact: 'Contact', nav_home: 'Home', nav_privacy: 'Privacy',
    langAria: 'Change language',
    foot_attr: 'Business data from OpenStreetMap contributors (ODbL). Street photos © their authors via Mapillary (CC BY-SA). Descriptions are original. Ratings, where shown, link to Google.',
    card_view: 'View details →', card_terrace: 'Terrace', card_british: 'British',
    hero_eyebrow: 'Your Costa Blanca guide', hero_h1a: 'Where to eat & drink on', hero_grad: 'the Costa Blanca',
    hero_sub: 'Bars, restaurants, pubs and cafés in Gran Alacant, Santa Pola, Alicante and Elche. With map, opening hours and a listing for every place.',
    hero_search: 'Search for a bar or restaurant…', cta_map: '🗺️ Open the map', cta_zones: 'Browse by area',
    st_places: 'places', st_areas: 'areas', st_photos: 'with photo', st_bilingual: 'languages', bilingual_val: '7 languages',
    zones_h: 'Browse by area', zones_lead: 'Pick your town and find every place to eat, have tapas or grab a drink.',
    types_h: 'Browse by type', types_lead: 'Restaurants, tapas bars, pubs, cafés and more — right across the Costa Blanca.',
    featured_h: 'Featured places', featured_link: 'See them all on the map →',
    mapband_h: '🗺️ Every place on one map', mapband_p: 'Explore all {n} bars and restaurants on the plan. Filter by type and area and click a pin for photos and the full listing.', mapband_cta: 'Open the interactive map',
    why_h: 'Why Cometia', faq_h: 'Frequently asked questions',
    z_places: 'places', z_seeall: 'See all {n} {p} →', z_back: '← Back to the guide',
    t_best: 'The best {p} on the Costa Blanca', t_intro: 'A complete guide to {p} in Gran Alacant, Santa Pola, Alicante and Elche. {n} places with address, map, opening hours and an honest description.', t_inarea: '{n} {p} in {z}', t_seeall: 'See all {n} {p} in {z} →', t_count: '{n} {p}',
    zt_best: 'The best {p} in {z}', zt_intro: '{n} {p} in {z} (Costa Blanca), with address, map, opening hours and an honest description. Browse the full local guide.', zt_backzone: 'All bars & restaurants in {z}', zt_backtype: '{p} across the Costa Blanca',
    m_crumb: 'Map', m_h1a: 'The map of the', m_sub: 'Every bar, restaurant, pub and café in one map. Click a pin for photos and the full listing.', m_all: 'All', m_allz: 'All areas', m_ver: 'View listing', m_note: 'Map tiles © OpenStreetMap contributors · free & open · no tracking', m_terr: 'terraces',
    f_howto: 'How to get there', f_details: 'Details', f_gmaps: 'See on Google Maps & reviews', f_more: '← More in {z}', f_website: 'Website', f_related: 'More places in {z}', f_seealltype: 'See all {p} in {z} →',
    zona_h1: 'Bars & restaurants in {z}',
  },
  de: {
    slogan: 'ESSEN & TRINKEN · COSTA BLANCA', tagline: 'Costa-Blanca-Führer für Bars & Restaurants',
    nav_map: 'Karte', nav_about: 'Über uns', nav_contact: 'Kontakt', nav_home: 'Start', nav_privacy: 'Datenschutz',
    langAria: 'Sprache ändern',
    foot_attr: 'Betriebsdaten von OpenStreetMap-Mitwirkenden (ODbL). Fassadenfotos © ihre Urheber via Mapillary (CC BY-SA). Die Beschreibungen sind eigene. Bewertungen, wo angezeigt, verlinken zu Google.',
    card_view: 'Details ansehen →', card_terrace: 'Terrasse', card_british: 'British',
    hero_eyebrow: 'Dein Costa-Blanca-Führer', hero_h1a: 'Wo man isst & trinkt an', hero_grad: 'der Costa Blanca',
    hero_sub: 'Bars, Restaurants, Pubs und Cafés in Gran Alacant, Santa Pola, Alicante und Elche. Mit Karte, Öffnungszeiten und Eintrag für jeden Ort.',
    hero_search: 'Bar oder Restaurant suchen…', cta_map: '🗺️ Zur Karte', cta_zones: 'Nach Gebiet stöbern',
    st_places: 'Orte', st_areas: 'Gebiete', st_photos: 'mit Foto', st_bilingual: 'Sprachen', bilingual_val: '7 Sprachen',
    zones_h: 'Nach Gebiet stöbern', zones_lead: 'Wähle deine Stadt und entdecke alle Orte zum Essen, für Tapas oder auf ein Getränk.',
    types_h: 'Nach Art stöbern', types_lead: 'Restaurants, Tapas-Bars, Pubs, Cafés und mehr — überall an der Costa Blanca.',
    featured_h: 'Empfohlene Orte', featured_link: 'Alle auf der Karte ansehen →',
    mapband_h: '🗺️ Alle Orte auf einer Karte', mapband_p: 'Entdecke alle {n} Bars und Restaurants auf dem Plan. Filtere nach Art und Gebiet und klicke auf einen Pin für Fotos und den vollständigen Eintrag.', mapband_cta: 'Interaktive Karte öffnen',
    why_h: 'Warum Cometia', faq_h: 'Häufige Fragen',
    z_places: 'Orte', z_seeall: 'Alle {n} {p} ansehen →', z_back: '← Zurück zum Führer',
    t_best: 'Die besten {p} an der Costa Blanca', t_intro: 'Vollständiger Führer für {p} in Gran Alacant, Santa Pola, Alicante und Elche. {n} Orte mit Adresse, Karte, Öffnungszeiten und ehrlicher Beschreibung.', t_inarea: '{n} {p} in {z}', t_seeall: 'Alle {n} {p} in {z} ansehen →', t_count: '{n} {p}',
    zt_best: 'Die besten {p} in {z}', zt_intro: '{n} {p} in {z} (Costa Blanca), mit Adresse, Karte, Öffnungszeiten und ehrlicher Beschreibung. Zum vollständigen lokalen Führer.', zt_backzone: 'Alle Bars & Restaurants in {z}', zt_backtype: '{p} an der ganzen Costa Blanca',
    m_crumb: 'Karte', m_h1a: 'Die Karte der', m_sub: 'Alle Bars, Restaurants, Pubs und Cafés auf einer Karte. Klicke auf einen Pin für Fotos und den vollständigen Eintrag.', m_all: 'Alle', m_allz: 'Alle Gebiete', m_ver: 'Eintrag ansehen', m_note: 'Kartendaten © OpenStreetMap-Mitwirkende · frei & offen · kein Tracking', m_terr: 'Terrassen',
    f_howto: 'Anfahrt', f_details: 'Infos', f_gmaps: 'Auf Google Maps & Bewertungen ansehen', f_more: '← Mehr in {z}', f_website: 'Website', f_related: 'Weitere Orte in {z}', f_seealltype: 'Alle {p} in {z} ansehen →',
    zona_h1: 'Bars & Restaurants in {z}',
  },
  fr: {
    slogan: 'MANGER & BOIRE · COSTA BLANCA', tagline: 'Guide des bars et restaurants de la Costa Blanca',
    nav_map: 'Carte', nav_about: 'À propos', nav_contact: 'Contact', nav_home: 'Accueil', nav_privacy: 'Confidentialité',
    langAria: 'Changer de langue',
    foot_attr: 'Données des établissements par les contributeurs OpenStreetMap (ODbL). Photos de façade © leurs auteurs via Mapillary (CC BY-SA). Les descriptions sont originales. Les avis, lorsqu’ils apparaissent, renvoient à Google.',
    card_view: 'Voir la fiche →', card_terrace: 'Terrasse', card_british: 'British',
    hero_eyebrow: 'Votre guide de la Costa Blanca', hero_h1a: 'Où manger et boire sur', hero_grad: 'la Costa Blanca',
    hero_sub: 'Bars, restaurants, pubs et cafés à Gran Alacant, Santa Pola, Alicante et Elche. Avec carte, horaires et une fiche pour chaque lieu.',
    hero_search: 'Cherchez un bar ou un restaurant…', cta_map: '🗺️ Voir la carte', cta_zones: 'Explorer par zone',
    st_places: 'lieux', st_areas: 'zones', st_photos: 'avec photo', st_bilingual: 'langues', bilingual_val: '7 langues',
    zones_h: 'Explorer par zone', zones_lead: 'Choisissez votre ville et découvrez tous les lieux où manger, prendre des tapas ou boire un verre.',
    types_h: 'Explorer par type', types_lead: 'Restaurants, bars à tapas, pubs, cafés et plus — partout sur la Costa Blanca.',
    featured_h: 'Lieux en vedette', featured_link: 'Tout voir sur la carte →',
    mapband_h: '🗺️ Tous les lieux sur une carte', mapband_p: 'Explorez les {n} bars et restaurants sur le plan. Filtrez par type et zone et cliquez sur un repère pour voir les photos et la fiche complète.', mapband_cta: 'Ouvrir la carte interactive',
    why_h: 'Pourquoi Cometia', faq_h: 'Questions fréquentes',
    z_places: 'lieux', z_seeall: 'Voir les {n} {p} →', z_back: '← Retour au guide',
    t_best: 'Les meilleurs {p} de la Costa Blanca', t_intro: 'Guide complet des {p} à Gran Alacant, Santa Pola, Alicante et Elche. {n} lieux avec adresse, carte, horaires et une description honnête.', t_inarea: '{n} {p} à {z}', t_seeall: 'Voir les {n} {p} de {z} →', t_count: '{n} {p}',
    zt_best: 'Les meilleurs {p} de {z}', zt_intro: '{n} {p} à {z} (Costa Blanca), avec adresse, carte, horaires et une description honnête. Consultez le guide local complet.', zt_backzone: 'Tous les bars et restaurants de {z}', zt_backtype: '{p} de toute la Costa Blanca',
    m_crumb: 'Carte', m_h1a: 'La carte de', m_sub: 'Tous les bars, restaurants, pubs et cafés sur une seule carte. Cliquez sur un repère pour voir les photos et la fiche complète.', m_all: 'Tous', m_allz: 'Toutes les zones', m_ver: 'Voir la fiche', m_note: 'Fond de carte © contributeurs OpenStreetMap · libre et gratuit · sans traçage', m_terr: 'terrasses',
    f_howto: 'Comment s’y rendre', f_details: 'Informations', f_gmaps: 'Voir sur Google Maps et avis', f_more: '← Plus à {z}', f_website: 'Site web', f_related: 'Autres lieux à {z}', f_seealltype: 'Voir tous les {p} de {z} →',
    zona_h1: 'Bars et restaurants à {z}',
  },
  nl: {
    slogan: 'ETEN & DRINKEN · COSTA BLANCA', tagline: 'Costa Blanca-gids voor bars en restaurants',
    nav_map: 'Kaart', nav_about: 'Over ons', nav_contact: 'Contact', nav_home: 'Home', nav_privacy: 'Privacy',
    langAria: 'Taal wijzigen',
    foot_attr: 'Bedrijfsgegevens van OpenStreetMap-bijdragers (ODbL). Gevelfoto’s © hun auteurs via Mapillary (CC BY-SA). De beschrijvingen zijn origineel. Beoordelingen, waar getoond, verwijzen naar Google.',
    card_view: 'Bekijk pagina →', card_terrace: 'Terras', card_british: 'British',
    hero_eyebrow: 'Jouw Costa Blanca-gids', hero_h1a: 'Waar eten & drinken aan', hero_grad: 'de Costa Blanca',
    hero_sub: 'Bars, restaurants, pubs en cafés in Gran Alacant, Santa Pola, Alicante en Elche. Met kaart, openingstijden en een pagina voor elke plek.',
    hero_search: 'Zoek een bar of restaurant…', cta_map: '🗺️ Bekijk de kaart', cta_zones: 'Blader per gebied',
    st_places: 'plekken', st_areas: 'gebieden', st_photos: 'met foto', st_bilingual: 'talen', bilingual_val: '7 talen',
    zones_h: 'Blader per gebied', zones_lead: 'Kies je stad en ontdek alle plekken om te eten, tapas te nemen of iets te drinken.',
    types_h: 'Blader per type', types_lead: 'Restaurants, tapasbars, pubs, cafés en meer — overal aan de Costa Blanca.',
    featured_h: 'Uitgelichte plekken', featured_link: 'Bekijk alles op de kaart →',
    mapband_h: '🗺️ Alle plekken op één kaart', mapband_p: 'Verken alle {n} bars en restaurants op de kaart. Filter op type en gebied en klik op een pin voor foto’s en de volledige pagina.', mapband_cta: 'Open de interactieve kaart',
    why_h: 'Waarom Cometia', faq_h: 'Veelgestelde vragen',
    z_places: 'plekken', z_seeall: 'Bekijk alle {n} {p} →', z_back: '← Terug naar de gids',
    t_best: 'De beste {p} aan de Costa Blanca', t_intro: 'Volledige gids voor {p} in Gran Alacant, Santa Pola, Alicante en Elche. {n} plekken met adres, kaart, openingstijden en een eerlijke beschrijving.', t_inarea: '{n} {p} in {z}', t_seeall: 'Bekijk alle {n} {p} in {z} →', t_count: '{n} {p}',
    zt_best: 'De beste {p} in {z}', zt_intro: '{n} {p} in {z} (Costa Blanca), met adres, kaart, openingstijden en een eerlijke beschrijving. Bekijk de volledige lokale gids.', zt_backzone: 'Alle bars & restaurants in {z}', zt_backtype: '{p} aan de hele Costa Blanca',
    m_crumb: 'Kaart', m_h1a: 'De kaart van', m_sub: 'Alle bars, restaurants, pubs en cafés op één kaart. Klik op een pin voor foto’s en de volledige pagina.', m_all: 'Alles', m_allz: 'Alle gebieden', m_ver: 'Bekijk pagina', m_note: 'Kaartlagen © OpenStreetMap-bijdragers · vrij & open · geen tracking', m_terr: 'terrassen',
    f_howto: 'Route', f_details: 'Informatie', f_gmaps: 'Bekijk op Google Maps & reviews', f_more: '← Meer in {z}', f_website: 'Website', f_related: 'Meer plekken in {z}', f_seealltype: 'Bekijk alle {p} in {z} →',
    zona_h1: 'Bars & restaurants in {z}',
  },
  no: {
    slogan: 'SPISE & DRIKKE · COSTA BLANCA', tagline: 'Costa Blanca-guide for barer og restauranter',
    nav_map: 'Kart', nav_about: 'Om oss', nav_contact: 'Kontakt', nav_home: 'Hjem', nav_privacy: 'Personvern',
    langAria: 'Bytt språk',
    foot_attr: 'Bedriftsdata fra OpenStreetMap-bidragsytere (ODbL). Fasadebilder © opphavspersonene via Mapillary (CC BY-SA). Beskrivelsene er egne. Vurderinger, der de vises, lenker til Google.',
    card_view: 'Se side →', card_terrace: 'Terrasse', card_british: 'British',
    hero_eyebrow: 'Din guide til Costa Blanca', hero_h1a: 'Hvor du spiser og drikker på', hero_grad: 'Costa Blanca',
    hero_sub: 'Barer, restauranter, puber og kafeer i Gran Alacant, Santa Pola, Alicante og Elche. Med kart, åpningstider og en side for hvert sted.',
    hero_search: 'Søk etter en bar eller restaurant…', cta_map: '🗺️ Se kartet', cta_zones: 'Utforsk etter område',
    st_places: 'steder', st_areas: 'områder', st_photos: 'med bilde', st_bilingual: 'språk', bilingual_val: '7 språk',
    zones_h: 'Utforsk etter område', zones_lead: 'Velg byen din og oppdag alle stedene å spise, ta tapas eller ta en drink.',
    types_h: 'Utforsk etter type', types_lead: 'Restauranter, tapasbarer, puber, kafeer og mer — over hele Costa Blanca.',
    featured_h: 'Utvalgte steder', featured_link: 'Se alle på kartet →',
    mapband_h: '🗺️ Alle steder på ett kart', mapband_p: 'Utforsk alle {n} barer og restauranter på kartet. Filtrer etter type og område og klikk på en markør for bilder og hele siden.', mapband_cta: 'Åpne det interaktive kartet',
    why_h: 'Hvorfor Cometia', faq_h: 'Ofte stilte spørsmål',
    z_places: 'steder', z_seeall: 'Se alle {n} {p} →', z_back: '← Tilbake til guiden',
    t_best: 'De beste {p} på Costa Blanca', t_intro: 'Komplett guide til {p} i Gran Alacant, Santa Pola, Alicante og Elche. {n} steder med adresse, kart, åpningstider og en ærlig beskrivelse.', t_inarea: '{n} {p} i {z}', t_seeall: 'Se alle {n} {p} i {z} →', t_count: '{n} {p}',
    zt_best: 'De beste {p} i {z}', zt_intro: '{n} {p} i {z} (Costa Blanca), med adresse, kart, åpningstider og en ærlig beskrivelse. Se hele den lokale guiden.', zt_backzone: 'Alle barer og restauranter i {z}', zt_backtype: '{p} på hele Costa Blanca',
    m_crumb: 'Kart', m_h1a: 'Kartet over', m_sub: 'Alle barer, restauranter, puber og kafeer på ett kart. Klikk på en markør for bilder og hele siden.', m_all: 'Alle', m_allz: 'Alle områder', m_ver: 'Se side', m_note: 'Kartdata © OpenStreetMap-bidragsytere · fritt og åpent · ingen sporing', m_terr: 'terrasser',
    f_howto: 'Slik kommer du dit', f_details: 'Informasjon', f_gmaps: 'Se på Google Maps og anmeldelser', f_more: '← Mer i {z}', f_website: 'Nettsted', f_related: 'Flere steder i {z}', f_seealltype: 'Se alle {p} i {z} →',
    zona_h1: 'Barer og restauranter i {z}',
  },
  sv: {
    slogan: 'ÄTA & DRICKA · COSTA BLANCA', tagline: 'Costa Blanca-guide för barer och restauranger',
    nav_map: 'Karta', nav_about: 'Om oss', nav_contact: 'Kontakt', nav_home: 'Hem', nav_privacy: 'Integritet',
    langAria: 'Byt språk',
    foot_attr: 'Företagsdata från OpenStreetMap-bidragsgivare (ODbL). Fasadbilder © deras upphovspersoner via Mapillary (CC BY-SA). Beskrivningarna är egna. Betyg, där de visas, länkar till Google.',
    card_view: 'Se sida →', card_terrace: 'Uteservering', card_british: 'British',
    hero_eyebrow: 'Din guide till Costa Blanca', hero_h1a: 'Var man äter och dricker på', hero_grad: 'Costa Blanca',
    hero_sub: 'Barer, restauranger, pubar och kaféer i Gran Alacant, Santa Pola, Alicante och Elche. Med karta, öppettider och en sida för varje ställe.',
    hero_search: 'Sök efter en bar eller restaurang…', cta_map: '🗺️ Se kartan', cta_zones: 'Utforska efter område',
    st_places: 'ställen', st_areas: 'områden', st_photos: 'med foto', st_bilingual: 'språk', bilingual_val: '7 språk',
    zones_h: 'Utforska efter område', zones_lead: 'Välj din stad och upptäck alla ställen att äta, ta tapas eller ta en drink.',
    types_h: 'Utforska efter typ', types_lead: 'Restauranger, tapasbarer, pubar, kaféer och mer — över hela Costa Blanca.',
    featured_h: 'Utvalda ställen', featured_link: 'Se alla på kartan →',
    mapband_h: '🗺️ Alla ställen på en karta', mapband_p: 'Utforska alla {n} barer och restauranger på kartan. Filtrera efter typ och område och klicka på en nål för foton och hela sidan.', mapband_cta: 'Öppna den interaktiva kartan',
    why_h: 'Varför Cometia', faq_h: 'Vanliga frågor',
    z_places: 'ställen', z_seeall: 'Se alla {n} {p} →', z_back: '← Tillbaka till guiden',
    t_best: 'De bästa {p} på Costa Blanca', t_intro: 'Komplett guide till {p} i Gran Alacant, Santa Pola, Alicante och Elche. {n} ställen med adress, karta, öppettider och en ärlig beskrivning.', t_inarea: '{n} {p} i {z}', t_seeall: 'Se alla {n} {p} i {z} →', t_count: '{n} {p}',
    zt_best: 'De bästa {p} i {z}', zt_intro: '{n} {p} i {z} (Costa Blanca), med adress, karta, öppettider och en ärlig beskrivning. Se hela den lokala guiden.', zt_backzone: 'Alla barer och restauranger i {z}', zt_backtype: '{p} på hela Costa Blanca',
    m_crumb: 'Karta', m_h1a: 'Kartan över', m_sub: 'Alla barer, restauranger, pubar och kaféer på en karta. Klicka på en nål för foton och hela sidan.', m_all: 'Alla', m_allz: 'Alla områden', m_ver: 'Se sida', m_note: 'Kartdata © OpenStreetMap-bidragsgivare · fritt och öppet · ingen spårning', m_terr: 'uteserveringar',
    f_howto: 'Hitta hit', f_details: 'Information', f_gmaps: 'Se på Google Maps och recensioner', f_more: '← Mer i {z}', f_website: 'Webbplats', f_related: 'Fler ställen i {z}', f_seealltype: 'Se alla {p} i {z} →',
    zona_h1: 'Barer och restauranger i {z}',
  },
};

export function t(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  const s = UI[lang]?.[key] ?? UI.en[key] ?? UI.es[key] ?? key;
  return vars ? fmt(s, vars) : s;
}

// ── Introducciones de zona (7 idiomas) ─────────────────────────────────────
export const ZONE_INTRO: Record<string, Partial<Record<Lang, string>>> = {
  'Gran Alacant': {
    es: 'Gran Alacant concentra una gran variedad de bares y restaurantes por sus urbanizaciones y el Centro Comercial: mucha oferta internacional y locales de ambiente británico junto a cocina española de siempre. Aquí tienes todos los sitios, ordenados por tipo.',
    en: 'Gran Alacant has a wide range of bars and restaurants across its urbanisations and the Centro Comercial: plenty of international options and British-style venues alongside traditional Spanish cooking. Here are all the places, sorted by type.',
    de: 'Gran Alacant bietet eine große Auswahl an Bars und Restaurants in seinen Urbanisationen und im Centro Comercial: viele internationale Optionen und Lokale im britischen Stil neben traditioneller spanischer Küche. Hier findest du alle Orte nach Art sortiert.',
    fr: 'Gran Alacant réunit une grande variété de bars et restaurants dans ses urbanisations et son centre commercial : beaucoup d’options internationales et de lieux à l’ambiance britannique, aux côtés de la cuisine espagnole traditionnelle. Voici tous les lieux, classés par type.',
    nl: 'Gran Alacant heeft een breed aanbod aan bars en restaurants in de urbanisaties en het Centro Comercial: veel internationale opties en Britse zaken naast traditionele Spaanse keuken. Hier vind je alle plekken, gesorteerd op type.',
    no: 'Gran Alacant har et bredt utvalg av barer og restauranter i boligområdene og på Centro Comercial: mange internasjonale valg og britisk-pregede steder ved siden av tradisjonell spansk mat. Her er alle stedene, sortert etter type.',
    sv: 'Gran Alacant har ett brett utbud av barer och restauranger i sina bostadsområden och på Centro Comercial: många internationella alternativ och brittiskt präglade ställen vid sidan av traditionell spansk mat. Här är alla ställen, sorterade efter typ.',
  },
  'Santa Pola': {
    es: 'Santa Pola, con uno de los mayores puertos pesqueros del Mediterráneo, es un sitio estupendo para pescado y marisco, además de bares de tapas y cafeterías por todo el pueblo y la costa. Aquí tienes todos los locales, por tipo.',
    en: 'Santa Pola, home to one of the largest fishing ports in the Mediterranean, is a great spot for fish and seafood, plus tapas bars and cafés all over the town and seafront. Here are all the venues, by type.',
    de: 'Santa Pola, mit einem der größten Fischereihäfen des Mittelmeers, ist ideal für Fisch und Meeresfrüchte, dazu Tapas-Bars und Cafés im ganzen Ort und an der Küste. Hier findest du alle Lokale nach Art.',
    fr: 'Santa Pola, dotée de l’un des plus grands ports de pêche de la Méditerranée, est idéale pour le poisson et les fruits de mer, avec aussi des bars à tapas et des cafés dans tout le village et sur le front de mer. Voici tous les lieux, par type.',
    nl: 'Santa Pola, met een van de grootste vissershavens van de Middellandse Zee, is ideaal voor vis en zeevruchten, plus tapasbars en cafés door het hele dorp en langs de kust. Hier vind je alle zaken, per type.',
    no: 'Santa Pola, med en av Middelhavets største fiskehavner, er et flott sted for fisk og skalldyr, i tillegg til tapasbarer og kafeer i hele byen og langs kysten. Her er alle stedene, etter type.',
    sv: 'Santa Pola, med en av Medelhavets största fiskehamnar, är perfekt för fisk och skaldjur, plus tapasbarer och kaféer i hela orten och längs kusten. Här är alla ställen, efter typ.',
  },
  'Alicante': {
    es: 'Alicante reúne una enorme oferta gastronómica: desde los arroces y el marisco del Mediterráneo hasta las tabernas del casco antiguo, las terrazas de la Explanada y el Puerto, y cocina de medio mundo. Aquí tienes todos los sitios, ordenados por tipo.',
    en: 'Alicante offers a huge range of places to eat and drink: from Mediterranean rice dishes and seafood to the taverns of the old town, the terraces along the Explanada and the harbour, and cuisine from all over the world. Here are all the places, sorted by type.',
    de: 'Alicante bietet eine riesige gastronomische Vielfalt: von Reisgerichten und Meeresfrüchten des Mittelmeers bis zu den Tavernen der Altstadt, den Terrassen an der Explanada und am Hafen und Küche aus aller Welt. Hier findest du alle Orte nach Art sortiert.',
    fr: 'Alicante offre une immense variété gastronomique : des riz et fruits de mer méditerranéens aux tavernes de la vieille ville, aux terrasses de l’Explanada et du port, et une cuisine du monde entier. Voici tous les lieux, classés par type.',
    nl: 'Alicante biedt een enorm aanbod om te eten en drinken: van mediterrane rijstgerechten en zeevruchten tot de taverns van de oude stad, de terrassen langs de Explanada en de haven, en keuken uit de hele wereld. Hier vind je alle plekken, gesorteerd op type.',
    no: 'Alicante byr på et enormt mattilbud: fra Middelhavets risretter og skalldyr til vertshusene i gamlebyen, terrassene langs Explanada og havnen, og mat fra hele verden. Her er alle stedene, sortert etter type.',
    sv: 'Alicante erbjuder ett enormt utbud av mat och dryck: från Medelhavets risrätter och skaldjur till gamla stans krogar, uteserveringarna längs Explanada och hamnen, och kök från hela världen. Här är alla ställen, sorterade efter typ.',
  },
  'Elche': {
    es: 'Elche, ciudad del palmeral Patrimonio de la Humanidad, tiene una escena gastronómica muy viva: arroces y cocina alicantina tradicional, tapas por el centro y bares y cafeterías por todos sus barrios. Aquí tienes todos los locales, por tipo.',
    en: 'Elche, the city of the UNESCO World Heritage palm grove, has a lively food scene: rice dishes and traditional Alicante cooking, tapas around the centre and bars and cafés across every neighbourhood. Here are all the venues, by type.',
    de: 'Elche, die Stadt des zum Weltkulturerbe zählenden Palmenhains, hat eine lebendige Gastronomie: Reisgerichte und traditionelle Küche aus Alicante, Tapas im Zentrum und Bars und Cafés in allen Vierteln. Hier findest du alle Lokale nach Art.',
    fr: 'Elche, la ville de la palmeraie classée au patrimoine mondial, a une scène gastronomique très vivante : riz et cuisine traditionnelle d’Alicante, tapas dans le centre et bars et cafés dans tous les quartiers. Voici tous les lieux, par type.',
    nl: 'Elche, de stad van het tot werelderfgoed behorende palmbos, heeft een levendige eetcultuur: rijstgerechten en traditionele keuken uit Alicante, tapas in het centrum en bars en cafés in alle wijken. Hier vind je alle zaken, per type.',
    no: 'Elche, byen med palmelunden på UNESCOs verdensarvliste, har en livlig matscene: risretter og tradisjonell mat fra Alicante, tapas i sentrum og barer og kafeer i alle bydeler. Her er alle stedene, etter type.',
    sv: 'Elche, staden med palmlunden på Unescos världsarvslista, har en livlig matscen: risrätter och traditionell mat från Alicante, tapas i centrum och barer och kaféer i alla stadsdelar. Här är alla ställen, efter typ.',
  },
};
export function zoneIntro(zona: string, lang: Lang): string {
  return ZONE_INTRO[zona]?.[lang] ?? ZONE_INTRO[zona]?.en ?? '';
}

// ── FAQ (7 idiomas) ────────────────────────────────────────────────────────
export const FAQS: Record<Lang, { q: string; a: string }[]> = {
  es: [
    { q: '¿Qué es Cometia?', a: 'Cometia es una guía local e independiente de bares, restaurantes, pubs y cafeterías de la Costa Blanca: Gran Alacant, Santa Pola, Alicante y Elche. Reunimos {total} sitios con dirección, mapa, horarios y una descripción clara, en 7 idiomas.' },
    { q: '¿Es gratis?', a: 'Sí. Consultar la guía es totalmente gratis y sin registro. No vendemos posiciones ni publicamos reseñas falsas.' },
    { q: '¿De dónde salen los datos?', a: 'Los datos de los establecimientos proceden de OpenStreetMap (licencia ODbL) y los completamos con geocodificación. Las descripciones son propias. Las valoraciones, cuando aparecen, enlazan a Google.' },
    { q: '¿En qué idiomas está?', a: 'En español, inglés, alemán, francés, neerlandés, noruego y sueco. La web detecta tu idioma automáticamente y puedes cambiarlo cuando quieras.' },
  ],
  en: [
    { q: 'What is Cometia?', a: 'Cometia is an independent local guide to bars, restaurants, pubs and cafés on the Costa Blanca: Gran Alacant, Santa Pola, Alicante and Elche. We bring together {total} places with address, map, opening hours and a clear description, in 7 languages.' },
    { q: 'Is it free?', a: 'Yes. Browsing the guide is completely free and needs no sign-up. We don’t sell rankings or publish fake reviews.' },
    { q: 'Where does the data come from?', a: 'Business data comes from OpenStreetMap (ODbL licence) and is enriched with geocoding. The descriptions are our own. Ratings, where shown, link out to Google.' },
    { q: 'Which languages is it in?', a: 'Spanish, English, German, French, Dutch, Norwegian and Swedish. The site detects your language automatically and you can change it whenever you like.' },
  ],
  de: [
    { q: 'Was ist Cometia?', a: 'Cometia ist ein unabhängiger lokaler Führer für Bars, Restaurants, Pubs und Cafés an der Costa Blanca: Gran Alacant, Santa Pola, Alicante und Elche. Wir vereinen {total} Orte mit Adresse, Karte, Öffnungszeiten und einer klaren Beschreibung, in 7 Sprachen.' },
    { q: 'Ist es kostenlos?', a: 'Ja. Die Nutzung des Führers ist völlig kostenlos und ohne Anmeldung. Wir verkaufen keine Platzierungen und veröffentlichen keine gefälschten Bewertungen.' },
    { q: 'Woher stammen die Daten?', a: 'Die Betriebsdaten stammen von OpenStreetMap (ODbL-Lizenz) und werden mit Geokodierung ergänzt. Die Beschreibungen sind eigene. Bewertungen, wo angezeigt, verlinken zu Google.' },
    { q: 'In welchen Sprachen gibt es die Seite?', a: 'Auf Spanisch, Englisch, Deutsch, Französisch, Niederländisch, Norwegisch und Schwedisch. Die Seite erkennt deine Sprache automatisch und du kannst sie jederzeit ändern.' },
  ],
  fr: [
    { q: 'Qu’est-ce que Cometia ?', a: 'Cometia est un guide local indépendant des bars, restaurants, pubs et cafés de la Costa Blanca : Gran Alacant, Santa Pola, Alicante et Elche. Nous réunissons {total} lieux avec adresse, carte, horaires et une description claire, en 7 langues.' },
    { q: 'Est-ce gratuit ?', a: 'Oui. Consulter le guide est entièrement gratuit et sans inscription. Nous ne vendons pas de classements et ne publions pas de faux avis.' },
    { q: 'D’où viennent les données ?', a: 'Les données des établissements proviennent d’OpenStreetMap (licence ODbL) et sont complétées par géocodage. Les descriptions sont les nôtres. Les avis, lorsqu’ils apparaissent, renvoient à Google.' },
    { q: 'En quelles langues est-il disponible ?', a: 'En espagnol, anglais, allemand, français, néerlandais, norvégien et suédois. Le site détecte votre langue automatiquement et vous pouvez en changer quand vous voulez.' },
  ],
  nl: [
    { q: 'Wat is Cometia?', a: 'Cometia is een onafhankelijke lokale gids voor bars, restaurants, pubs en cafés aan de Costa Blanca: Gran Alacant, Santa Pola, Alicante en Elche. We brengen {total} plekken samen met adres, kaart, openingstijden en een duidelijke beschrijving, in 7 talen.' },
    { q: 'Is het gratis?', a: 'Ja. De gids gebruiken is volledig gratis en zonder registratie. We verkopen geen posities en publiceren geen nepreviews.' },
    { q: 'Waar komen de gegevens vandaan?', a: 'De bedrijfsgegevens komen van OpenStreetMap (ODbL-licentie) en worden aangevuld met geocodering. De beschrijvingen zijn van onszelf. Beoordelingen, waar getoond, verwijzen naar Google.' },
    { q: 'In welke talen is het?', a: 'In het Spaans, Engels, Duits, Frans, Nederlands, Noors en Zweeds. De site herkent je taal automatisch en je kunt hem altijd wijzigen.' },
  ],
  no: [
    { q: 'Hva er Cometia?', a: 'Cometia er en uavhengig lokal guide til barer, restauranter, puber og kafeer på Costa Blanca: Gran Alacant, Santa Pola, Alicante og Elche. Vi samler {total} steder med adresse, kart, åpningstider og en tydelig beskrivelse, på 7 språk.' },
    { q: 'Er det gratis?', a: 'Ja. Å bruke guiden er helt gratis og uten registrering. Vi selger ikke plasseringer og publiserer ikke falske anmeldelser.' },
    { q: 'Hvor kommer dataene fra?', a: 'Bedriftsdataene kommer fra OpenStreetMap (ODbL-lisens) og suppleres med geokoding. Beskrivelsene er våre egne. Vurderinger, der de vises, lenker til Google.' },
    { q: 'Hvilke språk finnes den på?', a: 'På spansk, engelsk, tysk, fransk, nederlandsk, norsk og svensk. Nettstedet oppdager språket ditt automatisk, og du kan endre det når som helst.' },
  ],
  sv: [
    { q: 'Vad är Cometia?', a: 'Cometia är en oberoende lokal guide till barer, restauranger, pubar och kaféer på Costa Blanca: Gran Alacant, Santa Pola, Alicante och Elche. Vi samlar {total} ställen med adress, karta, öppettider och en tydlig beskrivning, på 7 språk.' },
    { q: 'Är det gratis?', a: 'Ja. Att använda guiden är helt gratis och utan registrering. Vi säljer inte placeringar och publicerar inga falska recensioner.' },
    { q: 'Varifrån kommer uppgifterna?', a: 'Företagsdatan kommer från OpenStreetMap (ODbL-licens) och kompletteras med geokodning. Beskrivningarna är våra egna. Betyg, där de visas, länkar till Google.' },
    { q: 'Vilka språk finns den på?', a: 'På spanska, engelska, tyska, franska, nederländska, norska och svenska. Webbplatsen känner av ditt språk automatiskt och du kan byta när du vill.' },
  ],
};

// ── "Por qué Cometia" (7 idiomas) ──────────────────────────────────────────
export const FEATURES: Record<Lang, { ic: string; t: string; p: string }[]> = {
  es: [
    { ic: '🍽️', t: 'Todo en un sitio', p: '{total} bares y restaurantes de la Costa Blanca con dirección, horario, mapa y contacto.' },
    { ic: '🌍', t: 'En tu idioma', p: 'Web y fichas en 7 idiomas, con detección automática, pensada también para la comunidad extranjera de la zona.' },
    { ic: '✅', t: 'Sin postureo', p: 'Datos reales de OpenStreetMap y descripciones propias. Ni reseñas falsas ni posiciones a la venta.' },
    { ic: '🗺️', t: 'Con mapa', p: 'Encuentra lo que tienes cerca con el mapa interactivo y los filtros por tipo y zona.' },
  ],
  en: [
    { ic: '🍽️', t: 'All in one place', p: '{total} bars and restaurants on the Costa Blanca with address, opening hours, map and contact.' },
    { ic: '🌍', t: 'In your language', p: 'Website and listings in 7 languages, with automatic detection, made for the area’s international community too.' },
    { ic: '✅', t: 'No nonsense', p: 'Real data from OpenStreetMap and our own descriptions. No fake reviews, no rankings for sale.' },
    { ic: '🗺️', t: 'On the map', p: 'Find what’s near you with the interactive map and filters by type and area.' },
  ],
  de: [
    { ic: '🍽️', t: 'Alles an einem Ort', p: '{total} Bars und Restaurants an der Costa Blanca mit Adresse, Öffnungszeiten, Karte und Kontakt.' },
    { ic: '🌍', t: 'In deiner Sprache', p: 'Website und Einträge in 7 Sprachen, mit automatischer Erkennung, auch für die internationale Gemeinschaft der Region.' },
    { ic: '✅', t: 'Ohne Schnickschnack', p: 'Echte Daten von OpenStreetMap und eigene Beschreibungen. Keine gefälschten Bewertungen, keine käuflichen Platzierungen.' },
    { ic: '🗺️', t: 'Mit Karte', p: 'Finde mit der interaktiven Karte und den Filtern nach Art und Gebiet, was in deiner Nähe ist.' },
  ],
  fr: [
    { ic: '🍽️', t: 'Tout au même endroit', p: '{total} bars et restaurants de la Costa Blanca avec adresse, horaires, carte et contact.' },
    { ic: '🌍', t: 'Dans votre langue', p: 'Site et fiches en 7 langues, avec détection automatique, pensés aussi pour la communauté internationale de la région.' },
    { ic: '✅', t: 'Sans esbroufe', p: 'Données réelles d’OpenStreetMap et descriptions originales. Pas de faux avis, pas de classements à vendre.' },
    { ic: '🗺️', t: 'Avec carte', p: 'Trouvez ce qui est près de vous grâce à la carte interactive et aux filtres par type et zone.' },
  ],
  nl: [
    { ic: '🍽️', t: 'Alles op één plek', p: '{total} bars en restaurants aan de Costa Blanca met adres, openingstijden, kaart en contact.' },
    { ic: '🌍', t: 'In jouw taal', p: 'Website en pagina’s in 7 talen, met automatische detectie, ook voor de internationale gemeenschap in de regio.' },
    { ic: '✅', t: 'Geen onzin', p: 'Echte data van OpenStreetMap en eigen beschrijvingen. Geen nepreviews, geen posities te koop.' },
    { ic: '🗺️', t: 'Met kaart', p: 'Vind wat in de buurt is met de interactieve kaart en filters op type en gebied.' },
  ],
  no: [
    { ic: '🍽️', t: 'Alt på ett sted', p: '{total} barer og restauranter på Costa Blanca med adresse, åpningstider, kart og kontakt.' },
    { ic: '🌍', t: 'På ditt språk', p: 'Nettsted og sider på 7 språk, med automatisk gjenkjenning, laget også for det internasjonale miljøet i området.' },
    { ic: '✅', t: 'Uten tull', p: 'Ekte data fra OpenStreetMap og egne beskrivelser. Ingen falske anmeldelser, ingen plasseringer for salg.' },
    { ic: '🗺️', t: 'Med kart', p: 'Finn det som er i nærheten med det interaktive kartet og filtre etter type og område.' },
  ],
  sv: [
    { ic: '🍽️', t: 'Allt på ett ställe', p: '{total} barer och restauranger på Costa Blanca med adress, öppettider, karta och kontakt.' },
    { ic: '🌍', t: 'På ditt språk', p: 'Webbplats och sidor på 7 språk, med automatisk igenkänning, gjord även för områdets internationella gemenskap.' },
    { ic: '✅', t: 'Utan krusiduller', p: 'Riktiga data från OpenStreetMap och egna beskrivningar. Inga falska recensioner, inga placeringar till salu.' },
    { ic: '🗺️', t: 'Med karta', p: 'Hitta det som finns nära dig med den interaktiva kartan och filter efter typ och område.' },
  ],
};
