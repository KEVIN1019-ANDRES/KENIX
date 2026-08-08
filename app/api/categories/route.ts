import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('categories')
    .select('name')
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data.map((row) => row.name))
}

export async function POST(request: Request) {
  const { names } = (await request.json()) as { names: string[] }

  const { error: deleteError } = await supabase.from('categories').delete().neq('id', -1)
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 })

  const rows = names.map((name, index) => ({ name, sort_order: index }))
  const { error: insertError } = await supabase.from('categories').insert(rows)
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}