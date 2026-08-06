export type SiteContent = {
  aboutTitle: string
  aboutText: string
  contactLocation: string
  contactEmail: string
  contactWhatsapp: string
  contactWhatsappMessage: string
}

export const SITE_CONTENT_STORAGE_KEY = 'Finex-site-content'

export const defaultSiteContent: SiteContent = {
  aboutTitle: 'Nacidos de las cenizas de la cultura urbana, FENIX es más que ropa: es actitud.',
  aboutText:
    'La ropa está en todas partes, pero el estilo solo lo tienen algunos. En FENIX no inventamos la tela; cazamos las mejores piezas de la calle, las unimos y les damos nueva vida. No vendemos marcas, vendemos la combinación exacta para que renazcas con actitud.',
  contactLocation: 'Bogotá, Colombia',
  contactEmail: 'hola@ruina.co',
  contactWhatsapp: '+57 300 000 0000',
  contactWhatsappMessage: '¡Hola FINIX ! Quiero más información.',
}

export function readSiteContent(): SiteContent {
  if (typeof window === 'undefined') return defaultSiteContent

  try {
    const raw = window.localStorage.getItem(SITE_CONTENT_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SiteContent) : defaultSiteContent
  } catch {
    return defaultSiteContent
  }
}

export function writeSiteContent(nextContent: SiteContent) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(nextContent))
  window.dispatchEvent(new Event('ruina-site-content-updated'))
}
