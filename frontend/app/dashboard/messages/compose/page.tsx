"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { users, getClientProjects } from "@/lib/auth-utils"

export default function ComposeMessagePage() {
  const { user, isAdmin, isLoading } = useAuth()
  const { toast } = useToast()
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState({
    recipient: "",
    subject: "",
    content: "",
    priority: "medium" as "low" | "medium" | "high",
    projectId: "",
  })

  // Obtenir la liste des destinataires
  const getRecipients = () => {
    if (isAdmin) {
      return users.filter(u => u.role === "client")
    }
    return [users.find(u => u.role === "admin")].filter(Boolean)
  }

  // Obtenir les projets accessibles
  const getAccessibleProjects = () => {
    if (isAdmin) return []
    return getClientProjects(user?.id || "")
  }

  // Envoyer le message
  const handleSendMessage = async () => {
    if (!message.recipient || !message.subject || !message.content) {
      toast("error", "Veuillez remplir tous les champs obligatoires.", {
        title: "Erreur",
      })
      return
    }

    setSending(true)
    try {
      // Simuler l'envoi du message
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast("success", "Votre message a été envoyé avec succès.", {
        title: "Message envoyé",
      })

      // Réinitialiser le formulaire
      setMessage({
        recipient: "",
        subject: "",
        content: "",
        priority: "medium",
        projectId: "",
      })
    } catch (error) {
      toast("error", "Une erreur est survenue lors de l'envoi du message.", {
        title: "Erreur",
      })
    } finally {
      setSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Icon name="Loader2" className="h-12 w-12 animate-spin text-primary mb-4" aria-hidden={true} />
        <p className="text-lg">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Nouveau Message</h1>
          <p className="text-muted-foreground mt-2">
            {isAdmin ? "Envoyez un message à un client" : "Envoyez un message à votre développeur"}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Composer un message</CardTitle>
            <CardDescription>
              Rédigez et envoyez un message à {isAdmin ? "un client" : "votre développeur"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="recipient">Destinataire *</Label>
              <Select
                value={message.recipient}
                onValueChange={(value: string) => setMessage((prev: any) => ({ ...prev, recipient: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un destinataire" />
                </SelectTrigger>
                <SelectContent>
                  {getRecipients().map((recipient: any) => (
                    <SelectItem key={recipient.id} value={recipient.id}>
                      <div className="flex items-center space-x-2">
                        <span>{recipient.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {recipient.company || recipient.role}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!isAdmin && getAccessibleProjects().length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="project">Projet (optionnel)</Label>
                <Select
                  value={message.projectId}
                  onValueChange={(value: string) => setMessage((prev: any) => ({ ...prev, projectId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucun projet spécifique</SelectItem>
                    {getAccessibleProjects().map((project: any) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Sujet *</Label>
                <Input
                  id="subject"
                  value={message.subject}
                  onChange={(e: any) => setMessage((prev: any) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Sujet du message"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select
                  value={message.priority}
                  onValueChange={(value: "low" | "medium" | "high") => setMessage((prev: any) => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center space-x-2">
                        <Icon name="Circle" className="h-3 w-3 text-green-500" />
                        <span>Faible</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center space-x-2">
                        <Icon name="Circle" className="h-3 w-3 text-yellow-500" />
                        <span>Moyenne</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center space-x-2">
                        <Icon name="Circle" className="h-3 w-3 text-red-500" />
                        <span>Élevée</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Message *</Label>
              <Textarea
                id="content"
                value={message.content}
                onChange={(e: any) => setMessage((prev: any) => ({ ...prev, content: e.target.value }))}
                placeholder="Rédigez votre message..."
                className="min-h-[200px]"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                * Champs obligatoires
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setMessage({
                  recipient: "",
                  subject: "",
                  content: "",
                  priority: "medium",
                  projectId: "",
                })}>
                  <Icon name="X" className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button onClick={handleSendMessage} disabled={sending}>
                  {sending ? (
                    <>
                      <Icon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" className="h-4 w-4 mr-2" />
                      Envoyer
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conseils pour rédiger un bon message */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conseils pour un message efficace</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start space-x-2">
                <Icon name="CheckCircle" className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>Soyez précis et concis dans votre sujet</p>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="CheckCircle" className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>Décrivez clairement votre demande ou votre question</p>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="CheckCircle" className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>Incluez toutes les informations pertinentes</p>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="CheckCircle" className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>Utilisez la priorité appropriée pour votre message</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
