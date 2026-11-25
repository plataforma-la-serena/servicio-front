const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export const hasWhatsappNumber = WHATSAPP_NUMBER.length > 0;

export function whatsappHref(message: string): string {
  if (!WHATSAPP_NUMBER) {
    return "#contacto";
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
