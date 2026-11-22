# Contexto Técnico y Estado Actual en Meta

Este documento registra todos los identificadores reales y hallazgos técnicos comprobados durante la configuración inicial de **TuSong**, para evitar repetir pruebas fallidas o perder tiempo.

---

## 1. Identidad y Página de Facebook
* **Nombre actual de la página:** `TuSong` *(anteriormente llamada `CV Profesional`)*
* **Page ID:** `584160754786937`
* **Estado:** Cambio de nombre aprobado y activo en Meta.
* **Notas sobre el muro anterior:** Contenía 5 publicaciones antiguas de 2025 sobre diseño de currículums (por ejemplo, post ID `584160754786937_122136387608822317`) que deben limpiarse/ocultarse desde Facebook ("Administrar publicaciones") antes de lanzar tráfico pago.
* **Avatar y Portada:** En `assets/` se encuentran el logo oficial nuevo (`TuSong_Logo_Oficial.jpeg` y `TuSong_Logo_Oficial_HD.jfif`) y las versiones alternativas generadas anteriormente.

---

## 2. Meta for Developers & Meta Ads
* **App de Meta creada:** `TuSongCommerce`
  * **App ID:** `4600239460293144`
  * **Estado actual:** Modo en desarrollo (*Development Mode*).
  * **Portfolio comercial vinculado:** `CV Profesional`
* **Tokens y Autenticación:**
  * Guardados localmente en `scripts/.env_meta` (ignorado en control de versiones).
  * **User Access Token (Marketing API):** Extendido por 60 días (válido hasta enero 2027).
  * **Page Access Token:** Permanente (`expires_at: 0`, no caduca).
* **Cuenta Publicitaria (Ad Account):**
  * **Ad Account ID:** `act_361995981`
  * **Nombre:** `Daro`
  * **Moneda:** `ARS`
  * **Estado:** `1` (Activa, con método de pago cargado)

---

## 3. Campaña de Prueba Ya Creada en Meta Ads (Estado: `PAUSED`)
Durante la prueba de conexión por API se creó la siguiente estructura real en estado **PAUSADA** (`0,00` gasto):

* **Campaña:** `[TuSong] Validacion - Canciones Personalizadas (PAUSADA)`
  * **ID:** `52769617296290`
  * **Objetivo:** `OUTCOME_TRAFFIC`
* **Conjunto de Anuncios (Ad Set):** `[TuSong] Publico Espana & EE.UU. - Parejas y Aniversarios (PAUSADO)`
  * **ID:** `52769617448090`
  * **Segmentación:** Países `ES` (España) y `US` (Estados Unidos), edades 21-65, Advantage+ audience (`advantage_audience: 1`).
  * **Presupuesto configurado en el test:** `250000` (centavos ARS = 2.500 ARS/día).
  * **Cumplimiento UE (DSA):** `dsa_beneficiary: "TuSong"`, `dsa_payor: "Daro"`.
* **Biblioteca de Imágenes de Meta Ads:**
  * Se subió `TuSong_Portada.jpg` con **Image Hash:** `546add99e5f41d5f98145044fae4922a`.
* **Creativo y Anuncio:**
  * **Creative ID:** `1034788589652692` *(vinculado provisionalmente al post existente `584160754786937_122136387608822317` porque la app en modo desarrollo bloqueó crear dark posts nuevos)*.
  * **Ad ID:** `52769617841290` (`[TuSong] Anuncio de Prueba - Canciones Personalizadas (PAUSADO)`).

---

## 4. Hallazgos y Límites Técnicos de Meta API (Importante)

Para no hacer perder tiempo al usuario con bucles técnicos innecesarios:

1. **Publicar o borrar posts orgánicos en el muro (`pages_manage_posts`):**
   * Meta restringe este permiso para apps personales en modo desarrollo (error `(#200)`). Requiere *Business Verification* + *App Review* formal.
2. **Cambiar foto de perfil y portada vía API:**
   * Meta lo bloquea por políticas de seguridad en la Nueva Experiencia de Páginas; solo puede cambiarse desde la interfaz web/móvil de Facebook.
3. **Crear anuncios nuevos (dark posts con texto/imagen propios) vía Marketing API (`object_story_spec`):**
   * Mientras la app `TuSongCommerce` siga en *Modo en desarrollo*, Meta arroja el error `subcode 1885183` (*"La publicación con contenido publicitario se creó con una app que se encuentra en modo de desarrollo. Debe estar en modo público para crear este anuncio"*).
   * Para publicar nuevos anuncios 100% por API sin errores haría falta pasar la app a modo Público (Live) y usar un **System User Access Token** permanente desde Business Manager (ya que los tokens de Graph API Explorer caducan en ~24-48 horas, error `code 190 / subcode 463`).
