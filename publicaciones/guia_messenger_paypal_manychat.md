# Guía Rápida de Ventas por Messenger + PayPal (y Puente a ManyChat)

Objetivo: Que cerrar pedidos hoy dentro de **Facebook Messenger** tome menos de 1 minuto usando **Respuestas Guardadas** de Meta Business Suite, y que luego puedas conectar exactamente este mismo guion a **ManyChat** sin reescribir nada.

---

## 1. Configuración Inicial en Meta Business Suite (Una sola vez)

### A. Mensaje de Bienvenida Instantáneo (Instant Reply)
Actívalo en *Meta Business Suite → Bandeja de entrada → Automatizaciones → Respuesta instantánea*:

> ¡Hola! 👋 Gracias por escribir a **TuSong** 🎵❤️
>
> Convertimos tu historia real en una canción personalizada lista en **24–48 horas**.
>
> Para empezar o darte el precio exacto, cuéntanos brevemente:
> **¿Para quién sería la canción y qué ocasión quieres celebrar?** (aniversario, cumpleaños, boda, familia…) 😊

---

## 2. Las 4 Respuestas Guardadas (1 clic al atender)

Guarda estas 4 plantillas en *Meta Business Suite → Respuestas guardadas*:

### Plantilla 1: `/brief` — Pedir los detalles de la canción + confirmar precio
*(Úsala cuando el cliente ya dijo qué ocasión busca)*

> ¡Qué gran idea! ❤️ Será un regalo inolvidable.
>
> El valor de tu canción personalizada completa (letra 100% original con tu historia + archivo digital listo para escuchar y regalar + letra en PDF + 1 ajuste menor incluido) es de **[PRECIO: ej. 35 € / $39 USD]**, con entrega en **24 a 48 horas** y pago seguro por **PayPal**.
>
> Para crearla tal como la imaginas, respóndeme estas 5 cositas rápidas en un solo mensaje:
> 1️⃣ **Nombre(s) y relación** (ej. mi pareja Laura, mi mamá Ana…)
> 2️⃣ **Estilo musical preferido** (Balada acústica, Pop, Country/Folk, Piano, Rock suave, Urbano…)
> 3️⃣ **Voz preferida** (Femenina o Masculina)
> 4️⃣ **Tono** (Emotivo/romántico, alegre/divertido o nostálgico)
> 5️⃣ **3 a 5 detalles clave** (cómo se conocieron, apodos, un lugar/viaje especial y el mensaje final que quieres decirle) ✍️🎶

---

### Plantilla 2: `/paypal` — Confirmar historia y enviar enlace de PayPal
*(Úsala en cuanto te mande las 5 respuestas)*

> ¡Me encanta la historia! 😍 Con esos detalles va a quedar una canción preciosa y súper emotiva.
>
> Para comenzar a crearla hoy mismo, puedes completar tu reserva de forma segura aquí por **PayPal**:
> 👉 **[TU_LINK_PAYPAL_ME_O_CHECKOUT]** *(Monto: [PRECIO])*
>
> En cuanto hagas el pago, envíame una captura o avísame por aquí y la ponemos en producción. La recibirás lista en **24–48 horas** (e incluye **1 revisión menor** de letra o detalle si quieres ajustar algo). 🎵✨

---

### Plantilla 3: `/confirmado` — Pago recibido (inicio de producción)

> ¡Pago confirmado! 🎉 Muchas gracias por confiar en **TuSong**.
>
> Ya empezamos a crear tu canción personalizada con todos tus detalles. En **24 a 48 horas** te la enviaremos por aquí mismo lista para escuchar y sorprender (y por correo si lo prefieres). ¡Prepárate para emocionar! 🎧❤️

---

### Plantilla 4: `/entrega` — Entrega final de la canción

> ¡Tu canción personalizada ya está lista! 🎵✨
>
> Te enviamos el audio final junto con la letra completa. Escúchala con calma y cuéntanos qué te parece (recuerda que tienes **1 revisión menor incluida** por si quieres ajustar algún detalle).
>
> ¡Ojalá emocione muchísimo cuando la escuche! ❤️ Si nos quieres contar su reacción después, nos hará muy felices.

---

## 3. Puente a ManyChat (Fase 2 — Automatización 100%)

Cuando conectes tu página `TuSong` a **ManyChat**, solo debes replicar estos mismos 4 bloques en un solo flujo visual:

1. **Disparador (Trigger):** Usuario hace clic en *"Enviar mensaje"* desde cualquier Post o Anuncio de Meta Ads (o escribe palabras clave como `canción`, `precio`, `info`).
2. **Bloque de Calificación + Precio:** Mensaje `/brief` dividido en *User Input* secuenciales (guardando `ocasion`, `destinatario`, `estilo`, `voz`, `historia`) o un mini formulario rápido.
3. **Bloque de Cobro:** Botón directo hacia tu enlace de **PayPal** (`paypal.me` o Stripe/PayPal Checkout) + botón *"Ya realicé el pago"*.
4. **Notificación automática a Dario:** ManyChat envía por Email / Telegram / Google Sheets las 5 respuestas del cliente ya ordenadas, para que tú entres directo a generar letra (con tu asistente IA) y producir la música sin leer chats sueltos.
