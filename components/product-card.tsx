'use client'

import { Eye } from 'lucide-react'
import { formatPrice, type Product } from '@/lib/products'

export function ProductCard({
  product,
  onView,
}: {
  product: Product
  onView: (product: Product) => void
}) {
  return (
    <article className="group flex flex-col border border-border bg-card">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 bg-primary px-2 py-1 font-sans text-xs font-bold uppercase tracking-wide text-primary-foreground">
            {product.badge}
          </span>
        )}
        <button
          onClick={() => onView(product)}
          className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
          aria-label={`Ver detalles de ${product.name}`}
        >
          <span className="flex items-center gap-2 bg-primary px-5 py-2.5 font-sans text-sm font-bold uppercase tracking-widest text-primary-foreground">
            <Eye className="h-4 w-4" />
            Ver detalles
          </span>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="font-mono text-xs uppercase tracking-widest text-primary">
          {product.category}
        </span>
        <h3 className="mt-1 font-sans text-lg font-semibold uppercase leading-tight text-foreground">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-sans text-lg font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onView(product)}
            className="border border-border px-3 py-1.5 font-sans text-xs font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Detalles
          </button>
        </div>
      </div>
    </article>
  )
}
