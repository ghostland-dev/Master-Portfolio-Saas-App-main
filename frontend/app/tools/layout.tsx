"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Icon } from "@/components/ui/icon"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, refreshAuth } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const authCheckedRef = useRef(false)

  useEffect(() => {
    setMounted(true)

    if (!authCheckedRef.current) {
      authCheckedRef.current = true
      const isLoggedIn = refreshAuth()

      if (!isLoggedIn) {
        console.log("Accès aux outils non autorisé, redirection vers login")
        router.push(`/login?redirect=${encodeURIComponent(pathname || "/tools")}&unauthorized=true`)
      }
    }
  }, [pathname, refreshAuth, router])

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <div className="flex items-center gap-2">
          <Icon name="Loader2" className="h-6 w-6 animate-spin" aria-hidden={true} />
          <span className="text-lg">Vérification de l'accès...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container flex min-h-[50vh] flex-col items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <Icon name="ShieldAlert" className="h-12 w-12 text-red-500" aria-hidden={true} />
          <h2 className="text-2xl font-bold">Accès réservé</h2>
          <p className="text-muted-foreground">
            Vous devez être connecté en tant que client pour accéder à nos outils et ressources exclusives.
          </p>
          <Button asChild className="mt-4">
            <Link href={`/login?redirect=${encodeURIComponent(pathname || "/tools")}&unauthorized=true`}>
              <Icon name="LogIn" size="sm" className="mr-2" aria-hidden={true} />
              Se connecter
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
