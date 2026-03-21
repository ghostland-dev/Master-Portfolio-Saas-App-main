"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"

interface CheckoutButtonProps {
  priceId: string
  userId: string
  email: string
  label: string
}

export function CheckoutButton({ priceId, userId, email, label }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId, userId, email }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Erreur lors de l'initialisation du paiement")
      }
    } catch (err) {
      console.error(err)
      alert("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleCheckout} 
      disabled={loading} 
      className="w-full flex items-center justify-center gap-2"
    >
      {loading ? (
        <Icon name="Loader2" className="animate-spin" />
      ) : (
        <Icon name="CreditCard" />
      ) }
      {label}
    </Button>
  )
}
