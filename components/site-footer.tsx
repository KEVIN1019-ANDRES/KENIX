'use client'

import { useEffect, useState } from 'react'
import { Camera, Globe, Music, MapPin, Mail } from 'lucide-react'
import { WhatsappIcon } from '@/components/whatsapp-button'
import { buildWhatsappLink } from '@/lib/whatsapp'
import { readSiteContent, type SiteContent } from '@/lib/site-content'

export function SiteFooter() {
  const [content, setContent] = useState<SiteContent | null>(null)

  useEffect(() => {
    const syncContent = () => setContent(readSiteContent())
    syncContent()
    window.addEventListener('ruina-site-content-updated', syncContent)
    return () => window.removeEventListener('ruina-site-content-updated', syncContent)
  }, [])

  if (!content) return null

  return (
    <footer id="contacto" className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <img src="/icono.png" alt="" className="h-24 w-24" />
            <span className="text-4xl font-bold">
              FENIX
            </span>
          </div>
          <p className="mt-4 max-w-sm font-mono text-sm leading-relaxed text-muted-foreground">
            {content.aboutText}
          </p>
          <div className="mt-6 flex gap-3">
            {[Camera, Globe, Music].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-10 w-10 items-center justify-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Red social"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-foreground">
            Explora
          </h3>
          <ul className="mt-4 flex flex-col gap-2">
            {['Inicio', 'Colección', 'Novedades', 'Nosotros'].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-foreground">
            Contacto
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            <li className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              {content.contactLocation}
            </li>
            <li className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" />
              {content.contactEmail}
            </li>
            <li>
              <a
                href={buildWhatsappLink('¡Hola FENIX ! Quiero más información.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <WhatsappIcon className="h-4 w-4 text-primary" />
                {content.contactWhatsapp}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 md:flex-row md:px-6">
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} FENIX. Todos los derechos reservados.
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Diseñado para la calle.
          </p>
        </div>
      </div>
    </footer>
  )
}
