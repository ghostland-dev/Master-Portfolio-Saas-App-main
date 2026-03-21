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
import { users } from "@/lib/auth-utils"

export default function NewProjectPage() {
  const { user, isAdmin, isLoading } = useAuth()
  const { toast } = useToast()
  const [creating, setCreating] = useState(false)
  const [project, setProject] = useState({
    title: "",
    description: "",
    clientId: "",
    type: "web" as "web" | "mobile" | "devops" | "data" | "other",
    budget: "",
    startDate: "",
    endDate: "",
    priority: "medium" as "low" | "medium" | "high",
    status: "proposal" as "proposal" | "active" | "review" | "completed" | "on-hold",
  })

  // Obtenir la liste des clients (pour les admins)
  const getClients = () => {
    return users.filter(u => u.role === "client")
  }

  // Créer le projet
  const handleCreateProject = async () => {
    if (!project.title || !project.description || (!isAdmin && !project.clientId)) {
      toast("error", "Veuillez remplir tous les champs obligatoires.")
      return
    }

    setCreating(true)
    try {
      // Simuler la création du projet
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast("success", "Le projet a été créé avec succès.", {
        title: "Projet créé"
      })

      // Réinitialiser le formulaire
      setProject({
        title: "",
        description: "",
        clientId: "",
        type: "web",
        budget: "",
        startDate: "",
        endDate: "",
        priority: "medium",
        status: "proposal",
      })
    } catch (error) {
      toast("error", "Une erreur est survenue lors de la création du projet.")
    } finally {
      setCreating(false)
    }
  }

  // Calculer la durée estimée
  const calculateDuration = () => {
    if (project.startDate && project.endDate) {
      const start = new Date(project.startDate)
      const end = new Date(project.endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    }
    return 0
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
          <h1 className="text-3xl md:text-4xl font-bold">Nouveau Projet</h1>
          <p className="text-muted-foreground mt-2">Créez un nouveau projet et commencez à collaborer</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations du projet</CardTitle>
            <CardDescription>Définissez les détails de base de votre nouveau projet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du projet *</Label>
                <Input
                  id="title"
                  value={project.title}
                  onChange={(e) => setProject(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nom du projet"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type de projet</Label>
                <Select
                  value={project.type}
                  onValueChange={(value: "web" | "mobile" | "devops" | "data" | "other") => setProject(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Application Web</SelectItem>
                    <SelectItem value="mobile">Application Mobile</SelectItem>
                    <SelectItem value="devops">DevOps & Infrastructure</SelectItem>
                    <SelectItem value="data">Data & Analytics</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={project.description}
                onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez les objectifs et les fonctionnalités du projet..."
                className="min-h-[120px]"
              />
            </div>

            {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select
                  value={project.clientId}
                  onValueChange={(value) => setProject(prev => ({ ...prev, clientId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {getClients().map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        <div className="flex items-center space-x-2">
                          <span>{client.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {client.company}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (€)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={project.budget}
                  onChange={(e) => setProject(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select
                  value={project.priority}
                  onValueChange={(value: "low" | "medium" | "high") => setProject(prev => ({ ...prev, priority: value }))}
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
              <div className="space-y-2">
                <Label htmlFor="status">Statut initial</Label>
                <Select
                  value={project.status}
                  onValueChange={(value: "proposal" | "active" | "review" | "completed" | "on-hold") => setProject(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proposal">Proposition</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="review">En révision</SelectItem>
                    <SelectItem value="on-hold">En attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={project.startDate}
                  onChange={(e) => setProject(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin prévue</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={project.endDate}
                  onChange={(e) => setProject(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            {calculateDuration() > 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Durée estimée : {calculateDuration()} jours</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Résumé du projet */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Résumé du projet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Informations générales</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Titre :</strong> {project.title || "Non défini"}</p>
                    <p><strong>Type :</strong> {
                      project.type === "web" ? "Application Web" :
                      project.type === "mobile" ? "Application Mobile" :
                      project.type === "devops" ? "DevOps & Infrastructure" :
                      project.type === "data" ? "Data & Analytics" : "Autre"
                    }</p>
                    <p><strong>Priorité :</strong> {
                      project.priority === "low" ? "Faible" :
                      project.priority === "medium" ? "Moyenne" : "Élevée"
                    }</p>
                    <p><strong>Statut :</strong> {
                      project.status === "proposal" ? "Proposition" :
                      project.status === "active" ? "Actif" :
                      project.status === "review" ? "En révision" :
                      project.status === "on-hold" ? "En attente" : "Terminé"
                    }</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Détails financiers</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Budget :</strong> {project.budget ? `${project.budget} €` : "Non défini"}</p>
                    <p><strong>Début :</strong> {project.startDate ? new Date(project.startDate).toLocaleDateString("fr-FR") : "Non défini"}</p>
                    <p><strong>Fin :</strong> {project.endDate ? new Date(project.endDate).toLocaleDateString("fr-FR") : "Non défini"}</p>
                    {calculateDuration() > 0 && (
                      <p><strong>Durée :</strong> {calculateDuration()} jours</p>
                    )}
                  </div>
                </div>
              </div>
              {project.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            * Champs obligatoires
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setProject({
              title: "",
              description: "",
              clientId: "",
              type: "web",
              budget: "",
              startDate: "",
              endDate: "",
              priority: "medium",
              status: "proposal",
            })}>
              <Icon name="X" className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleCreateProject} disabled={creating}>
              {creating ? (
                <>
                  <Icon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
                  Création...
                </>
              ) : (
                <>
                  <Icon name="Plus" className="h-4 w-4 mr-2" />
                  Créer le projet
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
