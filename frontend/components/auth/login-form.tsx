"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Icon } from "@/components/ui/icon"
import { useSupabase } from "@/components/providers/supabase-provider"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast, success, error } = useToast()
  const { signIn } = useSupabase()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const altchaPayload = (document.querySelector('input[name="altcha"]') as HTMLInputElement)?.value
      if (!altchaPayload) {
        error("Vérification requise", {
          description: "Veuillez compléter le captcha pour continuer.",
        })
        setIsSubmitting(false)
        return
      }

      console.log("Tentative de connexion avec:", email)

      // Utiliser l'authentification Supabase réelle
      const { error: authError } = await signIn(email, password)

      if (authError) {
        console.error("Erreur d'authentification:", authError)
        error("Erreur de connexion", {
          description: authError.message || "Email ou mot de passe incorrect.",
          duration: 5000,
        })
      } else {
        console.log("Connexion réussie!")
        success("Connexion réussie!", {
          description: "Bienvenue dans votre espace personnel !",
          duration: 3000,
        })

        // Redirection vers le dashboard
        router.push('/dashboard')
      }

    } catch (err) {
      console.error("Erreur inattendue:", err)
      error("Erreur de connexion", {
        description: "Une erreur inattendue s'est produite.",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Connexion</h1>
        <p className="text-muted-foreground mt-2">
          Connectez-vous à votre compte
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary"
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mot de passe
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary"
            autoComplete="current-password"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <div className="my-4">
          <altcha-widget
            challengeurl="/api/altcha"
            hidefooter
            hidelogo
            floating
          ></altcha-widget>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Icon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
              Connexion en cours...
            </>
          ) : (
            <>
              <Icon name="LogIn" className="h-4 w-4 mr-2" />
              Se connecter
            </>
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
