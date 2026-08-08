export type Product = {
  id: string
  name: string
  price: number
  category: string
  image: string
  description: string
  sizes: string[]
  colors: string[]
  badge?: string
  featured?: boolean
}

export const DEFAULT_CATEGORIES = [
  'Hoodies',
  'Camisetas',
  'Pantalones',
  'Jackets',
  'Accesorios',
  'Calzado',
] as const

// --- Productos ---

export async function readProducts(): Promise<Product[]> {
  try {
    const res = await fetch('/api/products', { cache: 'no-store' })
    if (!res.ok) return []
    return (await res.json()) as Product[]
  } catch {
    return []
  }
}

// Guarda (crea o actualiza) UN producto
export async function saveProduct(product: Product): Promise<void> {
  await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
}

export async function deleteProduct(id: string): Promise<void> {
  await fetch('/api/products', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
}

// --- Categorías ---

export async function readCategories(): Promise<string[]> {
  try {
    const res = await fetch('/api/categories', { cache: 'no-store' })
    if (!res.ok) return [...DEFAULT_CATEGORIES]
    const names = (await res.json()) as string[]
    return names.length > 0 ? names : [...DEFAULT_CATEGORIES]
  } catch {
    return [...DEFAULT_CATEGORIES]
  }
}

// Reemplaza la lista completa de categorías
export async function writeCategories(nextCategories: string[]): Promise<void> {
  const normalized = Array.from(new Set(nextCategories.map((c) => c.trim()).filter(Boolean)))
  await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ names: normalized }),
  })
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}