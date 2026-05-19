"use client"

import { useState } from "react"
import { Form, FormField, FormGroup, FormActions } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { contactSchema } from "@/lib/validation/validation-schemas"
import { Icon } from "@/components/ui/icon"

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

const initialValues: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast, success, error } = useToast()

  const handleSubmit = async (values: ContactFormData, { resetForm }: any) => {
    setIsSubmitting(true)

    try {
      // Get ALTCHA payload from the widget
      const altchaPayload = (document.querySelector('input[name="altcha"]') as HTMLInputElement)?.value

      if (!altchaPayload) {
        error("Vérification requise", {
          description: "Veuillez compléter le captcha pour continuer.",
        })
        return
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, altcha: altchaPayload }),
      })

      if (!res.ok) {
        throw new Error("Erreur lors de l'envoi")
      }

      success("Message envoyé avec succès!", {
        description: "Nous vous répondrons dans les plus brefs délais.",
        duration: 5000,
      })

      resetForm()
      // Reset ALTCHA widget if possible
    } catch (err) {
      error("Erreur lors de l'envoi", {
        description: "Une erreur est survenue. Veuillez réessayer.",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form
      initialValues={initialValues}
      validationSchema={contactSchema}
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto"
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting: formikSubmitting }) => (
        <FormGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="name"
              label="Nom complet"
              error={errors.name}
              touched={touched.name}
              required
            >
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Votre nom"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </FormField>

            <FormField
              name="email"
              label="Email"
              error={errors.email}
              touched={touched.email}
              required
            >
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </FormField>
          </div>

          <FormField
            name="subject"
            label="Sujet"
            error={errors.subject}
            touched={touched.subject}
            required
          >
            <Input
              id="subject"
              name="subject"
              type="text"
              placeholder="Sujet de votre message"
              value={values.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary"
            />
          </FormField>

          <FormField
            name="message"
            label="Message"
            error={errors.message}
            touched={touched.message}
            required
          >
            <Textarea
              id="message"
              name="message"
              placeholder="Votre message..."
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              rows={6}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary resize-none"
            />
          </FormField>

          <div className="my-6">
            <altcha-widget
              challengeurl="/api/altcha"
              floating
              hidefooter
              hidelogo
            ></altcha-widget>
          </div>

          <FormActions>
            <Button
              type="submit"
              disabled={isSubmitting || formikSubmitting}
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
          </FormActions>
        </FormGroup>
      )}
    </Form>
  )
}
