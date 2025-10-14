"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Icon } from "@/components/ui/icon"

export function ContactFormSimple() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { success, error } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      success("Message envoyé avec succès!", {
        description: "Nous vous répondrons dans les plus brefs délais.",
        duration: 5000,
      })
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      error("Erreur lors de l'envoi", {
        description: "Une erreur est survenue. Veuillez réessayer.",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nom complet *
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Votre nom"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">
          Sujet *
        </label>
        <Input
          id="subject"
          name="subject"
          type="text"
          placeholder="Sujet de votre message"
          value={formData.subject}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message *
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Votre message..."
          value={formData.message}
          onChange={handleChange}
          disabled={isSubmitting}
          rows={6}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto"
      >
        {isSubmitting ? (
          <>
            <Icon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Icon name="Send" className="h-4 w-4 mr-2" />
            Envoyer le message
          </>
        )}
      </Button>
    </form>
  )
}
