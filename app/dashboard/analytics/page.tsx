"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Icon } from "@/components/ui/icon"
import { useSupabase } from "@/components/supabase-provider"
import { useProjects, useMessages, useInvoices } from "@/hooks/use-supabase-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useSupabase()
  const isAdmin = user?.user_metadata?.role === 'admin'
  const { projects, loading: projectsLoading } = useProjects()
  const { messages, loading: messagesLoading } = useMessages()
  const { invoices, loading: invoicesLoading } = useInvoices()
  
  const [timeRange, setTimeRange] = useState("6months")
  const [analyticsData, setAnalyticsData] = useState<any>({
    projects: [],
    messages: [],
    invoices: [],
    feedbacks: [],
  })

  // Charger les données
  useEffect(() => {
    if (authLoading || !user) return

    try {
      // Filtrer les données selon le rôle
      const projectsData = isAdmin ? projects : projects.filter((p: any) => p.client_id === user.id)
      const messagesData = isAdmin ? messages : messages.filter((m: any) => m.sender_id === user.id || m.recipient_id === user.id)
      const invoicesData = isAdmin ? invoices : invoices.filter((i: any) => i.client_id === user.id)

      setAnalyticsData({
        projects: projectsData,
        messages: messagesData,
        invoices: invoicesData,
      })
    } catch (error) {
      console.error("Erreur lors du chargement des données analytiques:", error)
    }
  }, [user, isAdmin, authLoading, projects, messages, invoices])

  // Calculer les métriques principales
  const calculateMetrics = () => {
    const { projects, messages, invoices } = analyticsData

    const activeProjects = projects.filter((p: any) => p.status === "active").length
    const completedProjects = projects.filter((p: any) => p.status === "completed").length
    const totalRevenue = invoices.filter((i: any) => i.status === "paid").reduce((sum: number, inv: any) => sum + inv.amount, 0)
    const pendingRevenue = invoices
      .filter((i: any) => i.status === "sent" || i.status === "overdue")
      .reduce((sum: number, inv: any) => sum + inv.amount, 0)
    const unreadMessages = messages.filter((m: any) => !m.read).length

    return {
      activeProjects,
      completedProjects,
      totalRevenue,
      pendingRevenue,
      unreadMessages,
    }
  }

  // Données pour les graphiques
  const getProjectStatusData = () => {
    const { projects } = analyticsData
    const statusCounts = projects.reduce((acc: any, project: any) => {
      acc[project.status] = (acc[project.status] || 0) + 1
      return acc
    }, {})

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: status === "proposal" ? "Proposition" : 
              status === "active" ? "Actif" :
              status === "review" ? "En révision" :
              status === "completed" ? "Terminé" : "En attente",
      count,
    }))
  }

  const getRevenueData = () => {
    const { invoices } = analyticsData
    const monthlyRevenue = invoices
      .filter((inv: any) => inv.status === "paid")
      .reduce((acc: any, invoice: any) => {
        const month = new Date(invoice.date).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
        acc[month] = (acc[month] || 0) + invoice.amount
        return acc
      }, {})

    return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue,
    }))
  }

  const getProjectTypeData = () => {
    const { projects } = analyticsData
    const typeCounts = projects.reduce((acc: any, project: any) => {
      acc[project.type] = (acc[project.type] || 0) + 1
      return acc
    }, {})

    return Object.entries(typeCounts).map(([type, count]) => ({
      name: type === "web" ? "Web" : 
            type === "mobile" ? "Mobile" :
            type === "devops" ? "DevOps" : "Data",
      value: count,
    }))
  }

  const getClientSatisfactionData = () => {
    const { feedbacks } = analyticsData
    const ratingCounts = feedbacks.reduce((acc: any, feedback: any) => {
      acc[feedback.rating] = (acc[feedback.rating] || 0) + 1
      return acc
    }, {})

    return Object.entries(ratingCounts).map(([rating, count]) => ({
      rating: `${rating} étoiles`,
      count,
    }))
  }

  const metrics = calculateMetrics()
  const projectStatusData = getProjectStatusData()
  const revenueData = getRevenueData()
  const projectTypeData = getProjectTypeData()
  const satisfactionData = getClientSatisfactionData()

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  if (authLoading || projectsLoading || messagesLoading || invoicesLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Icon name="Loader2" className="h-12 w-12 animate-spin text-primary mb-4" aria-hidden={true} />
        <p className="text-lg">Chargement des analytiques...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Analytiques</h1>
          <p className="text-muted-foreground mt-2">Suivez les performances de votre entreprise</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 mois</SelectItem>
              <SelectItem value="3months">3 mois</SelectItem>
              <SelectItem value="6months">6 mois</SelectItem>
              <SelectItem value="1year">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Icon name="Download" size="sm" className="mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets Actifs</CardTitle>
            <Icon name="Briefcase" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics.completedProjects} terminés ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
            <Icon name="DollarSign" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRevenue.toLocaleString()} €</div>
            <p className="text-xs text-muted-foreground">
              {metrics.pendingRevenue.toLocaleString()} € en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Non Lus</CardTitle>
            <Icon name="Mail" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">
              Messages en attente de lecture
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets Terminés</CardTitle>
            <Icon name="CheckCircle" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedProjects}</div>
            <p className="text-xs text-muted-foreground">
              Projets livrés avec succès
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="projects">Projets</TabsTrigger>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Statut des Projets</CardTitle>
                <CardDescription>Répartition des projets par statut</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projectStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Types de Projets</CardTitle>
                <CardDescription>Distribution par type de projet</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectTypeData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progression des Projets</CardTitle>
              <CardDescription>Suivi de l'avancement des projets actifs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.projects
                  .filter((p: any) => p.status === "active")
                  .map((project: any) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{project.title}</span>
                        <Badge variant={project.progress === 100 ? "default" : "secondary"}>
                          {project.progress}%
                        </Badge>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Revenus</CardTitle>
              <CardDescription>Chiffre d'affaires par mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} €`, "Revenus"]} />
                  <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Client</CardTitle>
                <CardDescription>Distribution des notes de satisfaction</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={satisfactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Derniers Avis</CardTitle>
                <CardDescription>Retours clients récents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.feedbacks.slice(0, 3).map((feedback: any) => (
                    <div key={feedback.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm">{feedback.projectTitle}</span>
                        <div className="flex">
                          {[...Array(5)].map((_: any, i: number) => (
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
                      <p className="text-sm text-muted-foreground line-clamp-2">{feedback.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

