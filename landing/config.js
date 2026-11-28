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

  // Google Apps Script Web App (guarda fila en Google Sheets y avisa a dario.delreal@gmail.com)
  orderWebhookUrl: "https://script.google.com/macros/s/AKfycbw9GgPA6MynRjRERiMAxPrxx6V4luwTO1YImXVFHSz1zGzkoRPXhssT76l62Toyflg8cw/exec",

  // WhatsApp Business oficial para consultas o entrega
  whatsappNumber: "5491178130971",
  deliveryEmail: "pedidos@tusong.com",
};
