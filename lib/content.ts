export type Slide = {
  image: string
  eyebrow: string
  title: string
  subtitle: string
}

export const CAROUSEL_STORAGE_KEY = 'ruina-carousel-slides'

export const defaultSlides: Slide[] = [
  {
    image: '/carousel-1.png',
    eyebrow: 'Nueva temporada',
    title: 'Domina la calle',
    subtitle: 'Streetwear que habla por ti. Negro, naranja y actitud.',
  },
  {
    image: '/carousel-2.png',
    eyebrow: 'Drop nocturno',
    title: 'Neón y concreto',
    subtitle: 'Piezas pensadas para la noche urbana. Edición limitada.',
  },
  {
    image: '/carousel-3.png',
    eyebrow: 'Colección utilitaria',
    title: 'Estilo sin reglas',
    subtitle: 'Cargos, bombers y más. Comodidad con carácter.',
  },
]

export function readSlides(): Slide[] {
  if (typeof window === 'undefined') return defaultSlides

  try {
    const raw = window.localStorage.getItem(CAROUSEL_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Slide[]) : defaultSlides
  } catch {
    return defaultSlides
  }
}

export function writeSlides(nextSlides: Slide[]) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(CAROUSEL_STORAGE_KEY, JSON.stringify(nextSlides))
  window.dispatchEvent(new Event('ruina-carousel-updated'))
}
