"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icon } from "@/components/ui/icon"
import { useSupabase } from "@/components/supabase-provider"
import { useProjects, useMessages, useInvoices } from "@/hooks/use-supabase-data"

export default function ReportsPage() {
  const { user, loading: authLoading } = useSupabase()
  const isAdmin = user?.user_metadata?.role === 'admin'
  const { projects, loading: projectsLoading } = useProjects()
  const { messages, loading: messagesLoading } = useMessages()
  const { invoices, loading: invoicesLoading } = useInvoices()
  const [selectedReport, setSelectedReport] = useState("financial")
  const [dateRange, setDateRange] = useState("6months")
  const [customDateFrom, setCustomDateFrom] = useState("")
  const [customDateTo, setCustomDateTo] = useState("")
  const [reportData, setReportData] = useState({
    projects: [],
    messages: [],
    invoices: [],
  })
  const [isGenerating, setIsGenerating] = useState(false)

  // Charger les données
  useEffect(() => {
    if (authLoading || !user) return

    try {
      // Filtrer les données selon le rôle
      const projectsData = isAdmin ? projects : projects.filter(p => p.client_id === user.id)
      const messagesData = isAdmin ? messages : messages.filter(m => m.sender_id === user.id || m.recipient_id === user.id)
      const invoicesData = isAdmin ? invoices : invoices.filter(i => i.client_id === user.id)

      setReportData({
        projects: projectsData,
        messages: messagesData,
        invoices: invoicesData,
      })
    } catch (error) {
      console.error("Erreur lors du chargement des données de rapport:", error)
    }
  }, [user, isAdmin, authLoading, projects, messages, invoices])

  // Générer un rapport
  const generateReport = async () => {
    setIsGenerating(true)
    // Simuler la génération du rapport
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
    // Ici, vous pourriez télécharger le rapport ou l'afficher
    console.log("Rapport généré:", selectedReport)
  }

  // Calculer les statistiques financières
  const getFinancialStats = () => {
    const { invoices } = reportData
    const paidInvoices = invoices.filter(inv => inv.status === "paid")
    const pendingInvoices = invoices.filter(inv => inv.status === "sent" || inv.status === "overdue")
    
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0)
    const pendingRevenue = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0)
    const averageInvoice = paidInvoices.length > 0 ? totalRevenue / paidInvoices.length : 0

    return {
      totalRevenue,
      pendingRevenue,
      averageInvoice,
      totalInvoices: invoices.length,
      paidInvoices: paidInvoices.length,
      pendingInvoices: pendingInvoices.length,
    }
  }

  // Calculer les statistiques de projets
  const getProjectStats = () => {
    const { projects } = reportData
    const activeProjects = projects.filter(p => p.status === "active")
    const completedProjects = projects.filter(p => p.status === "completed")
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
    const averageBudget = projects.length > 0 ? totalBudget / projects.length : 0

    return {
      totalProjects: projects.length,
      activeProjects: activeProjects.length,
      completedProjects: completedProjects.length,
      totalBudget,
      averageBudget,
    }
  }

  // Calculer les statistiques de satisfaction
  const getSatisfactionStats = () => {
    const { feedbacks } = reportData
    const averageRating = feedbacks.length > 0 ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length : 0
    const publicFeedbacks = feedbacks.filter(f => f.public)
    const ratingDistribution = feedbacks.reduce((acc, f) => {
      acc[f.rating] = (acc[f.rating] || 0) + 1
      return acc
    }, {})

    return {
      totalFeedbacks: feedbacks.length,
      averageRating,
      publicFeedbacks: publicFeedbacks.length,
      ratingDistribution,
    }
  }

  const financialStats = getFinancialStats()
  const projectStats = getProjectStats()
  const satisfactionStats = getSatisfactionStats()

  if (authLoading || projectsLoading || messagesLoading || invoicesLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Icon name="Loader2" className="h-12 w-12 animate-spin text-primary mb-4" aria-hidden={true} />
        <p className="text-lg">Chargement des rapports...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Rapports</h1>
          <p className="text-muted-foreground mt-2">Consultez et générez des rapports détaillés</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateReport} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Icon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
                Génération...
              </>
            ) : (
              <>
                <Icon name="Download" className="h-4 w-4 mr-2" />
                Générer le rapport
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={selectedReport} onValueChange={setSelectedReport} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial">Financier</TabsTrigger>
          <TabsTrigger value="projects">Projets</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          <TabsTrigger value="custom">Personnalisé</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chiffre d'Affaires Total</CardTitle>
                <Icon name="DollarSign" className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{financialStats.totalRevenue.toLocaleString()} €</div>
                <p className="text-xs text-muted-foreground">
                  {financialStats.paidInvoices} factures payées
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Attente</CardTitle>
                <Icon name="Clock" className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{financialStats.pendingRevenue.toLocaleString()} €</div>
                <p className="text-xs text-muted-foreground">
                  {financialStats.pendingInvoices} factures en attente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Facture Moyenne</CardTitle>
                <Icon name="TrendingUp" className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{financialStats.averageInvoice.toLocaleString()} €</div>
                <p className="text-xs text-muted-foreground">
                  Montant moyen par facture
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Factures</CardTitle>
                <Icon name="FileText" className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{financialStats.totalInvoices}</div>
                <p className="text-xs text-muted-foreground">
                  Factures émises
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Détail des Factures</CardTitle>
              <CardDescription>Liste des factures par statut</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{invoice.projectTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.date).toLocaleDateString("fr-FR")} - 
                        Échéance: {new Date(invoice.dueDate).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold">{invoice.amount.toLocaleString()} €</p>
                      <Badge variant={
                        invoice.status === "paid" ? "default" :
                        invoice.status === "sent" ? "secondary" :
                        invoice.status === "overdue" ? "destructive" : "outline"
                      }>
                        {invoice.status === "paid" ? "Payée" :
                         invoice.status === "sent" ? "Envoyée" :
                         invoice.status === "overdue" ? "En retard" : "Brouillon"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projets</CardTitle>
                <Icon name="Briefcase" className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projectStats.totalProjects}</div>
                <p className="text-xs text-muted-foreground">
                  Projets au total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projets Actifs</CardTitle>
                <Icon name="Play" className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projectStats.activeProjects}</div>
                <p className="text-xs text-muted-foreground">
                  En cours de développement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projets Terminés</CardTitle>
                <Icon name="CheckCircle" className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projectStats.completedProjects}</div>
                <p className="text-xs text-muted-foreground">
                  Livrés avec succès
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget Total</CardTitle>
                <Icon name="DollarSign" className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projectStats.totalBudget.toLocaleString()} €</div>
                <p className="text-xs text-muted-foreground">
                  Valeur totale des projets
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Détail des Projets</CardTitle>
              <CardDescription>Liste des projets par statut</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(project.startDate).toLocaleDateString("fr-FR")} - 
                        {new Date(project.endDate).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold">{project.budget.toLocaleString()} €</p>
                      <Badge variant={
                        project.status === "completed" ? "default" :
                        project.status === "active" ? "secondary" :
                        project.status === "review" ? "outline" : "destructive"
                      }>
                        {project.status === "completed" ? "Terminé" :
                         project.status === "active" ? "Actif" :
                         project.status === "review" ? "En révision" :
                         project.status === "proposal" ? "Proposition" : "En attente"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
                <Icon name="Star" className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{satisfactionStats.averageRating.toFixed(1)}/5</div>
                <p className="text-xs text-muted-foreground">
                  Basé sur {satisfactionStats.totalFeedbacks} avis
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avis Publics</CardTitle>
                <Icon name="Globe" className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{satisfactionStats.publicFeedbacks}</div>
                <p className="text-xs text-muted-foreground">
                  Avis partagés publiquement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Avis</CardTitle>
                <Icon name="MessageSquare" className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{satisfactionStats.totalFeedbacks}</div>
                <p className="text-xs text-muted-foreground">
                  Tous les retours clients
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribution des Notes</CardTitle>
              <CardDescription>Répartition des évaluations par étoiles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(satisfactionStats.ratingDistribution).map(([rating, count]) => (
                  <div key={rating} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{rating} étoiles</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            className={`h-4 w-4 ${
                              i < parseInt(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{count} avis</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Derniers Avis</CardTitle>
              <CardDescription>Retours clients récents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.feedbacks.map((feedback) => (
                  <div key={feedback.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{feedback.projectTitle}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            className={`h-4 w-4 ${
                              i < feedback.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{feedback.comment}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {new Date(feedback.date).toLocaleDateString("fr-FR")}
                      </span>
                      <Badge variant={feedback.public ? "default" : "secondary"}>
                        {feedback.public ? "Public" : "Privé"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rapport Personnalisé</CardTitle>
              <CardDescription>Créez un rapport sur mesure selon vos besoins</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dateRange">Période</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1month">1 mois</SelectItem>
                      <SelectItem value="3months">3 mois</SelectItem>
                      <SelectItem value="6months">6 mois</SelectItem>
                      <SelectItem value="1year">1 an</SelectItem>
                      <SelectItem value="custom">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {dateRange === "custom" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="dateFrom">Date de début</Label>
                      <Input
                        id="dateFrom"
                        type="date"
                        value={customDateFrom}
                        onChange={(e) => setCustomDateFrom(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateTo">Date de fin</Label>
                      <Input
                        id="dateTo"
                        type="date"
                        value={customDateTo}
                        onChange={(e) => setCustomDateTo(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportDescription">Description du rapport</Label>
                <Textarea
                  id="reportDescription"
                  placeholder="Décrivez les éléments que vous souhaitez inclure dans ce rapport..."
                  className="min-h-[100px]"
                />
              </div>

              <Button onClick={generateReport} disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <Icon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
                    Génération du rapport personnalisé...
                  </>
                ) : (
                  <>
                    <Icon name="FileText" className="h-4 w-4 mr-2" />
                    Générer le rapport personnalisé
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

