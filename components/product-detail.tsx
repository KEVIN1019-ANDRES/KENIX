'use client'

import { useEffect, useState } from 'react'
import { X, Check, Truck, ShieldCheck, ShoppingCart } from 'lucide-react'
import { formatPrice, type Product } from '@/lib/products'
import { WhatsappIcon } from '@/components/whatsapp-button'
import { buildWhatsappLink } from '@/lib/whatsapp'

export function ProductDetail({
  product,
  onClose,
}: {
  product: Product | null
  onClose: () => void
}) {
  const [size, setSize] = useState<string | null>(null)
  const [color, setColor] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setSize(product?.sizes[0] ?? null)
    setColor(product?.colors[0] ?? null)
    setAdded(false)
  }, [product])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (product) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [product, onClose])

  if (!product) return null

  const addToCart = () => {
    if (typeof window === 'undefined') return

    const stored = JSON.parse(window.localStorage.getItem('ruina-cart') ?? '[]') as Array<{ id: string; name: string }>
    const nextCart = [...stored, { id: product.id, name: product.name }]
    window.localStorage.setItem('ruina-cart', JSON.stringify(nextCart))
    window.dispatchEvent(new Event('ruina-cart-updated'))
    setAdded(true)

    const metrics = JSON.parse(window.localStorage.getItem('ruina-metrics') ?? '{"visits":128,"orders":14,"conversions":11}') as { visits: number; orders: number; conversions: number }
    const nextMetrics = { ...metrics, orders: metrics.orders + 1, conversions: Math.min(100, Math.round(((metrics.orders + 1) / Math.max(metrics.visits, 1)) * 100)) }
    window.localStorage.setItem('ruina-metrics', JSON.stringify(nextMetrics))
    window.dispatchEvent(new Event('ruina-metrics-updated'))
  }

  const message = `¡Hola FENIX! Me interesa este producto:\n\n*${product.name}*\nPrecio: ${formatPrice(
    product.price,
  )}\nTalla: ${size ?? 'por definir'}\nColor: ${color ?? 'por definir'}\n\n¿Está disponible?`

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-0 backdrop-blur-sm md:items-center md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden border border-border bg-card md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center border border-border bg-background/60 text-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative aspect-square w-full shrink-0 bg-secondary md:w-1/2">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          {product.badge && (
            <span className="absolute left-4 top-4 bg-primary px-2 py-1 font-sans text-xs font-bold uppercase tracking-wide text-primary-foreground">
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            {product.category}
          </span>
          <h2 className="mt-1 font-sans text-2xl font-bold uppercase leading-tight text-foreground md:text-3xl">
            {product.name}
          </h2>
          <span className="mt-3 font-sans text-2xl font-bold text-foreground">
            {formatPrice(product.price)}
          </span>

          <p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-6">
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground">
              Color
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((option) => (
                <button
                  key={option}
                  onClick={() => setColor(option)}
                  className={
                    'flex items-center gap-2 border px-3 py-2 font-mono text-xs font-semibold uppercase transition-colors ' +
                    (color === option
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:border-primary')
                  }
                >
                  {color === option && <Check className="h-3.5 w-3.5" />}
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground">
              Talla
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={
                    'flex min-w-11 items-center justify-center gap-1 border px-3 py-2 font-sans text-sm font-semibold uppercase transition-colors ' +
                    (size === s
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-foreground hover:border-primary')
                  }
                >
                  {size === s && <Check className="h-3.5 w-3.5" />}
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3">
            <button
              onClick={addToCart}
              className="flex items-center justify-center gap-2 border border-primary px-6 py-3.5 font-sans text-sm font-bold uppercase tracking-widest text-primary transition-transform hover:-translate-y-0.5"
            >
              <ShoppingCart className="h-5 w-5" />
              {added ? 'Agregado al carrito' : 'Agregar al carrito'}
            </button>
            <a
              href={buildWhatsappLink(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] px-6 py-3.5 font-sans text-sm font-bold uppercase tracking-widest text-white transition-transform hover:-translate-y-0.5"
            >
              <WhatsappIcon className="h-5 w-5" />
              Comprar por WhatsApp
            </a>
          </div>

          <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4">
            <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <Truck className="h-4 w-4 text-primary" />
              Envíos a todo el país
            </span>
            <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Cambios y devoluciones garantizadas
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
