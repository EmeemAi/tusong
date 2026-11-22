/**
 * Configuración global de TuSong
 * Soporte multimoneda (Argentina e Internacional: España, EE.UU., Latam)
 * Conexión a pasarelas automáticas (Hotmart, PayPal, Mercado Pago) y WhatsApp VIP.
 */
window.TUSONG_CONFIG = {
  brandName: "TuSong",
  
  // Precios por región
  pricing: {
    AR: {
      currency: "ARS",
      symbol: "$",
      price: "20.000",
      priceVideo: "25.000",
      label: "Argentina (ARS)"
    },
    INTL: {
      currency: "USD",
      symbol: "$",
      price: "29",
      priceVideo: "39",
      label: "Internacional / España / EE.UU. (USD / €)"
    }
  },

  // Enlaces de Pago Automático
  // Hotmart (admite tarjetas internacionales, Google Pay, Apple Pay, PayPal, etc.)
  hotmartCheckoutUrl: "https://pay.hotmart.com/TU_PRODUCTO_HOTMART",

  // Mercado Pago (Argentina - Tarjetas, Dinero en cuenta, Cuotas)
  mercadoPagoPaymentUrl: "https://mpago.la/TU_LINK_MERCADOPAGO",
  aliasMercadoPago: "tusong.oficial",

  // PayPal directo (Internacional)
  paypalUrl: "https://paypal.me/TU_USUARIO_PAYPAL/29USD",

  // Endpoint de API / Webhook (puedes usar Formspree, Make, n8n o tu backend para recibir los pedidos por email)
  // Si queda vacío, guarda el pedido en el navegador y redirige a la pasarela
  orderWebhookUrl: "",

  // Canal VIP / Especial WhatsApp
  whatsappNumber: "5491178130971",
  
  // Email oficial de entrega
  deliveryEmail: "pedidos@tusong.com"
};
