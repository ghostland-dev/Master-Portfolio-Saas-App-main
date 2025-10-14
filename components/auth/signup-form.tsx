"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Icon } from "@/components/ui/icon"
import { useSupabase } from "@/components/supabase-provider"
import Link from "next/link"

export function SignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast, success, error } = useToast()
  const { signUp } = useSupabase()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      console.log("Tentative d'inscription avec:", email)
      
      // Utiliser l'authentification Supabase réelle
      const { error: authError } = await signUp(email, password, {
        name,
        company,
        role: 'client'
      })
      
      if (authError) {
        console.error("Erreur d'inscription:", authError)
        error("Erreur d'inscription", {
          description: authError.message || "Une erreur est survenue lors de l'inscription.",
          duration: 5000,
        })
      } else {
        console.log("Inscription réussie!")
        success("Inscription réussie!", {
          description: "Vérifiez votre email pour confirmer votre compte.",
          duration: 5000,
        })
        
        // Redirection vers la page de connexion
        router.push('/login')
      }
      
    } catch (err) {
      console.error("Erreur inattendue:", err)
      error("Erreur d'inscription", {
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
        <h1 className="text-3xl font-bold">Inscription</h1>
        <p className="text-muted-foreground mt-2">
          Créez votre compte
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nom complet
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Votre nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary"
            autoComplete="name"
            required
          />
        </div>

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
          <label htmlFor="company" className="text-sm font-medium">
            Entreprise (optionnel)
          </label>
          <Input
            id="company"
            name="company"
            type="text"
            placeholder="Nom de votre entreprise"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={isSubmitting}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary"
            autoComplete="organization"
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
            autoComplete="new-password"
            required
            minLength={8}
          />
          <p className="text-xs text-muted-foreground">
            Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Icon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
              Inscription en cours...
            </>
          ) : (
            <>
              <Icon name="UserPlus" className="h-4 w-4 mr-2" />
              Créer un compte
            </>
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}