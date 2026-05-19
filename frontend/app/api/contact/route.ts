import { getSupabaseUrl } from "@/lib/supabase"
import { verifyAltcha } from "@/lib/altcha"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message, altcha } = body as {
      name?: string
      email?: string
      subject?: string
      message?: string
      altcha?: string
    }

    // Verify ALTCHA
    if (!altcha || !(await verifyAltcha(altcha))) {
      return Response.json({ message: "Vérification captcha échouée" }, { status: 403 })
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return Response.json({ message: "Champs requis manquants" }, { status: 400 })
    }

    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!key) {
      return Response.json({ message: "Configuration serveur incomplète" }, { status: 500 })
    }

    const base = getSupabaseUrl().replace(/\/$/, "")
    const res = await fetch(`${base}/rest/v1/contact_messages`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        subject: subject?.trim() || null,
        message: message.trim(),
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error("Erreur API contact (PostgREST):", res.status, errText)
      return Response.json({ message: "Erreur serveur", error: errText || res.statusText }, { status: 500 })
    }

    const data = await res.json().catch(() => null)
    const row = Array.isArray(data) ? data[0] : data

    return Response.json({ message: "Message envoyé avec succès", data: row }, { status: 201 })
  } catch (error) {
    console.error("Erreur API contact:", error)
    return Response.json(
      { message: "Erreur serveur", error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 },
    )
  }
}
