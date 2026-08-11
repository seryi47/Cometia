// =============================================================
// Clúster de guías SEO de Cometia (velocidad / SEO / auditoría web para pymes).
// Array de datos + getStaticPaths en /guias/[slug].astro y hub en /guias.
// El cuerpo se escribe en HTML semántico (sin dependencias MDX).
// =============================================================

export interface Guia {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  keyword: string;
  emoji: string;
  excerpt: string;
  updated: string;
  readingMinutes: number;
  toc: { id: string; label: string }[];
  bodyHtml: string;
}

export const guias: Guia[] = [
  {
    "slug": "por-que-mi-web-va-lenta",
    "title": "Por qué tu web va lenta (y cómo saber qué la frena)",
    "metaTitle": "Por qué tu web va lenta y cómo saber qué la frena",
    "description": "¿Tu web va lenta y no sabes por qué? Descubre las causas más habituales, cómo medir qué la frena con las notas reales de Google y qué hacer para acelerarla.",
    "keyword": "por qué mi web va lenta",
    "emoji": "🐢",
    "excerpt": "Las razones por las que una web tarda en cargar y cómo identificar exactamente qué la frena antes de tocar nada.",
    "updated": "2026-08-06",
    "readingMinutes": 3,
    "toc": [
      {
        "id": "senales",
        "label": "Señales de que tu web va lenta"
      },
      {
        "id": "causas",
        "label": "Las causas más habituales"
      },
      {
        "id": "diagnostico",
        "label": "Cómo saber qué la frena"
      },
      {
        "id": "soluciones",
        "label": "Qué puedes hacer a partir de ahora"
      }
    ],
    "bodyHtml": "<p>Abres tu web desde el móvil, esperas... y esperas. Si te has preguntado <strong>por qué mi web va lenta</strong>, la buena noticia es que casi siempre hay una causa concreta y medible detrás. La mala es que, mientras no la identifiques, estás perdiendo visitas y clientes sin saberlo.</p>\n\n<h2 id=\"senales\">Señales de que tu web va lenta</h2>\n<p>Muchos negocios conviven con una web lenta sin darse cuenta, porque el dueño la carga siempre desde el mismo ordenador y con la página ya guardada en memoria. Estas son las señales de alarma:</p>\n<ul>\n<li>La pantalla se queda en blanco un par de segundos antes de mostrar nada.</li>\n<li>Las imágenes aparecen a trozos o «saltan» mientras se coloca el contenido.</li>\n<li>Pulsas un botón o un menú y tarda en responder.</li>\n<li>Desde el móvil con datos (no wifi) la sensación es aún peor.</li>\n</ul>\n<p>Si te suena, no es cosa tuya: es un problema real que Google también percibe. De hecho, <a href=\"/guias/cuanto-debe-tardar-en-cargar-una-web\">hay un tiempo razonable de carga</a> por debajo del cual deberías estar.</p>\n\n<h2 id=\"causas\">Las causas más habituales</h2>\n<p>Una web no va lenta por un único motivo, sino por la suma de varios. Los más frecuentes en pymes y autónomos son:</p>\n<ul>\n<li><strong>Imágenes sin optimizar:</strong> fotos de 4.000 píxeles y varios megas que el navegador tiene que descargar enteras.</li>\n<li><strong>Alojamiento barato o saturado:</strong> el servidor tarda en responder a la primera petición.</li>\n<li><strong>Exceso de plugins y scripts:</strong> plantillas cargadas de funciones que no usas, chats, mapas, vídeos incrustados...</li>\n<li><strong>Falta de caché:</strong> el servidor genera la página desde cero en cada visita en lugar de reutilizarla.</li>\n<li><strong>Código pesado:</strong> plantillas genéricas que cargan estilos y librerías de más.</li>\n</ul>\n\n<h2 id=\"diagnostico\">Cómo saber qué la frena</h2>\n<p>Aquí está la clave: no vayas a ciegas. Antes de tocar nada, mide. Google publica las notas reales de cualquier web (velocidad, SEO, accesibilidad y buenas prácticas) puntuadas de 0 a 100: 90 o más es verde, entre 50 y 89 naranja, y por debajo de 50 rojo.</p>\n<p>Esas notas se apoyan en las <a href=\"/guias/core-web-vitals-que-son\">Core Web Vitals</a>, las métricas con las que Google mide la experiencia de carga. Interpretarlas bien te dice exactamente qué componente está frenando la página, algo que explicamos en la guía sobre <a href=\"/guias/pagespeed-insights-como-interpretar-tu-nota\">cómo interpretar tu nota de PageSpeed</a>.</p>\n\n<div class=\"callout\"><p>Puedes <a href=\"/#analizar\">analizar tu web gratis</a> en Cometia y ver en segundos las notas reales que Google le da, sin instalar nada.</p></div>\n\n<h2 id=\"soluciones\">Qué puedes hacer a partir de ahora</h2>\n<p>Con el diagnóstico delante, las mejoras dejan de ser adivinar. Normalmente el orden de impacto es este:</p>\n<ul>\n<li>Comprimir y redimensionar las imágenes al tamaño real en que se muestran.</li>\n<li>Activar caché y compresión en el servidor.</li>\n<li>Eliminar plugins y scripts que no aportan.</li>\n<li>Revisar el alojamiento si el servidor tarda en responder.</li>\n</ul>\n<p>Si usas WordPress, tienes una hoja de ruta concreta en <a href=\"/guias/mejorar-velocidad-web-wordpress\">cómo mejorar la velocidad de una web WordPress</a>. Y si prefieres que lo hagamos por ti, nuestro servicio de <a href=\"/optimizar-velocidad-web\">optimización de velocidad</a> parte del informe real de tu web para atacar solo lo que de verdad la frena. Porque una web lenta no es solo incómoda: <a href=\"/guias/web-lenta-cuanto-te-cuesta\">te cuesta dinero</a> en visitas que se van antes de llegar.</p>"
  },
  {
    "slug": "core-web-vitals-que-son",
    "title": "Qué son las Core Web Vitals y por qué importan para tu negocio",
    "metaTitle": "Qué son las Core Web Vitals (y por qué importan)",
    "description": "Qué son las Core Web Vitals explicado sin tecnicismos: LCP, INP y CLS, sus valores buenos y por qué influyen en tu posición en Google y en tus ventas online.",
    "keyword": "qué son las core web vitals",
    "emoji": "📊",
    "excerpt": "LCP, INP y CLS explicadas sin tecnicismos, con sus valores buenos y por qué influyen en el posicionamiento y en tus ventas.",
    "updated": "2026-08-06",
    "readingMinutes": 3,
    "toc": [
      {
        "id": "que-son",
        "label": "Qué son exactamente"
      },
      {
        "id": "las-tres-metricas",
        "label": "Las tres métricas: LCP, INP y CLS"
      },
      {
        "id": "por-que-importan",
        "label": "Por qué importan para tu negocio"
      },
      {
        "id": "como-saber",
        "label": "Cómo saber las de tu web y mejorarlas"
      }
    ],
    "bodyHtml": "<p>Cada vez que alguien habla de velocidad web y posicionamiento, aparecen tres siglas: LCP, INP y CLS. Entender <strong>qué son las Core Web Vitals</strong> no requiere ser programador, y te ayuda a saber si tu web ofrece una buena experiencia o está espantando visitas.</p>\n\n<h2 id=\"que-son\">Qué son exactamente</h2>\n<p>Las Core Web Vitals son un conjunto de métricas que Google usa para medir la <strong>experiencia real de quien visita tu web</strong>: cuánto tarda en ver el contenido, cómo de rápido responde cuando interactúa y si los elementos se mueven de forma molesta mientras carga. No son opiniones: se calculan con datos técnicos y, en muchos casos, con la experiencia de usuarios reales.</p>\n<p>Google las convirtió en un factor que influye en el posicionamiento. Es decir, forman parte de lo que decide si tu web aparece antes o después que la de tu competencia.</p>\n\n<h2 id=\"las-tres-metricas\">Las tres métricas: LCP, INP y CLS</h2>\n<ul>\n<li><strong>LCP (Largest Contentful Paint):</strong> mide cuánto tarda en aparecer el elemento principal de la página, normalmente la imagen o el titular grande. Se considera <strong>bueno por debajo de 2,5 segundos</strong>.</li>\n<li><strong>INP (Interaction to Next Paint):</strong> mide cuánto tarda la web en reaccionar cuando el usuario pulsa un botón, abre un menú o rellena un formulario. Se considera <strong>bueno por debajo de 200 milisegundos</strong>.</li>\n<li><strong>CLS (Cumulative Layout Shift):</strong> mide cuánto se mueve el contenido mientras carga, esos saltos molestos que te hacen pulsar donde no querías. Se considera <strong>bueno por debajo de 0,1</strong>.</li>\n</ul>\n<p>INP sustituyó en 2024 a la antigua métrica FID, así que si lees guías viejas que hablan de FID, ese dato ya está desactualizado.</p>\n\n<h2 id=\"por-que-importan\">Por qué importan para tu negocio</h2>\n<p>Más allá de la parte técnica, las Core Web Vitals afectan directamente a tus resultados:</p>\n<ul>\n<li><strong>Menos abandonos:</strong> si el contenido tarda o los botones no responden, la gente se va antes de convertir.</li>\n<li><strong>Mejor posición en Google:</strong> a igualdad de contenido, una web con buena experiencia tiene ventaja.</li>\n<li><strong>Más confianza:</strong> una web que carga fina y no da saltos transmite profesionalidad.</li>\n</ul>\n<p>Dicho de otro modo: una mala nota aquí suele estar detrás de que <a href=\"/guias/por-que-mi-web-va-lenta\">tu web vaya lenta</a> y de que <a href=\"/guias/web-lenta-cuanto-te-cuesta\">pierdas clientes por el camino</a>.</p>\n\n<div class=\"callout\"><p>¿Quieres ver los valores reales de tu web? Puedes <a href=\"/#analizar\">analizar tu web gratis</a> y comprobar tus Core Web Vitals en segundos.</p></div>\n\n<h2 id=\"como-saber\">Cómo saber las de tu web y mejorarlas</h2>\n<p>Estas métricas se recogen en el informe de PageSpeed de Google, que puntúa de 0 a 100 (90 o más es verde, de 50 a 89 naranja y por debajo de 50 rojo). Saber leer ese informe es el primer paso, y lo detallamos en <a href=\"/guias/pagespeed-insights-como-interpretar-tu-nota\">cómo interpretar tu nota de PageSpeed</a>.</p>\n<p>Si tus valores están en naranja o rojo, casi siempre se debe a imágenes pesadas, exceso de scripts o un alojamiento lento. En <a href=\"/guias/mejorar-velocidad-web-wordpress\">mejorar la velocidad de una web WordPress</a> tienes los pasos concretos, y si prefieres delegarlo, nuestro servicio de <a href=\"/optimizar-velocidad-web\">optimización de velocidad</a> trabaja directamente sobre estas tres métricas.</p>"
  },
  {
    "slug": "mejorar-velocidad-web-wordpress",
    "title": "Cómo mejorar la velocidad de una web WordPress",
    "metaTitle": "Cómo mejorar la velocidad de una web WordPress",
    "description": "Guía práctica para mejorar la velocidad de tu web WordPress paso a paso: alojamiento, imágenes, caché y plugins, sin tocar código y midiendo cada cambio.",
    "keyword": "mejorar velocidad web wordpress",
    "emoji": "⚡",
    "excerpt": "El orden correcto para acelerar tu WordPress sin tocar código: alojamiento, imágenes, caché y plugins, midiendo cada cambio.",
    "updated": "2026-08-06",
    "readingMinutes": 3,
    "toc": [
      {
        "id": "por-que-lento",
        "label": "Por qué WordPress puede ir lento"
      },
      {
        "id": "hosting",
        "label": "Empieza por el alojamiento"
      },
      {
        "id": "imagenes",
        "label": "Optimiza las imágenes"
      },
      {
        "id": "plugins-cache",
        "label": "Plugins, caché y lo demás"
      },
      {
        "id": "medir",
        "label": "Mide antes y después"
      }
    ],
    "bodyHtml": "<p>WordPress mueve una gran parte de las webs de pymes y autónomos en España, pero por defecto no viene optimizado. Si buscas <strong>mejorar la velocidad de tu web WordPress</strong>, esta guía te da el orden correcto para hacerlo sin tocar código y sin romper nada.</p>\n\n<h2 id=\"por-que-lento\">Por qué WordPress puede ir lento</h2>\n<p>WordPress genera cada página en el momento en que alguien la visita, combinando la plantilla, los plugins y la base de datos. Si a eso le sumas una plantilla cargada de funciones, imágenes pesadas y un alojamiento compartido barato, el resultado es una web que tarda. No es culpa de WordPress: es cuestión de cómo está montado.</p>\n<p>Antes de tocar nada, conviene entender <a href=\"/guias/por-que-mi-web-va-lenta\">por qué tu web va lenta</a> en tu caso concreto, porque no todas fallan por lo mismo.</p>\n\n<h2 id=\"hosting\">Empieza por el alojamiento</h2>\n<p>De poco sirve optimizar si el servidor tarda un segundo entero en responder. El alojamiento es el cimiento:</p>\n<ul>\n<li>Huye del hosting compartido más barato si tu web tiene tráfico o vende.</li>\n<li>Busca un servidor con una versión reciente de PHP y buen tiempo de respuesta.</li>\n<li>Si tu público está en España, elige servidores cercanos.</li>\n</ul>\n\n<h2 id=\"imagenes\">Optimiza las imágenes</h2>\n<p>Las imágenes suelen ser lo que más pesa en una web WordPress y, a la vez, lo más fácil de arreglar:</p>\n<ul>\n<li>Sube las fotos al tamaño real en que se ven, no a 4.000 píxeles.</li>\n<li>Usa formatos modernos como WebP, que pesan bastante menos.</li>\n<li>Activa la carga diferida (lazy load) para que las imágenes de abajo se carguen solo al bajar.</li>\n</ul>\n<p>Solo con esto muchas webs mejoran de forma notable su LCP, una de las <a href=\"/guias/core-web-vitals-que-son\">Core Web Vitals</a> que Google vigila.</p>\n\n<h2 id=\"plugins-cache\">Plugins, caché y lo demás</h2>\n<p>El siguiente bloque de mejoras es donde más se nota el trabajo:</p>\n<ul>\n<li><strong>Instala un plugin de caché:</strong> guarda la página ya generada para no reconstruirla en cada visita.</li>\n<li><strong>Minimiza los archivos:</strong> reduce el peso del CSS y el JavaScript quitando lo que sobra.</li>\n<li><strong>Revisa los plugins activos:</strong> desactiva y borra los que no uses; cada uno suma carga.</li>\n<li><strong>Limpia la base de datos:</strong> revisiones antiguas, spam y borradores acumulan peso.</li>\n<li><strong>Plantéate un CDN:</strong> una red de servidores distribuidos por el mundo que sirve tu web desde el punto más cercano a cada visitante.</li>\n</ul>\n\n<div class=\"callout\"><p>Cambia una cosa cada vez y vuelve a medir. Así sabrás qué mejora ha funcionado y podrás deshacerla si algo se rompe.</p></div>\n\n<h2 id=\"medir\">Mide antes y después</h2>\n<p>No optimices a ciegas. Toma una foto del estado inicial de tu web y compárala tras cada cambio. La herramienta de Google puntúa de 0 a 100 (90 o más verde, de 50 a 89 naranja y por debajo de 50 rojo), y así ves el progreso de forma objetiva. Tienes la guía completa en <a href=\"/guias/pagespeed-insights-como-interpretar-tu-nota\">cómo interpretar tu nota de PageSpeed</a>.</p>\n<p>Puedes <a href=\"/#analizar\">analizar tu web gratis</a> en Cometia para partir de un diagnóstico real. Y si prefieres no pelearte con plugins ni servidores, nuestro servicio de <a href=\"/optimizar-velocidad-web\">optimización de velocidad</a> se encarga de todo el proceso a partir de las notas reales de tu web. Si además vendes online, te interesa <a href=\"/guias/optimizar-velocidad-tienda-online\">optimizar la velocidad de tu tienda</a>.</p>"
  },
  {
    "slug": "cuanto-debe-tardar-en-cargar-una-web",
    "title": "Cuánto debe tardar en cargar una web (y por qué la velocidad vende)",
    "metaTitle": "¿Cuánto debe tardar en cargar una web? Guía 2026",
    "description": "¿Cuánto debe tardar en cargar una web? Lo ideal es por debajo de 2,5 segundos. Te explicamos las cifras que importan y por qué la velocidad vende más.",
    "keyword": "cuánto debe tardar en cargar una web",
    "emoji": "⚡",
    "excerpt": "Una web debería mostrar su contenido principal en menos de 2,5 segundos. Te contamos qué cifras miden Google y tus clientes, y por qué cada segundo de más te cuesta ventas.",
    "updated": "2026-08-06",
    "readingMinutes": 5,
    "toc": [
      {
        "id": "cifra-ideal",
        "label": "La cifra que deberías buscar"
      },
      {
        "id": "que-mide-google",
        "label": "Qué mide Google realmente"
      },
      {
        "id": "por-que-vende",
        "label": "Por qué la velocidad vende"
      },
      {
        "id": "que-frena",
        "label": "Qué suele frenar tu web"
      },
      {
        "id": "como-saber",
        "label": "Cómo saber a qué velocidad va la tuya"
      }
    ],
    "bodyHtml": "<p>Es una de las preguntas más repetidas por cualquier dueño de negocio con web propia: <strong>¿cuánto debe tardar en cargar una web para no perder clientes?</strong> La respuesta corta es que el contenido principal debería aparecer en pantalla en <strong>menos de 2,5 segundos</strong>. La respuesta larga es más interesante, porque no todos los segundos cuentan igual.</p>\n\n<h2 id=\"cifra-ideal\">La cifra que deberías buscar</h2>\n<p>Google mide la velocidad con varias métricas, pero la más importante para el usuario es el <strong>LCP (Largest Contentful Paint)</strong>: el tiempo que tarda en verse el elemento grande y principal de la página (normalmente una imagen o el bloque de texto de cabecera).</p>\n<ul>\n<li><strong>Bueno:</strong> LCP por debajo de <strong>2,5 segundos</strong>.</li>\n<li><strong>Mejorable:</strong> entre 2,5 y 4 segundos.</li>\n<li><strong>Malo:</strong> por encima de 4 segundos.</li>\n</ul>\n<p>Si tu web tarda más de 4 segundos en mostrar lo importante, estás en zona roja. Y en móvil, donde hoy navega la mayoría de tus visitas, el problema se nota todavía más.</p>\n\n<h2 id=\"que-mide-google\">Qué mide Google realmente</h2>\n<p>Además del LCP, Google se fija en otros dos indicadores que forman los llamados <strong>Core Web Vitals</strong>:</p>\n<ul>\n<li><strong>INP (Interaction to Next Paint):</strong> lo rápido que responde la web cuando alguien pulsa un botón o un enlace. Bueno por debajo de <strong>200 ms</strong>.</li>\n<li><strong>CLS (Cumulative Layout Shift):</strong> cuánto se mueven los elementos mientras carga la página (esos saltos molestos que te hacen pulsar donde no querías). Bueno por debajo de <strong>0,1</strong>.</li>\n</ul>\n<p>Herramientas como PageSpeed Insights resumen todo esto en una <strong>nota de 0 a 100</strong>: 90 o más aparece en verde, entre 50 y 89 en naranja, y por debajo de 50 en rojo. Si quieres entender bien esas métricas, tienes una guía dedicada en <a href=\"/guias/core-web-vitals-que-son\">qué son los Core Web Vitals</a>.</p>\n\n<h2 id=\"por-que-vende\">Por qué la velocidad vende</h2>\n<p>La velocidad no es un capricho técnico: afecta directamente a tu facturación. Un visitante que espera y no ve nada, se va. Y un cliente que se va rara vez vuelve.</p>\n<ul>\n<li><strong>Menos abandonos:</strong> cuanto antes se ve tu web, más gente se queda a leer, comprar o contactar.</li>\n<li><strong>Mejor posición en Google:</strong> la velocidad es un factor de posicionamiento, sobre todo en móvil.</li>\n<li><strong>Más confianza:</strong> una web rápida transmite profesionalidad; una lenta, dejadez.</li>\n</ul>\n<div class=\"callout\"><p>Si tienes tienda online, la velocidad importa todavía más: influye directamente en cuánta gente llega hasta el botón de pagar. Lo vemos en <a href=\"/guias/web-lenta-cuanto-te-cuesta\">cuánto te cuesta una web lenta</a>.</p></div>\n\n<h2 id=\"que-frena\">Qué suele frenar tu web</h2>\n<p>Las causas más habituales de una carga lenta no tienen nada que ver con \"tener mala suerte\". Casi siempre son:</p>\n<ul>\n<li><strong>Imágenes demasiado pesadas</strong> subidas sin optimizar.</li>\n<li><strong>Exceso de plugins</strong> o funciones que ya no usas.</li>\n<li><strong>Un alojamiento barato</strong> y saturado.</li>\n<li><strong>Falta de caché</strong> y de compresión de archivos.</li>\n</ul>\n<p>La buena noticia es que casi todo esto tiene solución sin rehacer la web. Si usas WordPress, te interesa <a href=\"/guias/mejorar-velocidad-web-wordpress\">cómo mejorar la velocidad en WordPress</a>, y si quieres el diagnóstico general, <a href=\"/guias/por-que-mi-web-va-lenta\">por qué mi web va lenta</a>.</p>\n\n<h2 id=\"como-saber\">Cómo saber a qué velocidad va la tuya</h2>\n<p>Antes de tocar nada, mide. No sirve de nada actuar a ciegas: necesitas saber tu LCP, tu INP y tu nota real de Google. Puedes <a href=\"/#analizar\">analizar tu web gratis</a> en segundos y ver esos datos tal y como los ve Google, sin tecnicismos.</p>\n<p>Si el análisis rápido revela problemas de carga, la <a href=\"/optimizar-velocidad-web\">optimización de velocidad</a> deja tu web por debajo de esos 2,5 segundos y en verde donde importa. Medir es gratis; corregir a tiempo es lo que te ahorra clientes perdidos.</p>"
  },
  {
    "slug": "mi-web-no-aparece-en-google",
    "title": "Mi web no aparece en Google: causas y cómo solucionarlo",
    "metaTitle": "Mi web no aparece en Google: causas y solución 2026",
    "description": "¿Tu web no aparece en Google? Repasamos las causas más frecuentes (indexación, contenido, técnica) y cómo solucionarlo paso a paso para pymes y autónomos.",
    "keyword": "mi web no aparece en google",
    "emoji": "🔎",
    "excerpt": "Si tu web no aparece en Google, casi siempre hay una causa concreta y solucionable: desde que Google aún no la ha indexado hasta un bloqueo técnico. Te enseñamos a detectarlo.",
    "updated": "2026-08-06",
    "readingMinutes": 6,
    "toc": [
      {
        "id": "primero-comprueba",
        "label": "Primero: comprueba si estás indexado"
      },
      {
        "id": "web-nueva",
        "label": "Es nueva y Google aún no la ha visto"
      },
      {
        "id": "bloqueos",
        "label": "Bloqueos técnicos que la ocultan"
      },
      {
        "id": "contenido",
        "label": "Falta de contenido y SEO"
      },
      {
        "id": "competencia",
        "label": "Estás, pero muy abajo"
      },
      {
        "id": "que-hacer",
        "label": "Qué hacer ahora"
      }
    ],
    "bodyHtml": "<p>\"He buscado mi negocio en Google y no sale por ningún lado.\" Si te suena, no estás solo: es uno de los problemas más frecuentes entre pymes y autónomos. La frase <strong>\"mi web no aparece en Google\"</strong> puede significar cosas muy distintas, y la solución depende de cuál sea tu caso. Vamos a ordenarlo.</p>\n\n<h2 id=\"primero-comprueba\">Primero: comprueba si estás indexado</h2>\n<p>Antes de nada, averigua si Google conoce tu web. Ve al buscador y escribe <strong>site:tudominio.es</strong> (con tu dominio real). Si aparecen resultados, estás indexado y el problema es de posición, no de existencia. Si no sale nada, Google todavía no tiene tu web en su índice.</p>\n<div class=\"callout\"><p>No confundas \"no aparecer\" con \"no aparecer el primero\". Muchos negocios sí están en Google, pero en la página 5. Para el usuario es como no existir, pero la causa y la solución son diferentes.</p></div>\n\n<h2 id=\"web-nueva\">Es nueva y Google aún no la ha visto</h2>\n<p>Si acabas de publicar tu web, es normal que tarde días o semanas en aparecer. Google necesita rastrearla e indexarla. Para acelerarlo:</p>\n<ul>\n<li><strong>Da de alta tu web en Google Search Console</strong> (la herramienta oficial de Google para dueños de webs).</li>\n<li><strong>Envía tu mapa del sitio</strong> (sitemap.xml) desde ahí.</li>\n<li><strong>Consigue algún enlace</strong> desde tus redes o tu ficha de Google para que Google te descubra antes.</li>\n</ul>\n\n<h2 id=\"bloqueos\">Bloqueos técnicos que la ocultan</h2>\n<p>A veces la web es correcta pero un detalle técnico le está diciendo a Google que no la muestre. Los más habituales:</p>\n<ul>\n<li><strong>La casilla \"disuadir a los motores de búsqueda\"</strong> activada en WordPress (bloquea la indexación entera).</li>\n<li><strong>Una etiqueta \"noindex\"</strong> olvidada tras el desarrollo.</li>\n<li><strong>El archivo robots.txt</strong> bloqueando el acceso a Google.</li>\n<li><strong>Errores del servidor</strong> o una web tan lenta que Google apenas la rastrea.</li>\n</ul>\n<p>Estos fallos son invisibles a simple vista, pero una revisión los detecta enseguida. Si sospechas de algo así, te ayudará <a href=\"/guias/como-saber-si-tu-web-esta-bien-hecha\">cómo saber si tu web está bien hecha</a>.</p>\n\n<h2 id=\"contenido\">Falta de contenido y SEO</h2>\n<p>Si tu web está indexada pero no sale para lo que ofreces, el problema suele ser de <strong>SEO</strong>: Google no entiende para qué palabras debe mostrarte. Señales típicas:</p>\n<ul>\n<li>Páginas con muy poco texto o texto genérico que no menciona tus servicios ni tu ciudad.</li>\n<li>Títulos y descripciones sin trabajar (el famoso \"Inicio\" repetido en todas partes).</li>\n<li>Ausencia de una ficha de <strong>Google Business Profile</strong>, clave para negocios locales.</li>\n</ul>\n<p>Aquí la solución es escribir pensando en lo que busca tu cliente. Tienes una hoja de ruta en <a href=\"/guias/seo-para-pymes-guia-basica\">SEO para pymes: guía básica</a>.</p>\n\n<h2 id=\"competencia\">Estás, pero muy abajo</h2>\n<p>Si ya apareces pero en posiciones bajas, compites con otras webs que llevan más tiempo o tienen mejor SEO. Subir requiere trabajar el contenido, conseguir enlaces de calidad y, algo que mucha gente olvida, <strong>que tu web cargue rápido y funcione bien</strong>. Google prioriza páginas útiles y ágiles; una web lenta lo tiene más difícil, como explicamos en <a href=\"/guias/cuanto-debe-tardar-en-cargar-una-web\">cuánto debe tardar en cargar una web</a>.</p>\n\n<h2 id=\"que-hacer\">Qué hacer ahora</h2>\n<p>El primer paso siempre es el mismo: <strong>diagnosticar</strong>. No tiene sentido reescribir textos si el problema es un \"noindex\", ni pelear la técnica si lo que falta es contenido. Puedes <a href=\"/#analizar\">analizar tu web gratis</a> y ver de un vistazo su nota real de SEO, si hay bloqueos técnicos y qué está frenando su visibilidad.</p>\n<p>Con ese diagnóstico sabrás si es cuestión de esperar, de tocar un ajuste o de trabajar el posicionamiento. Y si prefieres que alguien revise a fondo cada causa, una <a href=\"/guias/que-es-una-auditoria-web\">auditoría web</a> te da el plan completo con prioridades claras.</p>"
  },
  {
    "slug": "que-es-una-auditoria-web",
    "title": "Qué es una auditoría web y para qué sirve",
    "metaTitle": "Qué es una auditoría web y para qué sirve | Cometia",
    "description": "Qué es una auditoría web, qué analiza (velocidad, SEO, accesibilidad y buenas prácticas) y para qué sirve. Guía clara para pymes y autónomos en España.",
    "keyword": "qué es una auditoría web",
    "emoji": "🩺",
    "excerpt": "Una auditoría web es la revisión completa del estado de tu página: velocidad, SEO, accesibilidad y buenas prácticas. Te contamos qué mira, para qué sirve y cuándo hacerla.",
    "updated": "2026-08-06",
    "readingMinutes": 5,
    "toc": [
      {
        "id": "definicion",
        "label": "Qué es una auditoría web"
      },
      {
        "id": "que-analiza",
        "label": "Qué analiza una auditoría"
      },
      {
        "id": "para-que-sirve",
        "label": "Para qué sirve"
      },
      {
        "id": "cuando-hacerla",
        "label": "Cuándo conviene hacerla"
      },
      {
        "id": "como-empezar",
        "label": "Cómo empezar hoy"
      }
    ],
    "bodyHtml": "<p>Cuando llevas un negocio, tu web es tu escaparate abierto las 24 horas. Pero, ¿está funcionando de verdad o solo \"está ahí\"? Responder a eso es exactamente lo que hace una auditoría. En esta guía verás <strong>qué es una auditoría web</strong>, qué revisa y para qué sirve, explicado sin tecnicismos.</p>\n\n<h2 id=\"definicion\">Qué es una auditoría web</h2>\n<p>Una <strong>auditoría web</strong> es una revisión completa del estado de tu página para detectar qué funciona bien, qué falla y qué está costándote visitas o clientes. Es como la revisión del coche: por fuera parece que todo va, pero un vistazo a fondo revela lo que conviene arreglar antes de que se convierta en un problema serio.</p>\n<p>No se trata de opiniones sueltas (\"me gusta más azul\"), sino de <strong>datos objetivos</strong>: las mismas métricas que usa Google para valorar una web, interpretadas con criterio profesional para decirte qué priorizar.</p>\n\n<h2 id=\"que-analiza\">Qué analiza una auditoría</h2>\n<p>Una buena auditoría cubre cuatro grandes áreas, que son precisamente las que puntúa Google de <strong>0 a 100</strong> (90 o más en verde, de 50 a 89 en naranja y por debajo de 50 en rojo):</p>\n<ul>\n<li><strong>Velocidad y rendimiento:</strong> cuánto tarda en cargar y si cumple los <a href=\"/guias/core-web-vitals-que-son\">Core Web Vitals</a> (LCP por debajo de 2,5 s, INP por debajo de 200 ms y CLS por debajo de 0,1).</li>\n<li><strong>SEO:</strong> si Google entiende tu web y puede posicionarla (títulos, textos, indexación, enlaces).</li>\n<li><strong>Accesibilidad:</strong> si cualquier persona puede usarla, incluidas las que navegan de forma distinta. Lo detallamos en <a href=\"/guias/accesibilidad-web-que-es\">qué es la accesibilidad web</a>.</li>\n<li><strong>Buenas prácticas:</strong> seguridad, uso correcto de imágenes, ausencia de errores y tecnología actualizada.</li>\n</ul>\n<div class=\"callout\"><p>Una web puede parecer bonita y estar suspendiendo en las cuatro áreas a la vez. Lo importante no es cómo se ve en tu ordenador, sino cómo la miden Google y tus clientes.</p></div>\n\n<h2 id=\"para-que-sirve\">Para qué sirve</h2>\n<p>La auditoría no es un fin en sí misma: sirve para <strong>tomar decisiones con fundamento</strong> en lugar de a ciegas. En concreto, te permite:</p>\n<ul>\n<li><strong>Saber por qué no llegan clientes:</strong> si la web es lenta, no aparece en Google o pierde visitas por el camino.</li>\n<li><strong>Priorizar el gasto:</strong> arreglar primero lo que más te está costando, no lo que suena más vistoso.</li>\n<li><strong>Evitar rehacer la web entera:</strong> muchas veces el problema se corrige sin empezar de cero.</li>\n<li><strong>Tener un plan claro:</strong> una lista de mejoras ordenadas por impacto.</li>\n</ul>\n<p>Si tu duda concreta es la visibilidad, la auditoría enlaza directamente con <a href=\"/guias/mi-web-no-aparece-en-google\">por qué tu web no aparece en Google</a>; y si es la velocidad, con <a href=\"/guias/por-que-mi-web-va-lenta\">por qué tu web va lenta</a>.</p>\n\n<h2 id=\"cuando-hacerla\">Cuándo conviene hacerla</h2>\n<p>No hace falta esperar a que algo se rompa. Es buen momento para una auditoría cuando:</p>\n<ul>\n<li>Notas que <strong>entran pocas visitas</strong> o pocas se convierten en clientes.</li>\n<li>Tu web tiene <strong>más de un par de años</strong> y nunca se ha revisado.</li>\n<li>Vas a <strong>invertir en publicidad</strong> y quieres que la web aguante bien el tráfico.</li>\n<li>Sospechas que va <strong>lenta</strong> o que ha perdido posiciones en Google.</li>\n</ul>\n\n<h2 id=\"como-empezar\">Cómo empezar hoy</h2>\n<p>Lo mejor es empezar por una foto rápida del estado real. Puedes <a href=\"/#analizar\">analizar tu web gratis</a> y ver en segundos sus notas de velocidad, SEO, accesibilidad y buenas prácticas, tal como las ve Google.</p>\n<p>A partir de ahí, si quieres el detalle de cada punto y un plan de acción priorizado, el informe completo desglosa qué corregir y en qué orden. Y cuando lo que pesa es la carga, la <a href=\"/optimizar-velocidad-web\">optimización de velocidad</a> se encarga de dejar tu web rápida donde importa. Diagnosticar es el primer paso, y no cuesta nada dar el primero.</p>"
  },
  {
    "slug": "seo-para-pymes-guia-basica",
    "title": "SEO para pymes: guía básica para aparecer en Google",
    "metaTitle": "SEO para pymes: guía básica para salir en Google",
    "description": "Guía básica de SEO para pymes y autónomos: elige las palabras que buscan tus clientes, mejora la velocidad de tu web y aparece en Google sin gastar de más.",
    "keyword": "seo para pymes",
    "emoji": "🔍",
    "excerpt": "Aprende a posicionar tu negocio en Google con mejoras sencillas de SEO pensadas para pymes y autónomos, sin necesidad de conocimientos técnicos.",
    "updated": "2026-08-06",
    "readingMinutes": 3,
    "toc": [
      {
        "id": "que-es-seo-pymes",
        "label": "Qué es el SEO y por qué le importa a tu pyme"
      },
      {
        "id": "palabras-clave",
        "label": "Elige las palabras que buscan tus clientes"
      },
      {
        "id": "web-rapida-seo",
        "label": "Una web rápida posiciona mejor"
      },
      {
        "id": "contenido-local",
        "label": "Contenido y SEO local"
      },
      {
        "id": "medir-resultados",
        "label": "Cómo saber si tu SEO funciona"
      }
    ],
    "bodyHtml": "<h2 id=\"que-es-seo-pymes\">Qué es el SEO y por qué le importa a tu pyme</h2>\n<p>El <strong>SEO</strong> (posicionamiento en buscadores) es el conjunto de mejoras que hacen que tu web aparezca cuando alguien busca en Google lo que tú ofreces. Para una pyme o un autónomo, salir en esos resultados sin pagar por cada clic es una de las formas más rentables de conseguir clientes.</p>\n<p>La buena noticia es que no necesitas ser una gran empresa ni tener un presupuesto enorme. Google premia a las webs que responden bien a lo que busca el usuario, cargan rápido y son fáciles de usar. Muchas de esas mejoras están a tu alcance.</p>\n<h2 id=\"palabras-clave\">Elige las palabras que buscan tus clientes</h2>\n<p>Antes de escribir nada, piensa en cómo te buscaría un cliente. No usará el nombre técnico de tu servicio, sino frases naturales: \"fontanero urgencias Valencia\", \"asesoría fiscal para autónomos\" o \"reparación de móviles cerca de mí\".</p>\n<ul>\n<li><strong>Sé específico</strong>: \"abogado laboralista en Sevilla\" convierte mucho mejor que \"abogado\".</li>\n<li><strong>Una idea por página</strong>: dedica cada página a un servicio o una duda concreta.</li>\n<li><strong>Usa la palabra clave</strong> en el título, en la primera línea y de forma natural en el texto.</li>\n</ul>\n<h2 id=\"web-rapida-seo\">Una web rápida posiciona mejor</h2>\n<p>Google mide la experiencia real de quien visita tu web con las <a href=\"/guias/core-web-vitals-que-son\">Core Web Vitals</a>. Una web lenta pierde posiciones y, sobre todo, pierde visitas: la gente se va antes de que termine de cargar.</p>\n<p>Los tres indicadores que debes vigilar son el <strong>LCP</strong> (lo que tarda en verse el contenido principal, bueno por debajo de 2,5 s), el <strong>INP</strong> (la rapidez con que responde a un clic, bueno por debajo de 200 ms) y el <strong>CLS</strong> (que el contenido no baile mientras carga, bueno por debajo de 0,1).</p>\n<div class=\"callout\"><p>Si tu web tarda demasiado, revisa <a href=\"/guias/por-que-mi-web-va-lenta\">por qué tu web va lenta</a> o consulta nuestra <a href=\"/optimizar-velocidad-web\">optimización de velocidad</a>.</p></div>\n<h2 id=\"contenido-local\">Contenido y SEO local</h2>\n<p>Si atiendes a una zona concreta, el SEO local es tu mejor aliado. Da de alta tu <strong>ficha de Google Business Profile</strong>, mantén tu dirección y teléfono coherentes en toda la web y consigue reseñas reales de clientes.</p>\n<p>Además, crea contenido que resuelva dudas de tu sector: guías, preguntas frecuentes o casos prácticos. Ese contenido atrae visitas y demuestra que sabes de lo tuyo. Si tu web es nueva y todavía no aparece, te ayudará leer <a href=\"/guias/mi-web-no-aparece-en-google\">por qué tu web no aparece en Google</a>.</p>\n<h2 id=\"medir-resultados\">Cómo saber si tu SEO funciona</h2>\n<p>El SEO no da resultados de un día para otro, pero sí puedes medir si vas por buen camino. Instala <strong>Google Search Console</strong> (la herramienta gratuita del propio Google) para ver por qué palabras apareces y cuántos clics recibes.</p>\n<p>Antes de invertir en SEO, conviene saber en qué punto está tu web. Puedes <a href=\"/#analizar\">analizar tu web gratis</a> y ver tus notas reales de Google en velocidad, SEO y accesibilidad. Con ese diagnóstico sabrás qué arreglar primero. Y si quieres un plan detallado, una <a href=\"/guias/que-es-una-auditoria-web\">auditoría web</a> te marca el orden de prioridades.</p>"
  },
  {
    "slug": "como-saber-si-tu-web-esta-bien-hecha",
    "title": "Cómo saber si tu web está bien hecha (checklist)",
    "metaTitle": "Cómo saber si tu web está bien hecha (checklist)",
    "description": "Checklist para saber si tu web está bien hecha: velocidad, versión móvil, SEO, seguridad y accesibilidad. Revisa punto por punto si tu web cumple y convierte.",
    "keyword": "cómo saber si mi web está bien hecha",
    "emoji": "✅",
    "excerpt": "Una lista de comprobación sencilla para revisar si tu web cumple en velocidad, móvil, SEO, seguridad y accesibilidad, sin conocimientos técnicos.",
    "updated": "2026-08-06",
    "readingMinutes": 3,
    "toc": [
      {
        "id": "carga-rapido",
        "label": "¿Carga rápido?"
      },
      {
        "id": "movil",
        "label": "¿Se ve bien en el móvil?"
      },
      {
        "id": "aparece-google",
        "label": "¿La encuentra Google?"
      },
      {
        "id": "accesible-segura",
        "label": "¿Es accesible y segura?"
      },
      {
        "id": "convierte",
        "label": "¿Convierte visitas en clientes?"
      },
      {
        "id": "comprobar-nota",
        "label": "Comprueba tu nota real"
      }
    ],
    "bodyHtml": "<h2 id=\"carga-rapido\">¿Carga rápido?</h2>\n<p>La velocidad es lo primero que nota un visitante, aunque no sepa ponerle nombre. Si tu web tarda en aparecer, la gente se marcha. Como referencia, el contenido principal debería verse en <strong>menos de 2,5 segundos</strong> (el indicador que Google llama LCP).</p>\n<p>Google resume la velocidad y la experiencia de tu web en una nota de 0 a 100 con PageSpeed Insights: 90 o más es verde, entre 50 y 89 es naranja (mejorable) y por debajo de 50 es rojo. Si quieres entender esa puntuación, lee <a href=\"/guias/pagespeed-insights-como-interpretar-tu-nota\">cómo interpretar tu nota de PageSpeed</a>.</p>\n<h2 id=\"movil\">¿Se ve bien en el móvil?</h2>\n<p>Buena parte de las visitas —en muchos sectores, la mayoría— llegan desde el teléfono, y Google valora tu web sobre todo por su versión móvil. Comprueba estos puntos desde tu propio móvil:</p>\n<ul>\n<li>El texto se lee sin tener que hacer zoom.</li>\n<li>Los botones son fáciles de pulsar con el dedo.</li>\n<li>No hay elementos que se salgan de la pantalla.</li>\n<li>Las imágenes cargan y no descuadran el diseño.</li>\n</ul>\n<h2 id=\"aparece-google\">¿La encuentra Google?</h2>\n<p>Una web bien hecha es una web que Google puede leer y mostrar. Cada página debería tener un <strong>título único</strong> y una breve descripción, encabezados ordenados y direcciones (URLs) claras. Si buscas el nombre de tu negocio en Google y no apareces, algo falla.</p>\n<p>Para profundizar, te ayudará <a href=\"/guias/mi-web-no-aparece-en-google\">por qué tu web no aparece en Google</a> y las bases del <a href=\"/guias/seo-para-pymes-guia-basica\">SEO para pymes</a>.</p>\n<h2 id=\"accesible-segura\">¿Es accesible y segura?</h2>\n<p>Dos detalles marcan la diferencia entre una web amateur y una profesional. El primero es el <strong>candado de seguridad</strong> (HTTPS): la dirección debe empezar por \"https\" y mostrar un candado en el navegador. El segundo es la <strong>accesibilidad</strong>: que cualquier persona pueda usar tu web, incluidas las que tienen alguna dificultad visual o motora. Puedes leer qué es la <a href=\"/guias/accesibilidad-web-que-es\">accesibilidad web</a> y por qué te conviene.</p>\n<h2 id=\"convierte\">¿Convierte visitas en clientes?</h2>\n<p>De poco sirve una web bonita si no genera contactos. Revisa que quede claro:</p>\n<ul>\n<li>A qué te dedicas, en los primeros segundos.</li>\n<li>Cómo contactar contigo (teléfono, formulario o WhatsApp bien visibles).</li>\n<li>Qué quieres que haga el visitante: pedir presupuesto, llamar o comprar.</li>\n</ul>\n<h2 id=\"comprobar-nota\">Comprueba tu nota real</h2>\n<p>Puedes revisar todos estos puntos a ojo, pero la forma más rápida y objetiva es ver los datos reales de Google. Con Cometia puedes <a href=\"/#analizar\">analizar tu web gratis</a> y obtener las notas de velocidad, SEO, accesibilidad y buenas prácticas en un momento.</p>\n<div class=\"callout\"><p>Si el diagnóstico saca algo en rojo, una <a href=\"/guias/que-es-una-auditoria-web\">auditoría web</a> te dice qué corregir y en qué orden.</p></div>"
  },
  {
    "slug": "accesibilidad-web-que-es",
    "title": "Accesibilidad web: qué es y por qué le conviene a tu negocio",
    "metaTitle": "Accesibilidad web: qué es y por qué te conviene",
    "description": "Qué es la accesibilidad web, a quién beneficia y por qué le conviene a tu negocio: más clientes, mejor SEO y menos riesgos. Mejoras básicas para aplicar.",
    "keyword": "accesibilidad web qué es",
    "emoji": "♿",
    "excerpt": "Descubre qué es la accesibilidad web, a quién beneficia realmente y por qué mejora las ventas, el SEO y la imagen de tu negocio.",
    "updated": "2026-08-06",
    "readingMinutes": 3,
    "toc": [
      {
        "id": "que-es",
        "label": "Qué es la accesibilidad web"
      },
      {
        "id": "a-quien-beneficia",
        "label": "A quién beneficia (a más gente de la que crees)"
      },
      {
        "id": "beneficios-negocio",
        "label": "Por qué le conviene a tu negocio"
      },
      {
        "id": "mejoras-basicas",
        "label": "Mejoras básicas que puedes aplicar"
      },
      {
        "id": "como-medirla",
        "label": "Cómo medir la accesibilidad de tu web"
      }
    ],
    "bodyHtml": "<h2 id=\"que-es\">Qué es la accesibilidad web</h2>\n<p>La <strong>accesibilidad web</strong> es el conjunto de buenas prácticas que hacen que cualquier persona pueda usar tu web, sin importar sus capacidades o el dispositivo que utilice. Incluye a personas con dificultades visuales, auditivas o motoras, pero también a quien navega desde el móvil con una mano o con mala conexión.</p>\n<p>Dicho de forma sencilla: una web accesible es una web que no deja a nadie fuera. En la práctica se apoya en unas pautas internacionales conocidas como WCAG, pero no hace falta que te las aprendas: basta con aplicar unas cuantas ideas de sentido común. Y eso, además de ser lo justo, es bueno para tu negocio.</p>\n<h2 id=\"a-quien-beneficia\">A quién beneficia (a más gente de la que crees)</h2>\n<p>Solemos pensar que la accesibilidad es solo para personas con discapacidad, pero beneficia a muchos más visitantes:</p>\n<ul>\n<li>Personas mayores, que son cada vez más usuarias de internet.</li>\n<li>Quien navega bajo el sol y necesita buen contraste para leer.</li>\n<li>Quien ve un vídeo sin sonido y agradece los subtítulos.</li>\n<li>Cualquiera con una conexión lenta o un móvil antiguo.</li>\n</ul>\n<h2 id=\"beneficios-negocio\">Por qué le conviene a tu negocio</h2>\n<p>Una web accesible tiene ventajas muy concretas:</p>\n<ul>\n<li><strong>Más clientes</strong>: no pierdes a quienes no podrían usar una web mal diseñada.</li>\n<li><strong>Mejor SEO</strong>: muchas buenas prácticas de accesibilidad (textos claros, encabezados ordenados, descripciones de imágenes) también ayudan a Google a entender tu web y refuerzan tu <a href=\"/guias/seo-para-pymes-guia-basica\">SEO</a>.</li>\n<li><strong>Mejor imagen</strong>: una web cuidada transmite profesionalidad.</li>\n<li><strong>Menos riesgos legales</strong>: la normativa europea de accesibilidad se aplica a un número cada vez mayor de empresas.</li>\n</ul>\n<h2 id=\"mejoras-basicas\">Mejoras básicas que puedes aplicar</h2>\n<p>No necesitas rehacer tu web para dar un salto en accesibilidad. Estas mejoras están al alcance de cualquiera:</p>\n<ul>\n<li><strong>Contraste suficiente</strong> entre el texto y el fondo, para que se lea con facilidad.</li>\n<li><strong>Texto alternativo</strong> en las imágenes, que describe lo que muestran.</li>\n<li><strong>Enlaces y botones claros</strong>, con textos como \"Pedir presupuesto\" en lugar de \"haz clic aquí\".</li>\n<li><strong>Formularios etiquetados</strong>, donde cada campo indica qué debe rellenarse.</li>\n<li><strong>Tamaño de letra cómodo</strong> y espaciado suficiente, sobre todo en el móvil.</li>\n</ul>\n<h2 id=\"como-medirla\">Cómo medir la accesibilidad de tu web</h2>\n<p>Google puntúa la accesibilidad de tu web de 0 a 100, igual que hace con la velocidad o el SEO. Es una forma rápida de saber si vas bien: 90 o más es una buena nota, y por debajo conviene revisar los detalles. Ten en cuenta que esa nota mide la parte que se puede comprobar de forma automática; algunos aspectos (como si tu web funciona bien con un lector de pantalla o navegando solo con el teclado) conviene revisarlos también a mano.</p>\n<p>Con Cometia puedes <a href=\"/#analizar\">analizar tu web gratis</a> y ver, entre otras notas, la de accesibilidad. Así sabrás si tu web deja fuera a parte de tus clientes. Y si quieres comprobar el estado general, mira <a href=\"/guias/como-saber-si-tu-web-esta-bien-hecha\">cómo saber si tu web está bien hecha</a>.</p>\n<div class=\"callout\"><p>La accesibilidad va de la mano de la velocidad y el SEO. Una <a href=\"/guias/que-es-una-auditoria-web\">auditoría web</a> revisa las tres cosas y te dice por dónde empezar.</p></div>"
  },
  {
    "slug": "pagespeed-insights-como-interpretar-tu-nota",
    "title": "PageSpeed Insights: cómo interpretar tu nota de Google",
    "metaTitle": "PageSpeed Insights: cómo interpretar tu nota",
    "description": "Aprende a interpretar tu nota de PageSpeed Insights de Google: qué significan los colores, los Core Web Vitals y qué hacer para mejorar la velocidad de tu web.",
    "keyword": "pagespeed insights cómo interpretar",
    "emoji": "📊",
    "excerpt": "Tu web tiene una nota de Google del 0 al 100. Te explicamos qué significan los colores, los Core Web Vitals y qué hacer con esa cifra.",
    "updated": "2026-08-06",
    "readingMinutes": 3,
    "toc": [
      {
        "id": "que-es-pagespeed-insights",
        "label": "Qué es PageSpeed Insights"
      },
      {
        "id": "como-se-lee-la-nota",
        "label": "Cómo se lee la nota de 0 a 100"
      },
      {
        "id": "datos-reales-vs-laboratorio",
        "label": "Datos reales frente a laboratorio"
      },
      {
        "id": "core-web-vitals",
        "label": "Los Core Web Vitals"
      },
      {
        "id": "errores-al-interpretar",
        "label": "Errores al interpretar la nota"
      },
      {
        "id": "que-hacer-con-tu-nota",
        "label": "Qué hacer con tu nota"
      }
    ],
    "bodyHtml": "<h2 id=\"que-es-pagespeed-insights\">Qué es PageSpeed Insights</h2>\n<p>PageSpeed Insights es la herramienta gratuita de Google que mide el rendimiento de una página web y le pone una nota del 0 al 100. Analiza lo rápido que carga, si se ve estable mientras se abre y cómo de bien está preparada para móviles y ordenadores.</p>\n<p>La nota resume decenas de mediciones técnicas en un solo número, por eso conviene entender qué hay detrás antes de alarmarte o de celebrar. Una cifra baja no siempre significa que tu web esté rota, y una alta no garantiza que todo esté perfecto.</p>\n\n<h2 id=\"como-se-lee-la-nota\">Cómo se lee la nota de 0 a 100</h2>\n<p>Google usa tres colores para que se entienda de un vistazo:</p>\n<ul>\n<li><strong>Verde (90 a 100):</strong> rendimiento bueno. Tu web va bien y compite sin problemas.</li>\n<li><strong>Naranja (50 a 89):</strong> rendimiento mejorable. Funciona, pero hay margen para ganar velocidad.</li>\n<li><strong>Rojo (0 a 49):</strong> rendimiento pobre. Aquí es donde se pierden visitas y ventas.</li>\n</ul>\n<p>Verás dos notas distintas: una para <strong>móvil</strong> y otra para <strong>ordenador</strong>. Fíjate sobre todo en la de móvil, porque es más exigente y suele ser desde donde te visita la mayoría de la gente.</p>\n\n<h2 id=\"datos-reales-vs-laboratorio\">Datos reales frente a datos de laboratorio</h2>\n<p>PageSpeed muestra dos tipos de información, y confundirlas es el error más común:</p>\n<ul>\n<li><strong>Datos de campo (reales):</strong> proceden de usuarios que han visitado tu web de verdad en las últimas semanas. Reflejan la experiencia real, aunque solo aparecen si tu web recibe tráfico suficiente.</li>\n<li><strong>Datos de laboratorio:</strong> una simulación que Google hace en el momento, siempre en las mismas condiciones. Sirven para diagnosticar y probar cambios, pero pueden variar de un análisis a otro.</li>\n</ul>\n<p>Si tienes ambos, guíate por los datos de campo para saber cómo lo viven tus clientes.</p>\n\n<h2 id=\"core-web-vitals\">Los Core Web Vitals, la parte que más pesa</h2>\n<p>Dentro del informe hay tres métricas clave, las Core Web Vitals, que Google usa incluso para posicionar:</p>\n<ul>\n<li><strong>LCP</strong> (tiempo hasta que se ve el contenido principal): se considera bueno por debajo de <strong>2,5 segundos</strong>.</li>\n<li><strong>INP</strong> (rapidez con la que la web responde cuando tocas o haces clic): bueno por debajo de <strong>200 milisegundos</strong>.</li>\n<li><strong>CLS</strong> (estabilidad visual, que nada baile mientras carga): bueno por debajo de <strong>0,1</strong>.</li>\n</ul>\n<p>Si quieres entenderlas a fondo, te lo explicamos en <a href=\"/guias/core-web-vitals-que-son\">qué son los Core Web Vitals</a>.</p>\n\n<h2 id=\"errores-al-interpretar\">Errores frecuentes al interpretar la nota</h2>\n<ul>\n<li><strong>Obsesionarte con el 100:</strong> pasar de rojo a verde es lo que de verdad importa; exprimir los últimos puntos suele costar mucho y aportar poco.</li>\n<li><strong>Mirar solo el ordenador:</strong> la nota de móvil es la que refleja a la mayoría de tus visitantes.</li>\n<li><strong>Analizar una sola vez:</strong> los datos de laboratorio varían; repite el análisis y fíjate en la tendencia.</li>\n<li><strong>Confundir velocidad con todo lo demás:</strong> el rendimiento es una parte; también hay notas de SEO, accesibilidad y buenas prácticas que conviene mirar, como contamos en <a href=\"/guias/como-saber-si-tu-web-esta-bien-hecha\">cómo saber si tu web está bien hecha</a>.</li>\n</ul>\n<div class=\"callout\"><p>Consejo: no persigas el 100. Sal del rojo, entra en verde en las Core Web Vitals y habrás ganado casi todo lo que importa para tus clientes y para Google.</p></div>\n\n<h2 id=\"que-hacer-con-tu-nota\">Qué hacer con tu nota</h2>\n<p>La nota es un punto de partida, no un veredicto. Lo útil es saber qué tres o cuatro cosas concretas te están penalizando y en qué orden atacarlas. Para eso ayuda contar con un diagnóstico ordenado, como el que planteamos en <a href=\"/guias/que-es-una-auditoria-web\">qué es una auditoría web</a>.</p>\n<p>En <a href=\"/#analizar\">analiza tu web gratis</a> puedes ver tus notas reales de Google (velocidad, SEO, accesibilidad y buenas prácticas) en segundos. Si quieres el detalle y un plan de acción, el informe completo desglosa cada punto, y con el servicio de <a href=\"/optimizar-velocidad-web\">optimización de velocidad</a> nos encargamos de la parte técnica por ti.</p>"
  },
  {
    "slug": "web-lenta-cuanto-te-cuesta",
    "title": "Una web lenta: cuántos clientes y ventas te está costando",
    "metaTitle": "Web lenta: cuántos clientes y ventas te cuesta",
    "description": "Una web lenta pierde clientes y ventas cada día. Descubre cómo afecta la velocidad a tu negocio, a tu posición en Google y cómo saber cuánto te está costando.",
    "keyword": "web lenta pierde clientes",
    "emoji": "💸",
    "excerpt": "Una web lenta pierde clientes sin que te enteres. Vemos cómo afecta a tus ventas y a Google, y cómo calcular lo que te está costando.",
    "updated": "2026-08-06",
    "readingMinutes": 3,
    "toc": [
      {
        "id": "por-que-importa-la-velocidad",
        "label": "Por qué la velocidad decide si te compran"
      },
      {
        "id": "como-afecta-a-las-ventas",
        "label": "Cómo se traduce en ventas perdidas"
      },
      {
        "id": "el-efecto-en-google",
        "label": "El efecto en Google"
      },
      {
        "id": "senales-de-que-pierdes-clientes",
        "label": "Señales de que pierdes clientes"
      },
      {
        "id": "como-medir-lo-que-pierdes",
        "label": "Cómo medir lo que pierdes"
      },
      {
        "id": "como-recuperar-esos-clientes",
        "label": "Cómo recuperar a esos clientes"
      }
    ],
    "bodyHtml": "<h2 id=\"por-que-importa-la-velocidad\">Por qué la velocidad decide si te compran</h2>\n<p>Cuando alguien entra en tu web, decide en apenas unos segundos si se queda o se va. Si la página tarda en cargar, esa persona no espera: cierra y prueba con la competencia. Da igual lo bueno que sea tu producto si no llega a verlo.</p>\n<p>Una web lenta pierde clientes de la forma más silenciosa que existe: no protestan, no te escriben, simplemente no llegan. Y tú no ves a quien se fue, solo notas que las visitas no cuajan en llamadas ni en ventas.</p>\n\n<h2 id=\"como-afecta-a-las-ventas\">Cómo se traduce en ventas perdidas</h2>\n<p>La relación es directa: cuanto más tarda una página en abrirse, más gente la abandona antes de tiempo. Cada segundo de más es una puerta por la que se escapan posibles clientes.</p>\n<ul>\n<li><strong>Menos formularios y llamadas:</strong> si la web tarda, muchos se van antes de rellenar el contacto.</li>\n<li><strong>Carritos abandonados:</strong> en una tienda, una página de pago lenta hace que se caiga la compra en el último paso.</li>\n<li><strong>Peor imagen de marca:</strong> una web lenta transmite dejadez y resta confianza, aunque tu servicio sea excelente.</li>\n</ul>\n\n<h2 id=\"el-efecto-en-google\">El efecto en Google: menos visibilidad</h2>\n<p>La velocidad no solo espanta a quien ya está en tu web; también influye en cuánta gente llega. Google mide la experiencia de tus visitantes con las Core Web Vitals y tiende a mostrar antes las webs que cargan rápido y bien.</p>\n<p>Si tu web es lenta, es probable que aparezcas más abajo en los resultados, recibas menos visitas y, por tanto, tengas menos oportunidades de venta. Es un doble castigo: llegan menos personas y, encima, las que llegan se van antes. Lo vemos en detalle en <a href=\"/guias/por-que-mi-web-va-lenta\">por qué mi web va lenta</a>, y si tu problema es que apenas apareces, en <a href=\"/guias/mi-web-no-aparece-en-google\">por qué mi web no aparece en Google</a>.</p>\n\n<h2 id=\"senales-de-que-pierdes-clientes\">Señales de que estás perdiendo clientes</h2>\n<ul>\n<li>Tienes visitas, pero casi no llegan consultas ni pedidos.</li>\n<li>La gente entra y sale enseguida (mucho \"rebote\").</li>\n<li>En el móvil tu web se siente pesada o va a tirones.</li>\n<li>Los elementos bailan mientras carga y se hace incómoda de usar.</li>\n<li>Conocidos te comentan que \"tu web tarda\".</li>\n</ul>\n\n<h2 id=\"como-medir-lo-que-pierdes\">Cómo medir lo que te está costando</h2>\n<p>No hace falta adivinar. Puedes ponerle números a tu situación:</p>\n<ul>\n<li>Mira cuánto tarda en cargar tu web y compáralo con lo razonable; te ayudamos en <a href=\"/guias/cuanto-debe-tardar-en-cargar-una-web\">cuánto debe tardar en cargar una web</a>.</li>\n<li>Revisa tus notas reales de Google en velocidad y experiencia de usuario.</li>\n<li>Compara visitas con contactos o pedidos: si hay muchas visitas y pocas conversiones, la velocidad suele ser uno de los culpables.</li>\n</ul>\n\n<h2 id=\"como-recuperar-esos-clientes\">Cómo recuperar a esos clientes</h2>\n<div class=\"callout\"><p>Consejo: antes de invertir más en publicidad para traer visitas, asegúrate de que tu web no las está dejando escapar. Es más barato retener que volver a atraer.</p></div>\n<p>El primer paso es saber en qué punto estás. Con <a href=\"/#analizar\">analiza tu web gratis</a> obtienes en segundos las notas reales de Google de tu web. Si quieres saber exactamente qué frena tu velocidad y cuánto margen tienes, el informe completo te lo desglosa, y con el servicio de <a href=\"/optimizar-velocidad-web\">optimización de velocidad</a> ponemos tu web a punto para que deje de costarte clientes.</p>"
  },
  {
    "slug": "optimizar-velocidad-tienda-online",
    "title": "Cómo optimizar la velocidad de una tienda online",
    "metaTitle": "Cómo optimizar la velocidad de tu tienda online",
    "description": "Guía práctica para optimizar la velocidad de tu tienda online: imágenes, hosting, plugins y mantenimiento para que cargue rápido y vendas más en España.",
    "keyword": "optimizar velocidad tienda online",
    "emoji": "🛒",
    "excerpt": "Imágenes, hosting, plugins y mantenimiento: los pasos clave para que tu tienda online cargue rápido y no pierdas ventas por el camino.",
    "updated": "2026-08-06",
    "readingMinutes": 3,
    "toc": [
      {
        "id": "por-que-una-tienda-debe-ser-rapida",
        "label": "Por qué debe ir rápida"
      },
      {
        "id": "mide-antes-de-optimizar",
        "label": "Mide antes de tocar nada"
      },
      {
        "id": "imagenes-y-catalogo",
        "label": "Imágenes y catálogo"
      },
      {
        "id": "hosting-y-plataforma",
        "label": "Hosting y plataforma"
      },
      {
        "id": "plugins-y-scripts",
        "label": "Plugins y scripts"
      },
      {
        "id": "mantenimiento-continuo",
        "label": "Mantenimiento continuo"
      }
    ],
    "bodyHtml": "<h2 id=\"por-que-una-tienda-debe-ser-rapida\">Por qué una tienda online debe ir rápida</h2>\n<p>En una tienda online la velocidad es dinero. Cada segundo que tarda una ficha de producto o la página de pago en cargar es una compra que corre el riesgo de no completarse. Tus clientes comparan sin esfuerzo: si tu web tarda, se van a otra.</p>\n<p>Además, una tienda carga más peso que una web normal (muchos productos, fotos, filtros, pasarela de pago), así que optimizar la velocidad no es un lujo, es parte del mantenimiento del negocio.</p>\n\n<h2 id=\"mide-antes-de-optimizar\">Mide antes de tocar nada</h2>\n<p>Antes de cambiar cosas a ciegas, necesitas saber de dónde partes y qué te está frenando. Analiza tu tienda para ver sus notas reales de Google y localizar los puntos flojos. Así inviertes el esfuerzo donde de verdad se nota.</p>\n<p>Presta especial atención a las <a href=\"/guias/core-web-vitals-que-son\">Core Web Vitals</a>: LCP por debajo de 2,5 segundos, INP por debajo de 200 milisegundos y CLS por debajo de 0,1. Son las métricas que marcan la experiencia real de quien compra.</p>\n\n<h2 id=\"imagenes-y-catalogo\">Imágenes y catálogo, el mayor lastre</h2>\n<p>En la mayoría de tiendas, las imágenes son lo que más pesa y lo primero que hay que optimizar:</p>\n<ul>\n<li><strong>Comprime las fotos</strong> y súbelas al tamaño en el que se van a ver, no enormes.</li>\n<li>Usa <strong>formatos modernos</strong> (como WebP), que suelen pesar menos manteniendo una calidad muy parecida.</li>\n<li>Aplica <strong>carga diferida</strong> para que las imágenes de más abajo se carguen solo cuando el cliente baja.</li>\n<li>Limita el número de productos por página en los listados muy largos.</li>\n</ul>\n\n<h2 id=\"hosting-y-plataforma\">Hosting y plataforma a la altura</h2>\n<p>Una tienda con tráfico y catálogo necesita un alojamiento decente. Un hosting barato y saturado hace que todo vaya lento por mucho que optimices lo demás.</p>\n<ul>\n<li>Elige un <strong>hosting</strong> pensado para tu plataforma y con recursos suficientes.</li>\n<li>Activa una <strong>caché</strong> para servir las páginas ya preparadas y no montarlas de cero cada vez.</li>\n<li>Considera una <strong>CDN</strong> para que las imágenes lleguen rápido a clientes de toda España.</li>\n</ul>\n<p>Si trabajas con WordPress y WooCommerce, tienes consejos concretos en <a href=\"/guias/mejorar-velocidad-web-wordpress\">mejorar la velocidad en WordPress</a>.</p>\n\n<h2 id=\"plugins-y-scripts\">Plugins y scripts: menos es más</h2>\n<p>Cada plugin, chat, banner o píxel de seguimiento que añades suma peso y trabajo. Muchas tiendas van lentas simplemente por acumular extras que ya no usan.</p>\n<ul>\n<li>Desinstala los <strong>plugins</strong> que no aporten nada.</li>\n<li>Reduce los <strong>scripts</strong> externos (chats, valoraciones, publicidad) a los imprescindibles.</li>\n<li>Revisa que la plantilla no cargue funciones que no utilizas.</li>\n</ul>\n\n<h2 id=\"mantenimiento-continuo\">Mantenimiento continuo</h2>\n<div class=\"callout\"><p>Consejo: la velocidad no se arregla una vez y ya está. Cada campaña, producto o plugin nuevo puede volver a ralentizar la tienda, así que conviene revisarla cada cierto tiempo.</p></div>\n<p>Empieza por saber cómo está hoy tu tienda: con <a href=\"/#analizar\">analiza tu web gratis</a> ves sus notas reales de Google en segundos. Si quieres el detalle de qué corregir y en qué orden, el informe completo te lo desglosa, y con el servicio de <a href=\"/optimizar-velocidad-web\">optimización de velocidad</a> dejamos tu tienda rápida y lista para vender.</p>"
  }
];
