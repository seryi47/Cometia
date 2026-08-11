# Cometia · Outreach con nota real de Google

Convierte una lista de webs de pymes en emails en frío **personalizados con su nota real de Google**.
El gancho que casi nadie puede hacer:

> *"He analizado tuweb.es con los datos oficiales de Google: saca **34/100** en velocidad móvil."*

## Cómo se usa

1. **Consigue prospectos** (empresas locales con web mejorable). Fuentes rápidas:
   - Google Maps de tu zona por sector ("fontaneros Albacete", "clínicas dentales Albacete"…). Apunta empresa + web.
   - Directorios locales, páginas amarillas, asociaciones de comercio.
   - Gestorías/asesorías (a estas ofréceles el **Pack 3** para revender a sus clientes).

2. **Crea el CSV** `scripts/prospects.csv` (copia `prospects.example.csv`). Columnas: `empresa,web,email`
   - `web` es lo único obligatorio. `email` es opcional (si no lo tienes, el script deja hueco para que lo busques).

3. **Lanza el análisis + redacción:**
   ```bash
   cd cometia
   node scripts/outreach.mjs scripts/prospects.csv
   ```
   Para listas largas, usa una API key de PageSpeed (gratis en Google Cloud) y evita el límite de cuota:
   ```bash
   PAGESPEED_API_KEY=tu_key node scripts/outreach.mjs scripts/prospects.csv
   ```

4. **Revisa los borradores** en `scripts/outreach-emails.md` (ordenados: webs más lentas = prioridad ALTA primero) y **envíalos a mano** desde tu correo. También tienes `outreach-emails.csv` para llevarlo a un CRM/hoja de cálculo.

## Envío automático (opcional, con cabeza)

```bash
RESEND_API_KEY=... node scripts/outreach.mjs scripts/prospects.csv --send
```
Envía por Resend a los prospectos que traigan `email`. **Recomendación:** empieza SIEMPRE a mano. Enviar mucho volumen en frío desde tu dominio puede dañar tu reputación de correo (y acabar en spam). A mano, personalizado y poco a poco, convierte mucho mejor.

## Legalidad (email en frío B2B en España)

Es defendible por **interés legítimo** en contacto comercial B2B, siempre que:
- Te **identifiques** (el email lo hace: Cometia / Órbita Labs + web + correo).
- El mensaje sea **relevante** para su actividad (lo es: su propia web).
- Incluyas **forma de baja** clara (el email incluye la línea "responde BAJA").
- Respetes las bajas y no insistas a quien no responde.

Evita enviar a direcciones de personas físicas identificadas (nombre.apellido@) sin más base; céntrate en buzones de empresa (info@, contacto@, hola@).

## Qué NO hace
- No usa IA: solo datos de Google (PageSpeed) + plantilla.
- No inventa datos: si una web no se puede medir, lo dice y baja su prioridad.
