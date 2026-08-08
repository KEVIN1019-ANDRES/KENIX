'use client'

import { useEffect, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { HeroCarousel } from '@/components/hero-carousel'
import { Catalog } from '@/components/catalog'
import { SiteFooter } from '@/components/site-footer'
import { WhatsappButton } from '@/components/whatsapp-button'
import { Truck, Flame, Recycle } from 'lucide-react'

const perks = [
  { icon: Truck, title: 'Envío nacional', text: 'A todo el país en 2–5 días.' },
  { icon: Flame, title: 'Drops exclusivos', text: 'Ediciones limitadas cada mes.' },
  { icon: Recycle, title: 'Cambios fáciles', text: '30 días para cambios y devoluciones.' },
]

export default function Page() {
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return 'https://fenix.com'
    return window.location.href
  }, [])

  useEffect(() => {
    async function trackVisit() {
      try {
        const res = await fetch('/api/metrics', { cache: 'no-store' })
        if (!res.ok) return
        const metrics = await res.json()
        await fetch('/api/metrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...metrics, visits: metrics.visits + 1 }),
        })
      } catch {
        // Si falla, simplemente no se cuenta esta visita.
      }
    }
    trackVisit()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroCarousel />

      <section className="border-y border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Comparte esta tienda con cualquier cliente: {shareUrl}
          </p>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                navigator.clipboard?.writeText(shareUrl)
                window.alert('Enlace copiado para compartir')
              }
            }}
            className="rounded border border-border px-3 py-2 text-sm font-semibold uppercase tracking-wide text-foreground hover:border-primary hover:text-primary"
          >
            Copiar enlace
          </button>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 md:px-6">
          {perks.map((perk) => (
            <div key={perk.title} className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary text-primary-foreground">
                <perk.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-foreground">
                  {perk.title}
                </h3>
                <p className="font-mono text-xs text-muted-foreground">{perk.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Catalog />

      <section id="nosotros" className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary">
              Nosotros
            </span>
            <h2 className="mt-1 font-sans text-4xl font-bold uppercase leading-none tracking-tight text-foreground text-balance md:text-5xl">
              Nacidos de las cenizas de la cultura urbana, FENIX es más que ropa: es actitud.
            </h2>
            <p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground">
             La ropa está en todas partes, pero el estilo solo lo tienen algunos. En FENIX no inventamos la tela; cazamos las mejores piezas de la calle, las unimos y les damos nueva vida.
             No vendemos marcas, vendemos la combinación exacta para que renazcas con actitud. <br />
             🔥 La prenda la encuentras en cualquier lado. El outfit de verdad, solo aquí. <br />
             📦 Envíos a todo el país | Piezas seleccionadas a mano. <br />
             👇 Armá tu estilo al DM o en el link de la bio
            </p>
            <a
              href="#coleccion"
              className="mt-8 inline-block bg-primary px-8 py-3 font-sans text-sm font-bold uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Explorar prendas
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/carousel-1.png"
              alt="Estilo urbano FENIX"
              className="aspect-[3/4] w-full object-cover"
            />
            <img
              src="/carousel-3.png"
              alt="Colección utilitaria FENIX"
              className="mt-8 aspect-[3/4] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <SiteFooter />
      <WhatsappButton />
    </main>
  )
}