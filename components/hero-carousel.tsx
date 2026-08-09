'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { readSlides, type Slide } from '@/lib/content'

export function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    async function load() {
      const data = await readSlides()
      setSlides(data)
    }
    load()
  }, [])

  const next = useCallback(() => setCurrent((c) => (c + 1) % Math.max(slides.length, 1)), [slides.length])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + Math.max(slides.length, 1)) % Math.max(slides.length, 1)), [slides.length])

  useEffect(() => {
    if (slides.length === 0) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, slides.length])

  if (slides.length === 0) {
    return null
  }

  return (
    <section id="inicio" className="relative h-[70vh] min-h-[480px] w-full overflow-hidden bg-background">
      {slides.map((slide, i) => (
        <div key={slide.image}
          className={cn('absolute inset-0 transition-opacity duration-700', i === current ? 'opacity-100' : 'pointer-events-none opacity-0',)} aria-hidden={i !== current}>
          {/* Fondo desenfocado que rellena el espacio, para que la imagen principal no se vea recortada */}
          <img
            src={slide.image || "/placeholder.svg"}
            alt=""
            aria-hidden="true"
            className="h-full w-full scale-110 object-cover object-center blur-2xl opacity-40"
          />
          {/* Imagen principal, ahora completa (sin recortar) */}
          <img
            src={slide.image || "/placeholder.svg"}
            alt={slide.title || "Imagen de la colección"}
            className="absolute inset-0 h-full w-full object-contain object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />

          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto flex w-full max-w-7xl flex-col px-4 md:px-6">
              <span className="mb-3 w-fit bg-primary px-3 py-1 font-sans text-xs font-semibold uppercase tracking-widest text-primary-foreground">
                {slide.eyebrow}
              </span>
              <h1 className="max-w-xl font-sans text-5xl font-bold uppercase leading-none tracking-tight text-foreground text-balance md:text-7xl">
                {slide.title}
              </h1>
              <p className="mt-4 max-w-md font-mono text-base text-muted-foreground text-pretty md:text-lg">
                {slide.subtitle}
              </p>
              <a
                href="#coleccion"
                className="mt-8 w-fit bg-primary px-8 py-3 font-sans text-sm font-bold uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Ver colección
              </a>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-border bg-background/60 text-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Siguiente"
        className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-border bg-background/60 text-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Ir al slide ${i + 1}`}
            className={cn(
              'h-1.5 transition-all',
              i === current ? 'w-8 bg-primary' : 'w-4 bg-muted-foreground/50',
            )}
          />
        ))}
      </div>
    </section>
  )
}