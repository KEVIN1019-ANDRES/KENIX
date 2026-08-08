'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Plus, Trash2, PencilLine, ArrowLeft, Lock, Eye, EyeOff, ImagePlus, BarChart3, ShoppingBag, MonitorPlay } from 'lucide-react'
import { readCategories, readProducts, saveProduct, deleteProduct, writeCategories, type Product } from '@/lib/products'
import { defaultSlides, readSlides, writeSlides, type Slide } from '@/lib/content'
import { defaultSiteContent, readSiteContent, writeSiteContent, type SiteContent } from '@/lib/site-content'

const emptyProduct: Product = {
  id: '',
  name: '',
  price: 0,
  category: 'Camisetas',
  image: '',
  description: '',
  sizes: ['S'],
  colors: ['Negro'],
}

type Metrics = {
  visits: number
  orders: number
  conversions: number
}

const defaultMetrics: Metrics = { visits: 128, orders: 14, conversions: 11 }

async function readMetrics(): Promise<Metrics> {
  try {
    const res = await fetch('/api/metrics', { cache: 'no-store' })
    if (!res.ok) return defaultMetrics
    const data = await res.json()
    return { visits: data.visits, orders: data.orders, conversions: data.conversions }
  } catch {
    return defaultMetrics
  }
}

async function writeMetrics(nextMetrics: Metrics): Promise<void> {
  await fetch('/api/metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nextMetrics),
  })
}

