'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  PRODUCTS_STORAGE_KEY,
  readCategories,
  readProducts,
  type Product,
} from '@/lib/products'
import { ProductCard } from '@/components/product-card'
import { ProductDetail } from '@/components/product-detail'
import { cn } from '@/lib/utils'

export function Catalog() {
  const [category, setCategory] = useState<string>('Todo')
  const [categories, setCategories] = useState<string[]>(['Todo'])
  const [selected, setSelected] = useState<Product | null>(null)
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([])

  useEffect(() => {
    const syncProducts = () => setCatalogProducts(readProducts())
    const syncCategories = () => setCategories(['Todo', ...readCategories()])

    syncProducts()
    syncCategories()

    const handleStorageUpdate = (event: Event) => {
      if (event instanceof StorageEvent && event.key !== PRODUCTS_STORAGE_KEY) {
        return
      }
      syncProducts()
    }

    window.addEventListener('ruina-products-updated', handleStorageUpdate)
    window.addEventListener('ruina-categories-updated', syncCategories)
    window.addEventListener('storage', handleStorageUpdate)

    return () => {
      window.removeEventListener('ruina-products-updated', handleStorageUpdate)
      window.removeEventListener('ruina-categories-updated', syncCategories)
      window.removeEventListener('storage', handleStorageUpdate)
    }
  }, [])

  const filtered = useMemo(() => {
    if (category === 'Todo') return catalogProducts
    return catalogProducts.filter((p) => p.category === category)
  }, [category, catalogProducts])

  return (
    <section id="coleccion" className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            Catálogo
          </span>
          <h2 className="mt-1 font-sans text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
            La colección
          </h2>
        </div>
        <p className="max-w-sm font-mono text-sm text-muted-foreground">
          Toca cualquier prenda para ver sus detalles, tallas y comprar directo por WhatsApp.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2" id="novedades">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'border px-4 py-2 font-sans text-xs font-semibold uppercase tracking-wide transition-colors',
              category === cat
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} onView={setSelected} />
        ))}
      </div>

      <ProductDetail product={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
