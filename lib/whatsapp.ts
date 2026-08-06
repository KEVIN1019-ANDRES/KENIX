// Cambia este número por el de tu tienda (formato internacional, sin +)
export const WHATSAPP_NUMBER = '573015395359'

export function buildWhatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
