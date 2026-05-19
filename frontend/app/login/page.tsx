"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icon } from "@/components/ui/icon"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { useSupabase } from "@/components/providers/supabase-provider"
import Link from "next/link"

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams?.get("redirect") || "/dashboard"
  const { user, signIn, signUp, loading: authLoading } = useSupabase()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [authChecked, setAuthChecked] = useState(false)

  // Ajouter les types pour le handler des inputs
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => setCompany(e.target.value)

  // Modifier le useEffect de vérification d'authentification pour éviter les boucles infinies
  // Remplacer l'effet actuel par celui-ci:

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user && !authChecked) {
      console.log("Utilisateur déjà connecté:", user.email)
      console.log("Redirection vers:", redirectPath)
      router.push(redirectPath)
      setAuthChecked(true)
    }
  }, [user, authChecked, redirectPath, router])

  // Gestion de la connexion avec Supabase
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await signIn(email, password)
      if (error) {
        console.error("Erreur de connexion:", (error as any).message)
        setError("Email ou mot de passe incorrect")
      } else {
        console.log("Connexion réussie")
        router.push(redirectPath)
      }
    } catch (err) {
      console.error("Erreur d'authentification:", err)
      setError("Une erreur est survenue lors de la connexion")
    } finally {
      setLoading(false)
    }
  }

  // Gestion de l'inscription avec Supabase
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await signUp(email, password, {
        name,
        company,
        role: 'client'
      })
      if (error) {
        console.error("Erreur d'inscription:", (error as any).message)
        setError("Erreur lors de l'inscription: " + (error as any).message)
      } else {
        console.log("Inscription réussie")
        setError("")
        // Afficher un message de succès
        alert("Inscription réussie ! Vérifiez votre email pour confirmer votre compte.")
        setActiveTab("login")
      }
    } catch (err) {
      console.error("Erreur d'inscription:", err)
      setError("Une erreur est survenue lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  // Afficher un message d'erreur si l'utilisateur a été redirigé vers la page de connexion
  const unauthorizedMessage = searchParams?.get("unauthorized") === "true"

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-16rem)] py-12">
      <div className="w-full max-w-md">
        {unauthorizedMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Vous devez être connecté pour accéder à cette page. Veuillez vous connecter pour continuer.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="flex items-center gap-1.5">
              <Icon name="LogIn" size="sm" aria-hidden={true} /> Connexion
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center gap-1.5">
              <Icon name="UserPlus" size="sm" aria-hidden={true} /> Inscription
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm />
          </TabsContent>

          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>

        </Tabs>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary hover:underline">
            <Icon name="ArrowLeft" className="mr-1 h-3 w-3 inline" aria-hidden={true} />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container flex min-h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">Chargement…</p>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}
