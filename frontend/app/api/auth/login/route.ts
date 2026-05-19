export const dynamic = "force-dynamic"

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.session) {
      return NextResponse.json(
        { error: error?.message || 'Identifiants invalides' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ user: data.user, session: data.session })

    response.cookies.set('sb-access-token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.session.expires_in,
    })

    return response
  } catch (error) {
    console.error('Erreur API login:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
