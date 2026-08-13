'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingBag, Search, Trash2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/products'

const links = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Colección', href: '#coleccion' },
  { label: 'Novedades', href: '#novedades' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
]

const adminLink = { label: 'Admin', href: '/admin' }

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState<Array<{ id: string; name: string; price: number }>>([])

  useEffect(() => {
    const readCart = () => {
      if (typeof window === 'undefined') return
      try {
        const stored = JSON.parse(window.localStorage.getItem('ruina-cart') ?? '[]') as Array<{ id: string; name: string; price: number }>
        setCart(stored)
      } catch {
        setCart([])
      }
    }

    readCart()
    window.addEventListener('ruina-cart-updated', readCart)
    return () => window.removeEventListener('ruina-cart-updated', readCart)
  }, [])

  const removeItem = (id: string) => {
    if (typeof window === 'undefined') return
    const nextCart = cart.filter((item) => item.id !== id)
    window.localStorage.setItem('ruina-cart', JSON.stringify(nextCart))
    setCart(nextCart)
    window.dispatchEvent(new Event('ruina-cart-updated'))
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <a href="#inicio" className="flex items-center gap-2 sm:gap-3" aria-label="RUINA inicio">
          <img src="/icono.png" alt="Logo FENIX" className="h-12 w-12 object-contain sm:h-14 sm:w-14" />
          <span className="font-sans text-base font-bold uppercase tracking-[0.25em] text-foreground sm:text-xl">
            FENIX
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href={adminLink.href}
              className="font-sans text-sm font-semibold uppercase tracking-wide text-primary transition-colors hover:text-primary/80"
            >
              {adminLink.label}
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <button
            className="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:text-primary"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCartOpen((value) => !value)}
            className="relative flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:text-primary"
            aria-label="Carrito"
          >
            <ShoppingBag className="h-5 w-5" />
            {cart.length > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {cart.length}
              </span>
            ) : null}
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center text-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <div className={cn('relative border-t border-border bg-background', cartOpen ? 'block' : 'hidden')}>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-sm font-semibold uppercase tracking-wide">Carrito</h2>
            <button onClick={() => setCartOpen(false)} className="text-sm text-muted-foreground">Cerrar</button>
          </div>
          {cart.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded border border-border px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <a href="https://wa.me/573015395359?text=Hola%20FENIX%20quiero%20hacer%20mi%20pedido" target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center justify-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary-foreground">
                Finalizar pedido <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden border-t border-border bg-background transition-all duration-300 md:hidden',
          open ? 'max-h-80' : 'max-h-0 border-t-0',
        )}
      >
        <ul className="flex flex-col px-4 py-2">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-sans text-sm font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href={adminLink.href}
              onClick={() => setOpen(false)}
              className="block py-3 font-sans text-sm font-semibold uppercase tracking-wide text-primary"
            >
              {adminLink.label}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}
