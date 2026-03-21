"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Download, FileText, Send, Calculator, InfoIcon, Save, Loader2, TrendingUp, BarChart3, Clock, DollarSign, Users, Zap } from "lucide-react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { generatePDF, generateStructuredPDF } from "@/lib/utils/pdf-utils"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Types pour le simulateur
type ProjectType = "web" | "mobile" | "desktop" | "ecommerce" | "crm" | "custom"
type ProjectComplexity = "simple" | "medium" | "complex" | "enterprise"
type DeliverySpeed = "normal" | "fast" | "urgent"
type MaintenanceLevel = "none" | "basic" | "standard" | "premium"
type Region = "europe" | "north-america" | "asia" | "other"
type PricingModel = "fixed" | "hourly" | "value-based"

interface Feature {
  id: string
  label: string
  cost: number
  complexity: "low" | "medium" | "high"
  description?: string
}

interface SavedConfiguration {
  id: string
  name: string
  timestamp: Date
  data: any
}

interface BudgetEstimate {
  development: number
  design: number
  projectManagement: number
  testing: number
  deployment: number
  maintenance: number
  total: number
  timeframe: {
    min: number
    max: number
  }
}

export default function BudgetSimulatorPage() {
  const { toast } = useToast()
  const [projectType, setProjectType] = useState<ProjectType>("web")
  const [projectComplexity, setProjectComplexity] = useState<ProjectComplexity>("medium")
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>("normal")
  const [maintenanceLevel, setMaintenanceLevel] = useState<MaintenanceLevel>("basic")
  const [features, setFeatures] = useState<string[]>([])
  const [customFeatures, setCustomFeatures] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [estimate, setEstimate] = useState<BudgetEstimate | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [includeDesign, setIncludeDesign] = useState(true)
  const [includeHosting, setIncludeHosting] = useState(true)
  const [teamSize, setTeamSize] = useState([2])
  const [projectName, setProjectName] = useState("")
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [region, setRegion] = useState<Region>("europe")
  const [pricingModel, setPricingModel] = useState<PricingModel>("fixed")
  const [showRealTimePreview, setShowRealTimePreview] = useState(true)
  const [savedConfigurations, setSavedConfigurations] = useState<SavedConfiguration[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [configurationName, setConfigurationName] = useState("")
  const [showComparison, setShowComparison] = useState(false)
  const [comparisonConfig, setComparisonConfig] = useState<any>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Options de fonctionnalités par type de projet avec coûts individuels
  const featureOptions = {
    web: [
      { id: "responsive", label: "Design Responsive", cost: 800, complexity: "low", description: "Adaptation mobile et tablette" },
      { id: "cms", label: "Système de Gestion de Contenu (CMS)", cost: 2000, complexity: "medium", description: "Interface d'administration complète" },
      { id: "multilingual", label: "Support Multilingue", cost: 1500, complexity: "medium", description: "Traduction et gestion multi-langues" },
      { id: "seo", label: "Optimisation SEO", cost: 1200, complexity: "medium", description: "Optimisation pour les moteurs de recherche" },
      { id: "analytics", label: "Intégration Analytics", cost: 600, complexity: "low", description: "Google Analytics et tracking" },
      { id: "newsletter", label: "Système de Newsletter", cost: 1000, complexity: "medium", description: "Gestion des abonnements et envois" },
      { id: "blog", label: "Blog", cost: 800, complexity: "low", description: "Système de blog avec commentaires" },
      { id: "contact", label: "Formulaire de Contact", cost: 400, complexity: "low", description: "Formulaires de contact avancés" },
    ],
    mobile: [
      { id: "push", label: "Notifications Push", cost: 1200, complexity: "medium", description: "Notifications push iOS et Android" },
      { id: "offline", label: "Mode Hors-ligne", cost: 2000, complexity: "high", description: "Fonctionnement sans connexion internet" },
      { id: "geolocation", label: "Géolocalisation", cost: 1000, complexity: "medium", description: "Services de localisation et cartes" },
      { id: "camera", label: "Intégration Caméra", cost: 1500, complexity: "medium", description: "Photo, vidéo et scan de codes" },
      { id: "biometric", label: "Authentification Biométrique", cost: 1800, complexity: "high", description: "Touch ID, Face ID, empreintes" },
      { id: "sync", label: "Synchronisation Multi-appareils", cost: 2500, complexity: "high", description: "Sync entre tous les appareils" },
      { id: "inapp", label: "Achats In-App", cost: 2000, complexity: "high", description: "Boutique intégrée et paiements" },
      { id: "social", label: "Intégration Réseaux Sociaux", cost: 1200, complexity: "medium", description: "Login et partage social" },
    ],
    desktop: [
      { id: "offline", label: "Fonctionnement Hors-ligne", cost: 1500, complexity: "medium", description: "Mode déconnecté complet" },
      { id: "updates", label: "Mises à Jour Automatiques", cost: 800, complexity: "low", description: "Système de mise à jour auto" },
      { id: "sync", label: "Synchronisation Cloud", cost: 1200, complexity: "medium", description: "Sync avec services cloud" },
      { id: "export", label: "Export de Données", cost: 600, complexity: "low", description: "Export multi-formats" },
      { id: "plugins", label: "Système de Plugins", cost: 3000, complexity: "high", description: "Architecture modulaire" },
      { id: "shortcuts", label: "Raccourcis Clavier", cost: 400, complexity: "low", description: "Raccourcis personnalisables" },
      { id: "darkmode", label: "Mode Sombre", cost: 500, complexity: "low", description: "Thème sombre/clair" },
      { id: "multiplatform", label: "Multi-plateforme", cost: 4000, complexity: "high", description: "Windows, macOS, Linux" },
    ],
    ecommerce: [
      { id: "products", label: "Gestion de Produits", cost: 2500, complexity: "medium", description: "Catalogue produits avancé" },
      { id: "cart", label: "Panier d'Achat", cost: 1500, complexity: "medium", description: "Panier persistant et sauvegardé" },
      { id: "payment", label: "Passerelle de Paiement", cost: 3000, complexity: "high", description: "Stripe, PayPal, virements" },
      { id: "shipping", label: "Calcul de Frais d'Expédition", cost: 2000, complexity: "medium", description: "Calcul automatique des frais" },
      { id: "inventory", label: "Gestion des Stocks", cost: 1800, complexity: "medium", description: "Suivi stock en temps réel" },
      { id: "discounts", label: "Codes Promo et Réductions", cost: 1200, complexity: "medium", description: "Système de codes promo" },
      { id: "reviews", label: "Avis et Évaluations", cost: 1000, complexity: "low", description: "Système d'avis clients" },
      { id: "wishlist", label: "Liste de Souhaits", cost: 800, complexity: "low", description: "Liste de favoris" },
      { id: "recommendations", label: "Recommandations de Produits", cost: 2500, complexity: "high", description: "IA de recommandation" },
    ],
    crm: [
      { id: "contacts", label: "Gestion des Contacts", cost: 2000, complexity: "medium", description: "Base de données contacts" },
      { id: "leads", label: "Suivi des Prospects", cost: 2500, complexity: "medium", description: "Pipeline de conversion" },
      { id: "calendar", label: "Calendrier et Rendez-vous", cost: 1800, complexity: "medium", description: "Planning et réservations" },
      { id: "tasks", label: "Gestion des Tâches", cost: 1500, complexity: "medium", description: "To-do list et projets" },
      { id: "reports", label: "Rapports et Analyses", cost: 3000, complexity: "high", description: "Tableaux de bord avancés" },
      { id: "email", label: "Intégration Email", cost: 2000, complexity: "medium", description: "Sync email et templates" },
      { id: "automation", label: "Automatisation Marketing", cost: 4000, complexity: "high", description: "Workflows automatisés" },
      { id: "pipeline", label: "Pipeline de Vente", cost: 2500, complexity: "medium", description: "Suivi des opportunités" },
      { id: "documents", label: "Gestion Documentaire", cost: 1800, complexity: "medium", description: "Stockage et partage docs" },
    ],
    custom: [
      { id: "api", label: "Intégration API", cost: 2000, complexity: "high", description: "API REST/GraphQL complète" },
      { id: "auth", label: "Authentification Avancée", cost: 2500, complexity: "high", description: "OAuth, JWT, 2FA" },
      { id: "realtime", label: "Fonctionnalités Temps Réel", cost: 3000, complexity: "high", description: "WebSockets, live updates" },
      { id: "search", label: "Recherche Avancée", cost: 2000, complexity: "medium", description: "Elasticsearch, filtres" },
      { id: "export", label: "Export de Données", cost: 1000, complexity: "low", description: "Export multi-formats" },
      { id: "import", label: "Import de Données", cost: 1200, complexity: "medium", description: "Import CSV, Excel, API" },
      { id: "roles", label: "Gestion des Rôles et Permissions", cost: 1800, complexity: "medium", description: "RBAC complet" },
      { id: "notifications", label: "Système de Notifications", cost: 1500, complexity: "medium", description: "Email, SMS, push" },
    ],
  }

  // Base de prix par type de projet (en euros)
  const basePrice = {
    web: 5000,
    mobile: 8000,
    desktop: 7000,
    ecommerce: 10000,
    crm: 12000,
    custom: 15000,
  }

  // Multiplicateurs par complexité
  const complexityMultiplier = {
    simple: 0.7,
    medium: 1,
    complex: 1.5,
    enterprise: 2.2,
  }

  // Multiplicateurs par vitesse de livraison
  const speedMultiplier = {
    normal: 1,
    fast: 1.3,
    urgent: 1.7,
  }

  // Coûts de maintenance mensuels
  const maintenanceCost = {
    none: 0,
    basic: 0.05, // 5% du coût total
    standard: 0.1, // 10% du coût total
    premium: 0.15, // 15% du coût total
  }

  // Multiplicateurs régionaux
  const regionalMultiplier = {
    europe: 1.0,
    "north-america": 1.2,
    asia: 0.8,
    other: 1.0,
  }

  // Multiplicateurs par modèle de tarification
  const pricingModelMultiplier = {
    fixed: 1.0,
    hourly: 1.1, // +10% pour la flexibilité
    "value-based": 1.3, // +30% pour la valeur ajoutée
  }

  // Calcul de l'estimation (memoized)
  const calculateEstimate = useCallback(() => {
    // Prix de base selon le type de projet
    let base = basePrice[projectType]

    // Ajustement selon la complexité
    base = base * complexityMultiplier[projectComplexity]

    // Coût des fonctionnalités (somme des coûts individuels)
    const featureCost = features.reduce((total, featureId) => {
      const feature = featureOptions[projectType].find(f => f.id === featureId)
      return total + (feature ? feature.cost : 0)
    }, 0)

    // Coût total du développement
    let developmentCost = base + featureCost

    // Ajustement selon la vitesse de livraison
    developmentCost = developmentCost * speedMultiplier[deliverySpeed]

    // Ajustement selon la région
    developmentCost = developmentCost * regionalMultiplier[region]

    // Ajustement selon le modèle de tarification
    developmentCost = developmentCost * pricingModelMultiplier[pricingModel]

    // Coût du design (si inclus)
    const designCost = includeDesign ? developmentCost * 0.2 : 0

    // Coût de la gestion de projet (15% du développement)
    const projectManagementCost = developmentCost * 0.15

    // Coût des tests (10% du développement)
    const testingCost = developmentCost * 0.1

    // Coût du déploiement (5% du développement + coût d'hébergement si inclus)
    const deploymentCost = developmentCost * 0.05 + (includeHosting ? 500 : 0)

    // Coût total avant maintenance
    const subtotal = developmentCost + designCost + projectManagementCost + testingCost + deploymentCost

    // Coût de maintenance mensuel
    const monthlyMaintenance = subtotal * maintenanceCost[maintenanceLevel]

    // Estimation du temps (en semaines)
    const baseTimeframe = {
      simple: { min: 2, max: 4 },
      medium: { min: 4, max: 8 },
      complex: { min: 8, max: 16 },
      enterprise: { min: 16, max: 32 },
    }

    const timeframe = { ...baseTimeframe[projectComplexity] }

    // Ajustement du temps selon la vitesse de livraison
    if (deliverySpeed === "fast") {
      timeframe.min = Math.max(1, Math.floor(timeframe.min * 0.7))
      timeframe.max = Math.floor(timeframe.max * 0.7)
    } else if (deliverySpeed === "urgent") {
      timeframe.min = Math.max(1, Math.floor(timeframe.min * 0.5))
      timeframe.max = Math.floor(timeframe.max * 0.5)
    }

    // Ajustement selon le nombre de fonctionnalités
    const featureTimeImpact = features.length * 0.1 // 10% de plus par fonctionnalité
    timeframe.min = Math.ceil(timeframe.min * (1 + featureTimeImpact))
    timeframe.max = Math.ceil(timeframe.max * (1 + featureTimeImpact))

    // Ajustement selon la taille de l'équipe
    const teamSizeImpact = 1 / teamSize[0]
    timeframe.min = Math.ceil(timeframe.min * teamSizeImpact)
    timeframe.max = Math.ceil(timeframe.max * teamSizeImpact)

    return {
      development: Math.round(developmentCost),
      design: Math.round(designCost),
      projectManagement: Math.round(projectManagementCost),
      testing: Math.round(testingCost),
      deployment: Math.round(deploymentCost),
      maintenance: Math.round(monthlyMaintenance),
      total: Math.round(subtotal),
      timeframe,
    }
  }, [
    projectType,
    projectComplexity,
    deliverySpeed,
    maintenanceLevel,
    features,
    includeDesign,
    includeHosting,
    teamSize,
    region,
    pricingModel
  ])

  // Calcul de l'estimation en temps réel (memoized)
  const realTimeEstimate = useMemo(() => {
    if (!showRealTimePreview) return null
    return calculateEstimate()
  }, [showRealTimePreview, calculateEstimate])

  // Mise à jour de l'estimation lorsque les paramètres changent (memoized)
  useEffect(() => {
    if (showResults) {
      const newEstimate = calculateEstimate()
      setEstimate(newEstimate)
    }
  }, [showResults, calculateEstimate])

  // Charger les configurations sauvegardées
  useEffect(() => {
    const saved = localStorage.getItem("budgetConfigurations")
    if (saved) {
      try {
        setSavedConfigurations(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading saved configurations:", error)
      }
    }
  }, [])

  // Sauvegarder les configurations
  const saveConfiguration = () => {
    if (!configurationName.trim()) return

    const config: SavedConfiguration = {
      id: Date.now().toString(),
      name: configurationName,
      timestamp: new Date(),
      data: {
        projectType,
        projectComplexity,
        deliverySpeed,
        maintenanceLevel,
        features,
        includeDesign,
        includeHosting,
        teamSize,
        region,
        pricingModel,
        projectName,
        clientName,
        clientEmail,
        customFeatures,
        startDate,
      }
    }

    const updated = [...savedConfigurations, config]
    setSavedConfigurations(updated)
    localStorage.setItem("budgetConfigurations", JSON.stringify(updated))
    setShowSaveDialog(false)
    setConfigurationName("")
    
    toast("success", "Votre configuration a été sauvegardée avec succès.", {
      title: "Configuration sauvegardée",
    })
  }

  // Charger une configuration
  const loadConfiguration = (config: SavedConfiguration) => {
    const data = config.data
    setProjectType(data.projectType)
    setProjectComplexity(data.projectComplexity)
    setDeliverySpeed(data.deliverySpeed)
    setMaintenanceLevel(data.maintenanceLevel)
    setFeatures(data.features)
    setIncludeDesign(data.includeDesign)
    setIncludeHosting(data.includeHosting)
    setTeamSize(data.teamSize)
    setRegion(data.region)
    setPricingModel(data.pricingModel)
    setProjectName(data.projectName)
    setClientName(data.clientName)
    setClientEmail(data.clientEmail)
    setCustomFeatures(data.customFeatures)
    setStartDate(data.startDate ? new Date(data.startDate) : undefined)
    
    toast("success", `Configuration "${config.name}" chargée avec succès.`, {
      title: "Configuration chargée",
    })
  }

  // Gestion des fonctionnalités
  const handleFeatureChange = (featureId: string, checked: boolean) => {
    if (checked) {
      setFeatures([...features, featureId])
    } else {
      setFeatures(features.filter((id) => id !== featureId))
    }
  }

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newEstimate = calculateEstimate()
    setEstimate(newEstimate)
    setShowResults(true)

    // Scroll to results
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  // Téléchargement de l'estimation
  const handleDownload = () => {
    if (!estimate) return

    // Générer un PDF structuré
    const projectTypeLabels = {
      web: "Site Web / Application Web",
      mobile: "Application Mobile",
      desktop: "Application Desktop",
      ecommerce: "E-commerce",
      crm: "CRM / Système de Gestion",
      custom: "Projet Sur Mesure",
    }

    const complexityLabels = {
      simple: "Simple",
      medium: "Moyenne",
      complex: "Complexe",
      enterprise: "Entreprise",
    }

    const maintenanceLabels = {
      none: "Aucune",
      basic: "De base",
      standard: "Standard",
      premium: "Premium",
    }

    const deliverySpeedLabels = {
      normal: "Normale",
      fast: "Rapide",
      urgent: "Urgente",
    }

    // Préparer les données pour le PDF
    const pdfData = {
      title: "Estimation Budgétaire",
      subtitle: `Projet: ${projectName || "Nouveau Projet"}`,
      sections: [
        {
          title: "Informations du Projet",
          content: [
            { label: "Nom du Projet", value: projectName || "Non spécifié" },
            { label: "Client", value: clientName || "Non spécifié" },
            { label: "Email", value: clientEmail || "Non spécifié" },
            { label: "Type de Projet", value: projectTypeLabels[projectType] },
            { label: "Complexité", value: complexityLabels[projectComplexity] },
            { label: "Vitesse de Livraison", value: deliverySpeedLabels[deliverySpeed] },
            { label: "Maintenance", value: maintenanceLabels[maintenanceLevel] },
            { label: "Date de Début", value: startDate ? format(startDate, "dd/MM/yyyy") : "Non spécifiée" },
          ],
        },
        {
          title: "Détail des Coûts",
          content: [
            { label: "Développement", value: `${estimate.development.toLocaleString()} €` },
            { label: "Design UI/UX", value: `${estimate.design.toLocaleString()} €` },
            { label: "Gestion de Projet", value: `${estimate.projectManagement.toLocaleString()} €` },
            { label: "Tests & Assurance Qualité", value: `${estimate.testing.toLocaleString()} €` },
            { label: "Déploiement & Configuration", value: `${estimate.deployment.toLocaleString()} €` },
            { label: "Total", value: `${estimate.total.toLocaleString()} €` },
            { label: "Maintenance mensuelle", value: `${estimate.maintenance.toLocaleString()} €/mois` },
          ],
        },
        {
          title: "Délai Estimé",
          content: `${estimate.timeframe.min} à ${estimate.timeframe.max} semaines${startDate ? ` à partir du ${format(startDate, "dd/MM/yyyy")}` : ""}`,
        },
        {
          title: "Fonctionnalités Sélectionnées",
          content:
            features.length > 0
              ? features
                  .map((featureId) => {
                    const feature = featureOptions[projectType].find((f) => f.id === featureId)
                    return feature ? feature.label : ""
                  })
                  .filter((label) => label !== "")
              : ["Aucune fonctionnalité spécifique sélectionnée"],
        },
      ],
      footer: "Document généré le " + format(new Date(), "dd/MM/yyyy à HH:mm"),
    }

    // Si des fonctionnalités personnalisées sont spécifiées, les ajouter
    if (customFeatures) {
      pdfData.sections.push({
        title: "Fonctionnalités Personnalisées",
        content: customFeatures,
      })
    }

    // Générer le PDF
    generateStructuredPDF(
      pdfData,
      `Estimation_${projectName.replace(/\s+/g, "_") || "Projet"}_${format(new Date(), "yyyyMMdd")}.pdf`,
      {
        watermark: "ESTIMATION",
      },
    )

    toast("success", "Le devis a été téléchargé avec succès.", {
      title: "Estimation téléchargée",
    })
  }

  // Téléchargement de l'estimation au format visuel
  const handleDownloadVisual = () => {
    if (!estimate || !resultsRef.current) return

    generatePDF(
      "results",
      `Estimation_Visuelle_${projectName.replace(/\s+/g, "_") || "Projet"}_${format(new Date(), "yyyyMMdd")}.pdf`,
      {
        orientation: "portrait",
        title: "Estimation Budgétaire",
        subtitle: projectName || "Nouveau Projet",
        footer: "Document généré le " + format(new Date(), "dd/MM/yyyy à HH:mm"),
      },
    )

    toast("success", "Le devis visuel a été téléchargé avec succès.", {
      title: "Estimation téléchargée",
    })
  }

  // Envoi de l'estimation par email
  const handleSendByEmail = () => {
    if (!clientEmail || !estimate) return

    // Dans une application réelle, cela enverrait un email
    toast("success", `Le devis a été envoyé à ${clientEmail}.`, {
      title: "Estimation envoyée",
    })
  }

  // Réinitialisation du formulaire
  const handleReset = () => {
    setProjectType("web")
    setProjectComplexity("medium")
    setDeliverySpeed("normal")
    setMaintenanceLevel("basic")
    setFeatures([])
    setCustomFeatures("")
    setStartDate(undefined)
    setIncludeDesign(true)
    setIncludeHosting(true)
    setTeamSize([2])
    setProjectName("")
    setClientName("")
    setClientEmail("")
    setShowResults(false)
    setEstimate(null)

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">Simulateur de Budget</h1>
        <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
          Estimez le coût de votre projet en quelques clics avec notre calculateur intelligent
        </p>
      </div>

      {/* Real-time Preview */}
      {realTimeEstimate && (
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Aperçu en Temps Réel</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={showRealTimePreview}
                  onCheckedChange={setShowRealTimePreview}
                />
                <span className="text-sm text-muted-foreground">Aperçu en temps réel</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {realTimeEstimate.total.toLocaleString()} €
                </div>
                <div className="text-sm text-muted-foreground">Coût total estimé</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {realTimeEstimate.timeframe.min}-{realTimeEstimate.timeframe.max} sem
                </div>
                <div className="text-sm text-muted-foreground">Délai estimé</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {realTimeEstimate.maintenance.toLocaleString()} €/mois
                </div>
                <div className="text-sm text-muted-foreground">Maintenance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {features.length}
                </div>
                <div className="text-sm text-muted-foreground">Fonctionnalités</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Informations du Projet</CardTitle>
                <CardDescription>
                  Renseignez les détails de votre projet pour obtenir une estimation précise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Informations de base */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Nom du Projet</Label>
                      <Input
                        id="projectName"
                        placeholder="ex: Site E-commerce MaMarque"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Votre Nom / Entreprise</Label>
                      <Input
                        id="clientName"
                        placeholder="ex: Jean Dupont / MaMarque SAS"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientEmail">Email de Contact</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        placeholder="votre@email.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Date de Début Souhaitée</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            id="startDate"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Type de projet */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="projectType" className="text-base font-medium">
                      Type de Projet
                    </Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Sélectionnez le type de projet qui correspond le mieux à vos besoins
                    </p>
                    <Select value={projectType} onValueChange={(value: ProjectType) => setProjectType(value)}>
                      <SelectTrigger id="projectType">
                        <SelectValue placeholder="Sélectionner un type de projet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">Site Web / Application Web</SelectItem>
                        <SelectItem value="mobile">Application Mobile</SelectItem>
                        <SelectItem value="desktop">Application Desktop</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="crm">CRM / Système de Gestion</SelectItem>
                        <SelectItem value="custom">Projet Sur Mesure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="projectComplexity" className="text-base font-medium">
                      Complexité du Projet
                    </Label>
                    <p className="text-sm text-muted-foreground mb-3">Évaluez la complexité globale de votre projet</p>
                    <RadioGroup
                      value={projectComplexity}
                      onValueChange={(value: ProjectComplexity) => setProjectComplexity(value)}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="simple" id="complexity-simple" className="peer sr-only" />
                        <Label
                          htmlFor="complexity-simple"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="font-semibold">Simple</span>
                          <span className="text-xs text-muted-foreground text-center mt-1">
                            Fonctionnalités basiques, peu de pages
                          </span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="medium" id="complexity-medium" className="peer sr-only" />
                        <Label
                          htmlFor="complexity-medium"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="font-semibold">Moyenne</span>
                          <span className="text-xs text-muted-foreground text-center mt-1">
                            Plusieurs fonctionnalités, intégrations simples
                          </span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="complex" id="complexity-complex" className="peer sr-only" />
                        <Label
                          htmlFor="complexity-complex"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="font-semibold">Complexe</span>
                          <span className="text-xs text-muted-foreground text-center mt-1">
                            Nombreuses fonctionnalités, intégrations multiples
                          </span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="enterprise" id="complexity-enterprise" className="peer sr-only" />
                        <Label
                          htmlFor="complexity-enterprise"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="font-semibold">Entreprise</span>
                          <span className="text-xs text-muted-foreground text-center mt-1">
                            Système complexe, haute performance, sécurité avancée
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <Separator />

                {/* Options avancées */}
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Options Avancées</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
                      <div className="space-y-2">
                        <Label htmlFor="region">Région</Label>
                        <Select value={region} onValueChange={(value: Region) => setRegion(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="europe">Europe</SelectItem>
                            <SelectItem value="north-america">Amérique du Nord</SelectItem>
                            <SelectItem value="asia">Asie</SelectItem>
                            <SelectItem value="other">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pricingModel">Modèle de Tarification</Label>
                        <Select value={pricingModel} onValueChange={(value: PricingModel) => setPricingModel(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Forfait Fixe</SelectItem>
                            <SelectItem value="hourly">À l'Heure</SelectItem>
                            <SelectItem value="value-based">Basé sur la Valeur</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Fonctionnalités avec coûts détaillés */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Fonctionnalités</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Sélectionnez les fonctionnalités que vous souhaitez inclure dans votre projet
                    </p>
                    <div className="space-y-3">
                      {featureOptions[projectType].map((feature) => (
                        <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={`feature-${feature.id}`}
                              checked={features.includes(feature.id)}
                              onCheckedChange={(checked) => handleFeatureChange(feature.id, checked as boolean)}
                            />
                            <div>
                              <Label htmlFor={`feature-${feature.id}`} className="font-medium cursor-pointer">
                                {feature.label}
                              </Label>
                              {feature.description && (
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{feature.cost.toLocaleString()} €</div>
                            <Badge variant={feature.complexity === "low" ? "secondary" : feature.complexity === "medium" ? "default" : "destructive"}>
                              {feature.complexity === "low" ? "Simple" : feature.complexity === "medium" ? "Moyen" : "Complexe"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customFeatures">Fonctionnalités Personnalisées</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Décrivez d'autres fonctionnalités spécifiques que vous souhaitez
                    </p>
                    <Textarea
                      id="customFeatures"
                      placeholder="Décrivez vos besoins spécifiques ici..."
                      value={customFeatures}
                      onChange={(e) => setCustomFeatures(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                {/* Options supplémentaires */}
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Options Supplémentaires</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
                      <div className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                          <Label htmlFor="includeDesign">Design UI/UX</Label>
                          <p className="text-sm text-muted-foreground">Inclure la conception d'interface utilisateur</p>
                        </div>
                        <Switch id="includeDesign" checked={includeDesign} onCheckedChange={setIncludeDesign} />
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                          <Label htmlFor="includeHosting">Hébergement</Label>
                          <p className="text-sm text-muted-foreground">
                            Inclure la configuration et les frais d'hébergement
                          </p>
                        </div>
                        <Switch id="includeHosting" checked={includeHosting} onCheckedChange={setIncludeHosting} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label htmlFor="teamSize" className="text-base font-medium">
                          Taille de l'Équipe
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Nombre de développeurs travaillant sur le projet
                        </p>
                      </div>
                      <span className="font-medium">{teamSize[0]} développeurs</span>
                    </div>
                    <Slider id="teamSize" min={1} max={10} step={1} value={teamSize} onValueChange={setTeamSize} />
                  </div>

                  <div>
                    <Label htmlFor="deliverySpeed" className="text-base font-medium">
                      Vitesse de Livraison
                    </Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Sélectionnez la vitesse à laquelle vous souhaitez que le projet soit livré
                    </p>
                    <RadioGroup
                      value={deliverySpeed}
                      onValueChange={(value: DeliverySpeed) => setDeliverySpeed(value)}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="normal" id="speed-normal" className="peer sr-only" />
                        <Label
                          htmlFor="speed-normal"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="font-semibold">Normale</span>
                          <span className="text-xs text-muted-foreground text-center mt-1">
                            Délai standard, coût optimal
                          </span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="fast" id="speed-fast" className="peer sr-only" />
                        <Label
                          htmlFor="speed-fast"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="font-semibold">Rapide</span>
                          <span className="text-xs text-muted-foreground text-center mt-1">
                            Délai réduit, coût légèrement plus élevé
                          </span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="urgent" id="speed-urgent" className="peer sr-only" />
                        <Label
                          htmlFor="speed-urgent"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="font-semibold">Urgent</span>
                          <span className="text-xs text-muted-foreground text-center mt-1">
                            Délai minimal, coût significativement plus élevé
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="maintenanceLevel" className="text-base font-medium">
                      Niveau de Maintenance
                    </Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Choisissez le niveau de support et maintenance après le lancement
                    </p>
                    <Select
                      value={maintenanceLevel}
                      onValueChange={(value: MaintenanceLevel) => setMaintenanceLevel(value)}
                    >
                      <SelectTrigger id="maintenanceLevel">
                        <SelectValue placeholder="Sélectionner un niveau de maintenance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucune maintenance</SelectItem>
                        <SelectItem value="basic">Maintenance de base (corrections de bugs)</SelectItem>
                        <SelectItem value="standard">Maintenance standard (corrections + mises à jour)</SelectItem>
                        <SelectItem value="premium">
                          Maintenance premium (corrections + mises à jour + évolutions)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handleReset}>
                    Réinitialiser
                  </Button>
                  <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline">
                        <Save className="mr-2 h-4 w-4" />
                        Sauvegarder
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Sauvegarder la configuration</DialogTitle>
                        <DialogDescription>
                          Donnez un nom à cette configuration pour la retrouver plus tard.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="configName">Nom de la configuration</Label>
                          <Input
                            id="configName"
                            value={configurationName}
                            onChange={(e) => setConfigurationName(e.target.value)}
                            placeholder="ex: Site E-commerce Premium"
                          />
                        </div>
                        <Button onClick={saveConfiguration} disabled={!configurationName.trim()}>
                          Sauvegarder
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {savedConfigurations.length > 0 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline">
                          <Loader2 className="mr-2 h-4 w-4" />
                          Charger
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Charger une configuration</DialogTitle>
                          <DialogDescription>
                            Sélectionnez une configuration sauvegardée.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {savedConfigurations.map((config) => (
                            <div
                              key={config.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                              onClick={() => loadConfiguration(config)}
                            >
                              <div>
                                <div className="font-medium">{config.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {format(new Date(config.timestamp), "dd/MM/yyyy à HH:mm")}
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                Charger
                              </Button>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <Button type="submit">
                  <Calculator className="mr-2 h-4 w-4" /> Calculer l'estimation
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardHeader>
                <CardTitle>Aide & Informations</CardTitle>
                <CardDescription>Comprendre les différentes options du simulateur</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Types de projets</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <strong>Site Web / Application Web</strong> : Sites vitrines, blogs, applications web
                          interactives.
                        </li>
                        <li>
                          <strong>Application Mobile</strong> : Applications iOS, Android ou cross-platform.
                        </li>
                        <li>
                          <strong>Application Desktop</strong> : Logiciels pour Windows, macOS ou Linux.
                        </li>
                        <li>
                          <strong>E-commerce</strong> : Boutiques en ligne avec gestion de produits et paiements.
                        </li>
                        <li>
                          <strong>CRM / Système de Gestion</strong> : Outils de gestion clients, stocks, etc.
                        </li>
                        <li>
                          <strong>Projet Sur Mesure</strong> : Solutions spécifiques à vos besoins uniques.
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Niveaux de complexité</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <strong>Simple</strong> : Projets avec peu de pages et fonctionnalités basiques.
                        </li>
                        <li>
                          <strong>Moyenne</strong> : Projets avec plusieurs fonctionnalités et quelques intégrations.
                        </li>
                        <li>
                          <strong>Complexe</strong> : Projets avec de nombreuses fonctionnalités et intégrations.
                        </li>
                        <li>
                          <strong>Entreprise</strong> : Systèmes complexes nécessitant haute performance et sécurité.
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Vitesse de livraison</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <strong>Normale</strong> : Délai standard, permettant un développement méthodique.
                        </li>
                        <li>
                          <strong>Rapide</strong> : Délai réduit de 30%, nécessitant plus de ressources (+30% de coût).
                        </li>
                        <li>
                          <strong>Urgent</strong> : Délai minimal, priorité absolue (+70% de coût).
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Maintenance</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <strong>Aucune</strong> : Pas de support après livraison.
                        </li>
                        <li>
                          <strong>De base</strong> : Corrections de bugs uniquement (5% du coût total par mois).
                        </li>
                        <li>
                          <strong>Standard</strong> : Corrections + mises à jour de sécurité (10% du coût total par
                          mois).
                        </li>
                        <li>
                          <strong>Premium</strong> : Support complet incluant évolutions (15% du coût total par mois).
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-3">
                    <InfoIcon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Note importante</h4>
                      <p className="text-sm text-muted-foreground">
                        Cette estimation est fournie à titre indicatif. Pour un devis précis adapté à vos besoins
                        spécifiques, veuillez prendre rendez-vous pour une consultation.
                      </p>
                      <Button asChild className="mt-4 w-full" size="sm">
                        <Link href="/appointment">Prendre rendez-vous</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Résultats */}
      {showResults && estimate && (
        <div id="results" className="mt-12 scroll-mt-8" ref={resultsRef}>
          <Card className="border-primary/20">
            <CardHeader className="bg-primary/5">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Estimation Budgétaire</CardTitle>
                  <CardDescription>
                    Basée sur les informations fournies pour {projectName || "votre projet"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={handleDownload}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Télécharger l'estimation (PDF structuré)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={handleDownloadVisual}>
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Télécharger la version visuelle (PDF)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={handleSendByEmail} disabled={!clientEmail}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Envoyer par email</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Détail des Coûts</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Développement</span>
                      <span>{estimate.development.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Design UI/UX</span>
                      <span>{estimate.design.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Gestion de Projet</span>
                      <span>{estimate.projectManagement.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tests & Assurance Qualité</span>
                      <span>{estimate.testing.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Déploiement & Configuration</span>
                      <span>{estimate.deployment.toLocaleString()} €</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total</span>
                      <span>{estimate.total.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Maintenance mensuelle</span>
                      <span>{estimate.maintenance.toLocaleString()} €/mois</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Délai Estimé</h4>
                    <p className="text-muted-foreground">
                      {estimate.timeframe.min} à {estimate.timeframe.max} semaines
                    </p>
                    {startDate && (
                      <p className="text-sm text-muted-foreground mt-1">
                        À partir du {format(startDate, "PPP", { locale: fr })}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Récapitulatif du Projet</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Type de Projet</h4>
                      <p className="text-muted-foreground">
                        {projectType === "web" && "Site Web / Application Web"}
                        {projectType === "mobile" && "Application Mobile"}
                        {projectType === "desktop" && "Application Desktop"}
                        {projectType === "ecommerce" && "E-commerce"}
                        {projectType === "crm" && "CRM / Système de Gestion"}
                        {projectType === "custom" && "Projet Sur Mesure"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Complexité</h4>
                      <p className="text-muted-foreground">
                        {projectComplexity === "simple" && "Simple"}
                        {projectComplexity === "medium" && "Moyenne"}
                        {projectComplexity === "complex" && "Complexe"}
                        {projectComplexity === "enterprise" && "Entreprise"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Fonctionnalités Sélectionnées</h4>
                      {features.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {features.map((featureId) => {
                            const feature = featureOptions[projectType].find((f) => f.id === featureId)
                            return feature ? (
                              <Badge key={featureId} variant="outline">
                                {feature.label}
                              </Badge>
                            ) : null
                          })}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Aucune fonctionnalité spécifique sélectionnée</p>
                      )}
                    </div>
                    {customFeatures && (
                      <div>
                        <h4 className="font-medium">Fonctionnalités Personnalisées</h4>
                        <p className="text-muted-foreground">{customFeatures}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium">Options</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {includeDesign && <Badge variant="outline">Design UI/UX</Badge>}
                        {includeHosting && <Badge variant="outline">Hébergement</Badge>}
                        <Badge variant="outline">{teamSize[0]} développeurs</Badge>
                        <Badge variant="outline">
                          Livraison{" "}
                          {deliverySpeed === "normal" ? "normale" : deliverySpeed === "fast" ? "rapide" : "urgente"}
                        </Badge>
                        <Badge variant="outline">
                          Maintenance{" "}
                          {maintenanceLevel === "none"
                            ? "aucune"
                            : maintenanceLevel === "basic"
                              ? "de base"
                              : maintenanceLevel === "standard"
                                ? "standard"
                                : "premium"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button asChild className="w-full">
                      <Link href="/contact">
                        <FileText className="mr-2 h-4 w-4" /> Demander un devis détaillé
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Results with Charts */}
      {showResults && estimate && (
        <div id="results" className="mt-12 scroll-mt-8" ref={resultsRef}>
          <Card className="border-primary/20">
            <CardHeader className="bg-primary/5">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Estimation Budgétaire</CardTitle>
                  <CardDescription>
                    Basée sur les informations fournies pour {projectName || "votre projet"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={handleDownload}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Télécharger l'estimation (PDF structuré)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={handleDownloadVisual}>
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Télécharger la version visuelle (PDF)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={handleSendByEmail} disabled={!clientEmail}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Envoyer par email</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="breakdown">Détail des coûts</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Détail des Coûts</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Développement</span>
                          <span>{estimate.development.toLocaleString()} €</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Design UI/UX</span>
                          <span>{estimate.design.toLocaleString()} €</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Gestion de Projet</span>
                          <span>{estimate.projectManagement.toLocaleString()} €</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Tests & Assurance Qualité</span>
                          <span>{estimate.testing.toLocaleString()} €</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Déploiement & Configuration</span>
                          <span>{estimate.deployment.toLocaleString()} €</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total</span>
                          <span>{estimate.total.toLocaleString()} €</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Maintenance mensuelle</span>
                          <span>{estimate.maintenance.toLocaleString()} €/mois</span>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Délai Estimé</h4>
                        <p className="text-muted-foreground">
                          {estimate.timeframe.min} à {estimate.timeframe.max} semaines
                        </p>
                        {startDate && (
                          <p className="text-sm text-muted-foreground mt-1">
                            À partir du {format(startDate, "PPP", { locale: fr })}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Récapitulatif du Projet</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Type de Projet</h4>
                          <p className="text-muted-foreground">
                            {projectType === "web" && "Site Web / Application Web"}
                            {projectType === "mobile" && "Application Mobile"}
                            {projectType === "desktop" && "Application Desktop"}
                            {projectType === "ecommerce" && "E-commerce"}
                            {projectType === "crm" && "CRM / Système de Gestion"}
                            {projectType === "custom" && "Projet Sur Mesure"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">Complexité</h4>
                          <p className="text-muted-foreground">
                            {projectComplexity === "simple" && "Simple"}
                            {projectComplexity === "medium" && "Moyenne"}
                            {projectComplexity === "complex" && "Complexe"}
                            {projectComplexity === "enterprise" && "Entreprise"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">Fonctionnalités Sélectionnées</h4>
                          {features.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {features.map((featureId) => {
                                const feature = featureOptions[projectType].find((f) => f.id === featureId)
                                return feature ? (
                                  <Badge key={featureId} variant="outline">
                                    {feature.label}
                                  </Badge>
                                ) : null
                              })}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">Aucune fonctionnalité spécifique sélectionnée</p>
                          )}
                        </div>
                        {customFeatures && (
                          <div>
                            <h4 className="font-medium">Fonctionnalités Personnalisées</h4>
                            <p className="text-muted-foreground">{customFeatures}</p>
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">Options</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {includeDesign && <Badge variant="outline">Design UI/UX</Badge>}
                            {includeHosting && <Badge variant="outline">Hébergement</Badge>}
                            <Badge variant="outline">{teamSize[0]} développeurs</Badge>
                            <Badge variant="outline">
                              Livraison{" "}
                              {deliverySpeed === "normal" ? "normale" : deliverySpeed === "fast" ? "rapide" : "urgente"}
                            </Badge>
                            <Badge variant="outline">
                              Maintenance{" "}
                              {maintenanceLevel === "none"
                                ? "aucune"
                                : maintenanceLevel === "basic"
                                  ? "de base"
                                  : maintenanceLevel === "standard"
                                    ? "standard"
                                    : "premium"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button asChild className="w-full">
                          <Link href="/contact">
                            <FileText className="mr-2 h-4 w-4" /> Demander un devis détaillé
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="breakdown" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Répartition des Coûts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Développement</span>
                              <span>{estimate.development.toLocaleString()} €</span>
                            </div>
                            <Progress value={(estimate.development / estimate.total) * 100} />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Design</span>
                              <span>{estimate.design.toLocaleString()} €</span>
                            </div>
                            <Progress value={(estimate.design / estimate.total) * 100} />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Gestion de Projet</span>
                              <span>{estimate.projectManagement.toLocaleString()} €</span>
                            </div>
                            <Progress value={(estimate.projectManagement / estimate.total) * 100} />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Tests</span>
                              <span>{estimate.testing.toLocaleString()} €</span>
                            </div>
                            <Progress value={(estimate.testing / estimate.total) * 100} />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Déploiement</span>
                              <span>{estimate.deployment.toLocaleString()} €</span>
                            </div>
                            <Progress value={(estimate.deployment / estimate.total) * 100} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Informations Supplémentaires</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Région</span>
                          <Badge variant="outline">
                            {region === "europe" ? "Europe" :
                             region === "north-america" ? "Amérique du Nord" :
                             region === "asia" ? "Asie" : "Autre"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Modèle de Tarification</span>
                          <Badge variant="outline">
                            {pricingModel === "fixed" ? "Forfait Fixe" :
                             pricingModel === "hourly" ? "À l'Heure" : "Basé sur la Valeur"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Taille de l'équipe</span>
                          <Badge variant="outline">{teamSize[0]} développeurs</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Fonctionnalités</span>
                          <Badge variant="outline">{features.length} sélectionnées</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Timeline du Projet</CardTitle>
                      <CardDescription>
                        Délai estimé : {estimate.timeframe.min} à {estimate.timeframe.max} semaines
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-4 h-4 bg-primary rounded-full"></div>
                          <div>
                            <div className="font-medium">Phase 1: Planification</div>
                            <div className="text-sm text-muted-foreground">1-2 semaines</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                          <div>
                            <div className="font-medium">Phase 2: Développement</div>
                            <div className="text-sm text-muted-foreground">
                              {Math.max(1, Math.floor(estimate.timeframe.min * 0.6))} - {Math.floor(estimate.timeframe.max * 0.6)} semaines
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <div>
                            <div className="font-medium">Phase 3: Tests</div>
                            <div className="text-sm text-muted-foreground">1-2 semaines</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                          <div>
                            <div className="font-medium">Phase 4: Déploiement</div>
                            <div className="text-sm text-muted-foreground">1 semaine</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="features" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Fonctionnalités Sélectionnées</CardTitle>
                      <CardDescription>
                        Détail des fonctionnalités et de leurs coûts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {features.length > 0 ? (
                          features.map((featureId) => {
                            const feature = featureOptions[projectType].find((f) => f.id === featureId)
                            return feature ? (
                              <div key={featureId} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                  <div className="font-medium">{feature.label}</div>
                                  {feature.description && (
                                    <div className="text-sm text-muted-foreground">{feature.description}</div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold">{feature.cost.toLocaleString()} €</div>
                                  <Badge variant={feature.complexity === "low" ? "secondary" : feature.complexity === "medium" ? "default" : "destructive"}>
                                    {feature.complexity === "low" ? "Simple" : feature.complexity === "medium" ? "Moyen" : "Complexe"}
                                  </Badge>
                                </div>
                              </div>
                            ) : null
                          })
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            Aucune fonctionnalité sélectionnée
                          </div>
                        )}
                        {customFeatures && (
                          <div className="p-4 border rounded-lg bg-muted/50">
                            <div className="font-medium mb-2">Fonctionnalités Personnalisées</div>
                            <div className="text-sm text-muted-foreground">{customFeatures}</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}