const storageKeys = {
  password: 'ruina-admin-password',
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [draft, setDraft] = useState<Product>(emptyProduct)
  const [sizesInput, setSizesInput] = useState('S')
  const [colorsInput, setColorsInput] = useState('Negro')
  const [badgeInput, setBadgeInput] = useState('')
  const [featuredInput, setFeaturedInput] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [slides, setSlides] = useState<Slide[]>(defaultSlides)
  const [metrics, setMetrics] = useState<Metrics>(defaultMetrics)
  const [categories, setCategories] = useState<string[]>([])
  const [categoryDraft, setCategoryDraft] = useState('')
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null)
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingCarouselImage, setUploadingCarouselImage] = useState(false)
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadAll() {
      const [p, s, m, c, cat] = await Promise.all([
        readProducts(),
        readSlides(),
        readMetrics(),
        readSiteContent(),
        readCategories(),
      ])
      setProducts(p)
      setSlides(s)
      setMetrics(m)
      setSiteContent(c)
      setCategories(cat)
      setIsLoading(false)
    }
    loadAll()

    const savedPassword = window.localStorage.getItem(storageKeys.password)
    if (savedPassword) {
      setPassword(savedPassword)
      setIsAuthenticated(true)
    }
    setHasCheckedAuth(true)
  }, [])

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault()
    const correctPassword = 'fenix2026'
    if (password === correctPassword) {
      setLoginError('')
      window.localStorage.setItem(storageKeys.password, password)
      setIsAuthenticated(true)
      return
    }
    setLoginError('Contraseña incorrecta. Intenta de nuevo.')
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    const reader = new FileReader()
    reader.onload = () => {
      setDraft((d) => ({ ...d, image: reader.result as string }))
      setUploadingImage(false)
    }
    reader.readAsDataURL(file)
  }

  const handleCarouselImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploadingCarouselImage(true)
    const reader = new FileReader()
    reader.onload = async () => {
      const nextSlides = [...slides]
      nextSlides[index] = { ...nextSlides[index], image: reader.result as string }
      setSlides(nextSlides)
      await writeSlides(nextSlides)
      setUploadingCarouselImage(false)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveSlide = async (index: number) => {
    const nextSlides = slides.filter((_, slideIndex) => slideIndex !== index)
    setSlides(nextSlides)
    await writeSlides(nextSlides)
  }

  const updateSlideField = async (index: number, field: keyof Slide, value: string) => {
    const nextSlides = [...slides]
    nextSlides[index] = { ...nextSlides[index], [field]: value }
    setSlides(nextSlides)
    await writeSlides(nextSlides)
  }

  const handleSaveSiteContent = async (event: React.FormEvent) => {
    event.preventDefault()
    const nextContent: SiteContent = {
      aboutTitle: siteContent.aboutTitle.trim() || defaultSiteContent.aboutTitle,
      aboutText: siteContent.aboutText.trim() || defaultSiteContent.aboutText,
      contactLocation: siteContent.contactLocation.trim() || defaultSiteContent.contactLocation,
      contactEmail: siteContent.contactEmail.trim() || defaultSiteContent.contactEmail,
      contactWhatsapp: siteContent.contactWhatsapp.trim() || defaultSiteContent.contactWhatsapp,
      contactWhatsappMessage: siteContent.contactWhatsappMessage.trim() || defaultSiteContent.contactWhatsappMessage,
    }
    setSiteContent(nextContent)
    await writeSiteContent(nextContent)
  }

  const handleCategorySubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmedCategory = categoryDraft.trim()
    if (!trimmedCategory) return

    const nextCategories = editingCategoryIndex === null
      ? [...categories, trimmedCategory]
      : categories.map((category, index) => (index === editingCategoryIndex ? trimmedCategory : category))

    const normalizedCategories = Array.from(new Set(nextCategories.map((c) => c.trim()).filter(Boolean)))
    setCategories(normalizedCategories)
    await writeCategories(normalizedCategories)
    setCategoryDraft('')
    setEditingCategoryIndex(null)
  }

  const handleEditCategory = (category: string, index: number) => {
    setCategoryDraft(category)
    setEditingCategoryIndex(index)
  }

  const handleDeleteCategory = async (index: number) => {
    const categoryToRemove = categories[index]
    if (!categoryToRemove) return

    const nextCategories = categories.filter((_, categoryIndex) => categoryIndex !== index)
    const normalizedCategories = Array.from(new Set(nextCategories.map((c) => c.trim()).filter(Boolean)))
    setCategories(normalizedCategories)
    await writeCategories(normalizedCategories)

    const fallbackCategory = normalizedCategories[0] || 'Sin categoría'
    const nextProducts = products.map((product) =>
      product.category === categoryToRemove ? { ...product, category: fallbackCategory } : product,
    )
    setProducts(nextProducts)
    for (const product of nextProducts.filter((p) => p.category === fallbackCategory)) {
      await saveProduct(product)
    }
    setCategoryDraft('')
    setEditingCategoryIndex(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!draft.name.trim() || !draft.description.trim()) return

    const normalizedProduct: Product = {
      ...draft,
      id: draft.id || draft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      price: Number(draft.price) || 0,
      sizes: sizesInput.split(',').map((item) => item.trim()).filter(Boolean),
      colors: colorsInput.split(',').map((item) => item.trim()).filter(Boolean),
      image: draft.image || '/placeholder.svg',
      badge: badgeInput.trim() || undefined,
      featured: featuredInput,
    }

    await saveProduct(normalizedProduct)

    const nextProducts = editingId
      ? products.map((item) => (item.id === editingId ? normalizedProduct : item))
      : [normalizedProduct, ...products]

    setProducts(nextProducts)
    setDraft(emptyProduct)
    setSizesInput('S')
    setColorsInput('Negro')
    setBadgeInput('')
    setFeaturedInput(false)
    setEditingId(null)
  }

  const handleEdit = (product: Product) => {
    setDraft(product)
    setEditingId(product.id)
    setSizesInput(product.sizes.join(', '))
    setColorsInput(product.colors.join(', '))
    setBadgeInput(product.badge ?? '')
    setFeaturedInput(Boolean(product.featured))
  }

  const handleDelete = async (id: string) => {
    await deleteProduct(id)
    const nextProducts = products.filter((item) => item.id !== id)
    setProducts(nextProducts)
    if (editingId === id) {
      setDraft(emptyProduct)
      setEditingId(null)
    }
  }

  const summary = useMemo(() => {
    return {
      total: products.length,
      categories: new Set(products.map((item) => item.category)).size,
    }
  }, [products])

  if (!hasCheckedAuth) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground">
        <form onSubmit={handleLogin} className="w-full max-w-md rounded border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <Lock className="h-5 w-5" />
            <h1 className="font-sans text-2xl font-semibold uppercase">Acceso privado</h1>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">Introduce la contraseña para entrar al panel.</p>
          {loginError ? (
            <div className="mb-4 rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {loginError}
            </div>
          ) : null}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-border bg-background px-3 py-2 pr-10 text-sm"
              placeholder="Contraseña"
            />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <button type="submit" className="mt-4 w-full rounded bg-primary px-4 py-2 font-semibold uppercase tracking-wide text-primary-foreground">
            Entrar
          </button>
          <Link href="/" className="mt-3 inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
            <ArrowLeft className="h-4 w-4" />
            Volver a la página de inicio
          </Link>
        </form>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Cargando panel...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground md:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
              <ArrowLeft className="h-4 w-4" />
              Volver al sitio
            </Link>
            <h1 className="font-sans text-3xl font-bold uppercase tracking-tight">Panel de administración</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Gestiona productos, carrusel y métricas desde un único lugar.
            </p>
          </div>

          <div className="rounded border border-border bg-card p-4 text-sm">
            <p className="font-semibold">Productos: {summary.total}</p>
            <p className="text-muted-foreground">Categorías: {summary.categories}</p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-primary">
              <MonitorPlay className="h-4 w-4" />
              <p className="text-sm font-semibold uppercase">Visitas</p>
            </div>
            <p className="mt-2 text-2xl font-bold">{metrics.visits}</p>
            <p className="mt-1 text-xs text-muted-foreground">Se incrementan cada vez que alguien entra a la tienda.</p>
          </div>
          <div className="rounded border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-primary">
              <ShoppingBag className="h-4 w-4" />
              <p className="text-sm font-semibold uppercase">Pedidos</p>
            </div>
            <p className="mt-2 text-2xl font-bold">{metrics.orders}</p>
            <p className="mt-1 text-xs text-muted-foreground">Se suman cuando agregas un producto al carrito.</p>
          </div>
          <div className="rounded border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-primary">
              <BarChart3 className="h-4 w-4" />
              <p className="text-sm font-semibold uppercase">Conversiones</p>
            </div>
            <p className="mt-2 text-2xl font-bold">{metrics.conversions}%</p>
            <p className="mt-1 text-xs text-muted-foreground">Se calcula con tus pedidos sobre el total de visitas.</p>
          </div>
        </section>

        <section className="rounded border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-sans text-xl font-semibold uppercase">Categorías</h2>
            <span className="text-sm text-muted-foreground">Controla las secciones del catálogo</span>
          </div>

          <form onSubmit={handleCategorySubmit} className="mb-4 flex flex-col gap-3 md:flex-row">
            <input
              value={categoryDraft}
              onChange={(event) => setCategoryDraft(event.target.value)}
              className="flex-1 border border-border bg-background px-3 py-2 text-sm"
              placeholder="Ej. Accesorios premium"
            />
            <div className="flex gap-2">
              <button type="submit" className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary-foreground">
                <Plus className="h-4 w-4" />
                {editingCategoryIndex === null ? 'Agregar' : 'Guardar'}
              </button>
              {editingCategoryIndex !== null ? (
                <button type="button" onClick={() => { setCategoryDraft(''); setEditingCategoryIndex(null) }} className="rounded border border-border px-4 py-2 text-sm font-semibold uppercase tracking-wide">
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>

          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <div key={`${category}-${index}`} className="flex items-center gap-2 rounded border border-border px-3 py-2 text-sm">
                <span>{category}</span>
                <button type="button" onClick={() => handleEditCategory(category, index)} className="text-primary">
                  <PencilLine className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => handleDeleteCategory(index)} className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-sans text-xl font-semibold uppercase">Lista de productos</h2>
              <span className="text-sm text-muted-foreground">{products.length} prendas</span>
            </div>

            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="flex flex-col gap-3 rounded border border-border p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex items-center gap-2 rounded border border-border px-3 py-2 text-sm hover:border-primary hover:text-primary"
                    >
                      <PencilLine className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex items-center gap-2 rounded border border-border px-3 py-2 text-sm text-red-500 hover:border-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                      Borrar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-sans text-xl font-semibold uppercase">
                {editingId ? 'Editar producto' : 'Agregar producto'}
              </h2>
              <span className="rounded bg-primary px-2 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                {editingId ? 'Modo edición' : 'Nuevo'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold">Nombre</label>
                <input
                  value={draft.name}
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  className="w-full border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Ej. Hoodie Oversize"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">Precio (COP)</label>
                <input
                  type="number"
                  value={draft.price}
                  onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })}
                  className="w-full border border-border bg-background px-3 py-2 text-sm"
                  min="0"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">Categoría</label>
                <select
                  value={draft.category}
                  onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                  className="w-full border border-border bg-background px-3 py-2 text-sm"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">Imagen</label>
                <input
                  value={draft.image}
                  onChange={(event) => setDraft({ ...draft, image: event.target.value })}
                  className="w-full border border-border bg-background px-3 py-2 text-sm"
                  placeholder="/product-hoodie.png"
                />
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-primary">
                  <ImagePlus className="h-4 w-4" />
                  {uploadingImage ? 'Subiendo...' : 'Subir imagen desde tu equipo'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">Descripción</label>
                <textarea
                  value={draft.description}
                  onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                  className="min-h-24 w-full border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Describe la prenda"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">Tallas (separadas por coma)</label>
                <input
                  value={sizesInput}
                  onChange={(event) => setSizesInput(event.target.value)}
                  className="w-full border border-border bg-background px-3 py-2 text-sm"
                  placeholder="S, M, L"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">Colores (separados por coma)</label>
                <input
                  value={colorsInput}
                  onChange={(event) => setColorsInput(event.target.value)}
                  className="w-full border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Negro, Naranja"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">Etiqueta destacada</label>
                <input
                  value={badgeInput}
                  onChange={(event) => setBadgeInput(event.target.value)}
                  className="w-full border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Nuevo, Top ventas, Edición limitada"
                />
              </div>

              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={featuredInput}
                  onChange={(event) => setFeaturedInput(event.target.checked)}
                />
                Marcar como producto destacado
              </label>

              <button type="submit" className="flex items-center gap-2 rounded bg-primary px-4 py-2 font-semibold uppercase tracking-wide text-primary-foreground">
                <Plus className="h-4 w-4" />
                {editingId ? 'Guardar cambios' : 'Agregar prenda'}
              </button>
            </div>
          </form>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-sans text-xl font-semibold uppercase">Carrusel</h2>
              <button
                onClick={async () => {
                  const nextSlides = [...slides, { image: '/carousel-1.png', eyebrow: 'Nuevo', title: 'Nueva pieza', subtitle: 'Añade una idea para el carrusel' }]
                  setSlides(nextSlides)
                  await writeSlides(nextSlides)
                }}
                className="flex items-center gap-2 rounded border border-border px-3 py-2 text-sm hover:border-primary hover:text-primary"
              >
                <Plus className="h-4 w-4" />
                Añadir slide
              </button>
            </div>

            <div className="space-y-3">
              {slides.map((slide, index) => (
                <div key={`${slide.title}-${index}`} className="rounded border border-border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold uppercase">Slide {index + 1}</span>
                    <button onClick={() => handleRemoveSlide(index)} className="text-sm text-red-500">Eliminar</button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-semibold">Imagen</label>
                      <input
                        value={slide.image}
                        onChange={(event) => updateSlideField(index, 'image', event.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm"
                      />
                      <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-primary">
                        <ImagePlus className="h-4 w-4" />
                        {uploadingCarouselImage ? 'Subiendo...' : 'Subir imagen'}
                        <input type="file" accept="image/*" onChange={(event) => handleCarouselImageUpload(event, index)} className="hidden" />
                      </label>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold">Eyebrow</label>
                      <input
                        value={slide.eyebrow}
                        onChange={(event) => updateSlideField(index, 'eyebrow', event.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold">Título</label>
                      <input
                        value={slide.title}
                        onChange={(event) => updateSlideField(index, 'title', event.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold">Subtítulo</label>
                      <input
                        value={slide.subtitle}
                        onChange={(event) => updateSlideField(index, 'subtitle', event.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded border border-border bg-card p-6">
            <h2 className="font-sans text-xl font-semibold uppercase">Métricas y pedidos</h2>
            <p className="mt-2 text-sm text-muted-foreground">Estas cifras se guardan en la base de datos y se ven igual desde cualquier dispositivo.</p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-semibold">Visitas</label>
                <input
                  type="number"
                  value={metrics.visits}
                  onChange={async (event) => {
                    const nextMetrics = { ...metrics, visits: Number(event.target.value) }
                    setMetrics(nextMetrics)
                    await writeMetrics(nextMetrics)
                  }}
                  className="w-full border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Pedidos</label>
                <input
                  type="number"
                  value={metrics.orders}
                  onChange={async (event) => {
                    const nextMetrics = { ...metrics, orders: Number(event.target.value) }
                    setMetrics(nextMetrics)
                    await writeMetrics(nextMetrics)
                  }}
                  className="w-full border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Conversiones (%)</label>
                <input
                  type="number"
                  value={metrics.conversions}
                  onChange={async (event) => {
                    const nextMetrics = { ...metrics, conversions: Number(event.target.value) }
                    setMetrics(nextMetrics)
                    await writeMetrics(nextMetrics)
                  }}
                  className="w-full border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded border border-border bg-card p-6">
          <h2 className="font-sans text-xl font-semibold uppercase">Contenido del sitio</h2>
          <p className="mt-2 text-sm text-muted-foreground">Cambia la información de Nosotros y Contacto desde aquí.</p>

          <form onSubmit={handleSaveSiteContent} className="mt-6 grid gap-4 lg:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold">Título de Nosotros</label>
              <input
                value={siteContent.aboutTitle}
                onChange={(event) => setSiteContent({ ...siteContent, aboutTitle: event.target.value })}
                className="w-full border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Ubicación</label>
              <input
                value={siteContent.contactLocation}
                onChange={(event) => setSiteContent({ ...siteContent, contactLocation: event.target.value })}
                className="w-full border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="mb-1 block text-sm font-semibold">Texto de Nosotros</label>
              <textarea
                value={siteContent.aboutText}
                onChange={(event) => setSiteContent({ ...siteContent, aboutText: event.target.value })}
                className="min-h-24 w-full border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Correo</label>
              <input
                value={siteContent.contactEmail}
                onChange={(event) => setSiteContent({ ...siteContent, contactEmail: event.target.value })}
                className="w-full border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">WhatsApp</label>
              <input
                value={siteContent.contactWhatsapp}
                onChange={(event) => setSiteContent({ ...siteContent, contactWhatsapp: event.target.value })}
                className="w-full border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="mb-1 block text-sm font-semibold">Mensaje de WhatsApp</label>
              <input
                value={siteContent.contactWhatsappMessage}
                onChange={(event) => setSiteContent({ ...siteContent, contactWhatsappMessage: event.target.value })}
                className="w-full border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="lg:col-span-2">
              <button type="submit" className="rounded bg-primary px-4 py-2 font-semibold uppercase tracking-wide text-primary-foreground">
                Guardar cambios
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}