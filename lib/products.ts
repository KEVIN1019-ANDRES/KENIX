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

export const CATEGORIES_STORAGE_KEY = 'fenix-categories'
export const PRODUCTS_STORAGE_KEY = 'Finex-products'

export const products: Product[] = [
  {
    id: 'hoodie-shadow',
    name: 'Hoodie Shadow Oversize',
    price: 189900,
    category: 'Hoodies',
    image: '/product-hoodie.png',
    description:
      'Hoodie oversize de algodón pesado 380gsm con capucha forrada y bolsillo canguro. Corte holgado para un look de calle relajado. Detalle bordado en naranja en el pecho.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Naranja'],
    badge: 'Nuevo',
  },
  {
    id: 'tee-riot',
    name: 'Camiseta Riot Graphic',
    price: 79900,
    category: 'Camisetas',
    image: '/product-tshirt.png',
    description:
      'Camiseta de corte boxy con estampado gráfico exclusivo en naranja de alta densidad. Algodón 100% peinado, cuello reforzado que no se deforma.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Negro'],
    badge: 'Top ventas',
    featured: true,
  },
  {
    id: 'cargo-tactical',
    name: 'Cargo Tactical Straps',
    price: 219900,
    category: 'Pantalones',
    image: '/product-cargo.png',
    description:
      'Pantalón cargo con múltiples bolsillos utilitarios, correas ajustables en naranja y tobillo elástico. Tela ripstop resistente ideal para el día a día urbano.',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Negro'],
  },
  {
    id: 'jacket-blaze',
    name: 'Bomber Blaze',
    price: 289900,
    category: 'Jackets',
    image: '/product-jacket.png',
    description:
      'Chaqueta bomber acolchada en bloque naranja y negro con cierre metálico y ribetes elásticos. Aislamiento ligero para las noches frías de ciudad.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Naranja', 'Negro'],
    badge: 'Edición limitada',
    featured: true,
  },
  {
    id: 'cap-street',
    name: 'Snapback Street Logo',
    price: 64900,
    category: 'Accesorios',
    image: '/product-cap.png',
    description:
      'Gorra snapback estructurada con logo bordado en naranja. Visera plana y ajuste trasero regulable. El complemento perfecto para cerrar tu outfit.',
    sizes: ['Única'],
    colors: ['Negro'],
  },
  {
    id: 'sneakers-concrete',
    name: 'Sneakers Concrete High',
    price: 349900,
    category: 'Calzado',
    image: '/product-sneakers.png',
    description:
      'Zapatillas high-top con suela chunky, detalles reflectivos naranja y plantilla acolchada. Diseñadas para dominar el asfalto con estilo y comodidad.',
    sizes: ['38', '39', '40', '41', '42', '43'],
    colors: ['Negro/Naranja'],
    badge: 'Nuevo',
    featured: true,
  },
]

export function readCategories(): string[] {
  if (typeof window === 'undefined') {
    return [...DEFAULT_CATEGORIES]
  }

  try {
    const raw = window.localStorage.getItem(CATEGORIES_STORAGE_KEY)
    if (!raw) {
      return [...DEFAULT_CATEGORIES]
    }

    const parsed = JSON.parse(raw) as string[]
    if (!Array.isArray(parsed)) {
      return [...DEFAULT_CATEGORIES]
    }

    return parsed.map((category) => category.trim()).filter(Boolean)
  } catch {
    return [...DEFAULT_CATEGORIES]
  }
}

export function writeCategories(nextCategories: string[]) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const normalized = Array.from(new Set(nextCategories.map((category) => category.trim()).filter(Boolean)))
    window.localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(normalized))
    window.dispatchEvent(new Event('ruina-categories-updated'))
  } catch {
    // Ignora errores de almacenamiento del navegador.
  }
}

export function readProducts(): Product[] {
  if (typeof window === 'undefined') {
    return products
  }

  try {
    const raw = window.localStorage.getItem(PRODUCTS_STORAGE_KEY)
    if (!raw) {
      return products
    }

    const parsed = JSON.parse(raw) as Product[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : products
  } catch {
    return products
  }
}

export function writeProducts(nextProducts: Product[]) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(nextProducts))
    window.dispatchEvent(new Event('ruina-products-updated'))
  } catch {
    // Ignora errores de almacenamiento del navegador.
  }
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}
