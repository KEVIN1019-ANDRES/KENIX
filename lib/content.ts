export type Slide = {
  image: string
  eyebrow: string
  title: string
  subtitle: string
}

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

export async function readSlides(): Promise<Slide[]> {
  try {
    const res = await fetch('/api/slides', { cache: 'no-store' })
    if (!res.ok) return defaultSlides
    const data = (await res.json()) as Slide[]
    return data.length > 0 ? data : defaultSlides
  } catch {
    return defaultSlides
  }
}

// Reemplaza todos los slides
export async function writeSlides(nextSlides: Slide[]): Promise<void> {
  await fetch('/api/slides', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nextSlides),
  })
}