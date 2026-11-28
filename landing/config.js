/**
 * Configuración de TuSong — Argentina (ARS)
 * Modelo de cobro previo por Mercado Pago antes de iniciar la producción.
 */
window.TUSONG_CONFIG = {
  brandName: "TuSong",
  country: "AR",
  currency: "ARS",

  // Precio exacto calculado (mayor valor percibido)
  priceDisplay: "$14.750",
  priceOldDisplay: "",
  numericAmount: "14750",

  // Link de Pago de Mercado Pago ($14.750 ARS)
  mercadoPagoUrl: "https://mpago.la/1qwW21M",
  aliasMercadoPago: "tusong.oficial",

  // Webhook gratuito para recibir las fichas en tu Gmail (FormSubmit)
  orderWebhookUrl: "https://formsubmit.co/ajax/dario.delreal@gmail.com",

  // WhatsApp Business oficial para consultas o entrega
  whatsappNumber: "5491178130971",
  deliveryEmail: "pedidos@tusong.com",
};