4. **Alternativa de cero fricción (comprobada en vivo):**
   * Al publicar el post en la página primero y usar `object_story_id` junto con `call_to_action: {"type": "MESSAGE_PAGE", "value": {"app_destination": "MESSENGER"}}` y `page_welcome_message`, **sí se pueden crear campañas completas de `OUTCOME_ENGAGEMENT` (`CONVERSATIONS` / `MESSENGER`) vía API incluso en modo desarrollo** (sin `call_to_action`, Meta arroja `subcode 1487891`).
   * Alternativamente, siempre se puede ajustar presupuesto o activar desde la interfaz de Meta Ads Manager.

---

## 5. Campaña de Validación España — Flyer 1 (`PAUSED`)
* **Publicación oficial Flyer 1:** `584160754786937_122183584886822317`
* **Campaña:** `[TuSong] Validacion ES - Flyer 1 (Messenger)` — ID: `52770738875090` (`PAUSED`)
* **Métricas finales test 1:** Gasto 3.815,96 ARS, alcance 593 personas (100% España), 19 clics, 7 likes, CTR 2,84%, CPC 200,84 ARS, 0 mensajes.

---

## 6. Campaña de Validación España — Video Reel (`PAUSED`)
* **Publicación oficial Video Reel:** `584160754786937_122183780510822317` (Video ID: `1604367265039030`)
* **Video local editado:** `publicaciones/listos_para_subir/05_Reel_Tu_Lugar_Favorito.mp4` (con texto *"Regala una emoción, regala una canción"* y precio de 35 € en copy).
* **Campaña:** `[TuSong] Validacion ES - Video Reel (Messenger)` — ID: `52771211068890` (`OUTCOME_ENGAGEMENT`, `PAUSED` el 16/11/2026)
* **Conjunto de Anuncios:** `[TuSong] Espana 24-45 - Regalos y Parejas (Video Reel)` — ID: `52771211073290`
  * **Segmentación final (16/11):** España (`ES`), edades estrictas **24–45** (`advantage_audience: 0`), idioma español (`[7, 23]`), plataformas `["facebook", "messenger"]`, intereses (*Regalos, Aniversario, Cumpleaños, Bodas*).
* **Creativo:** ID `1657212845797957`.
* **Anuncio:** `[TuSong] Anuncio Video Reel - Espana (Messenger)` — ID: `52771211079290` (`CAMPAIGN_PAUSED`).
* **Métricas finales test 2 (13/11 al 16/11):** Gasto **6.275,78 ARS**, alcance **1.187**, impresiones **1.380**, clics totales **264** (CTR 19,13%, CPC 23,77 ARS), **31** link clicks, **207** likes netos, **455** reproducciones de video, 1 conversación manual (Feisar Alvarez, sin cierre).
  * *Detalle hoy 16/11 (público 24–45):* 831,70 ARS, 138 alcance, 150 imp, 26 clics, 26 likes, 27 video views, **0** link clicks.

---

## 8. Campaña Activa Argentina — Video Reel WhatsApp (Lanzada el 20/11/2026)
* **Objetivo:** `OUTCOME_ENGAGEMENT` (Optimizado para `CONVERSATIONS` directas a WhatsApp Business).
* **Campaña:** `[TuSong] Validacion Argentina - Video Reel (WhatsApp)` — ID: `52773246924890` (`ACTIVE`)
* **Conjunto de Anuncios:** `[TuSong] Argentina 23-65 - Canciones (WhatsApp)` — ID: `52773247511290` (`ACTIVE`)
  * **Segmentación:** Argentina (`AR`), edades 23–65, Advantage+ audience (`targeting_automation: {advantage_audience: 1}`).
  * **Destino:** WhatsApp Business de TuSong (`+54 9 11 7813-0971`).
  * **Presupuesto diario base:** $1.850 ARS (~$3.000 ARS finales diarios con impuestos bancarios argentinos).
  * **Finalización programada:** Martes 24/11/2026 a las 23:59 hs (`2026-11-25T02:59:59+0000`).
* **Creativo:** ID `1460424559598234` (Reutiliza el post oficial `584160754786937_122183780510822317` con sus 207 likes acumulados y copy corto).
  * **Botón de Acción (CTA):** `WHATSAPP_MESSAGE` ("Enviar mensaje de WhatsApp").
* **Anuncio:** `[TuSong] Anuncio Video Reel - Argentina (WhatsApp)` — ID: `52773247530090` (`ACTIVE`).

