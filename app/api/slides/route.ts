import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase.from('slides').select('*').order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const slides = (await request.json()) as { image: string; eyebrow: string; title: string; subtitle: string }[]

  const { error: deleteError } = await supabase.from('slides').delete().neq('id', -1)
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 })

  const rows = slides.map((slide, index) => ({ ...slide, sort_order: index }))
  const { error: insertError } = await supabase.from('slides').insert(rows)
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}