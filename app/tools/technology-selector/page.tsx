"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Icon } from "@/components/ui/icon"
import { TechIcon } from "@/components/tech-icon"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import type { Metadata } from "next"

// Types
type ProjectType = "web" | "mobile" | "api" | "ecommerce" | "dashboard" | "blog" | "desktop"
type Priority = "performance" | "scalability" | "development-speed" | "maintenance" | "cost"
type ExperienceLevel = "beginner" | "intermediate" | "advanced"
type TechnologyCategory = "frontend" | "backend" | "database" | "devops" | "mobile" | "testing"

interface Technology {
  id: string
  name: string
  category: TechnologyCategory
  description: string
  pros: string[]
  cons: string[]
  difficulty: "easy" | "medium" | "hard"
  popularity: number
  performance: number
  scalability: number
  developmentSpeed: number
  maintenance: number
  cost: "low" | "medium" | "high"
  projectTypes: ProjectType[]
  dependencies?: string[]
  alternatives?: string[]
  icon?: string
}

interface Recommendation {
  technology: Technology
  score: number
  reasons: string[]
}

export default function TechnologySelectorPage() {
  const { toast } = useToast()
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<ProjectType[]>([])
  const [priorities, setPriorities] = useState<Priority[]>([])
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("intermediate")
  const [budget, setBudget] = useState([5000])
  const [timeline, setTimeline] = useState([3])
  const [teamSize, setTeamSize] = useState([2])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [showResults, setShowResults] = useState(false)

  // Technologies database
  const technologies: Technology[] = [
    // Frontend
    {
      id: "react",
      name: "React",
      category: "frontend",
      description: "Bibliothèque JavaScript pour construire des interfaces utilisateur",
      pros: ["Écosystème riche", "Communauté active", "Flexibilité", "Performance"],
      cons: ["Courbe d'apprentissage", "Complexité pour les débutants"],
      difficulty: "medium",
      popularity: 95,
      performance: 85,
      scalability: 90,
      developmentSpeed: 80,
      maintenance: 75,
      cost: "medium",
      projectTypes: ["web", "dashboard", "ecommerce"],
      icon: "react"
    },
    {
      id: "vue",
      name: "Vue.js",
      category: "frontend",
      description: "Framework JavaScript progressif pour construire des interfaces utilisateur",
      pros: ["Facile à apprendre", "Documentation excellente", "Performance", "Flexibilité"],
      cons: ["Écosystème plus petit", "Moins d'emplois"],
      difficulty: "easy",
      popularity: 80,
      performance: 90,
      scalability: 85,
      developmentSpeed: 90,
      maintenance: 85,
      cost: "low",
      projectTypes: ["web", "dashboard", "ecommerce", "blog"],
      icon: "vue"
    },
    {
      id: "angular",
      name: "Angular",
      category: "frontend",
      description: "Framework TypeScript pour construire des applications web",
      pros: ["Architecture complète", "TypeScript natif", "Outils intégrés", "Enterprise-ready"],
      cons: ["Courbe d'apprentissage raide", "Complexité", "Bundle size"],
      difficulty: "hard",
      popularity: 70,
      performance: 80,
      scalability: 95,
      developmentSpeed: 70,
      maintenance: 80,
      cost: "high",
      projectTypes: ["web", "dashboard", "ecommerce"],
      icon: "angular"
    },
    {
      id: "nextjs",
      name: "Next.js",
      category: "frontend",
      description: "Framework React avec SSR et optimisations",
      pros: ["SSR/SSG", "Performance", "SEO", "DX excellent"],
      cons: ["Vendor lock-in", "Complexité"],
      difficulty: "medium",
      popularity: 90,
      performance: 95,
      scalability: 90,
      developmentSpeed: 85,
      maintenance: 80,
      cost: "medium",
      projectTypes: ["web", "ecommerce", "blog"],
      icon: "nextjs"
    },
    // Backend
    {
      id: "nodejs",
      name: "Node.js",
      category: "backend",
      description: "Runtime JavaScript pour le développement backend",
      pros: ["JavaScript partout", "Écosystème NPM", "Performance", "Scalabilité"],
      cons: ["Single-threaded", "Callback hell (sans async/await)"],
      difficulty: "medium",
      popularity: 90,
      performance: 85,
      scalability: 90,
      developmentSpeed: 85,
      maintenance: 80,
      cost: "medium",
      projectTypes: ["web", "api", "ecommerce", "dashboard"],
      icon: "nodejs"
    },
    {
      id: "python",
      name: "Python",
      category: "backend",
      description: "Langage de programmation polyvalent",
      pros: ["Syntaxe claire", "Écosystème riche", "ML/AI", "Rapidité de développement"],
      cons: ["Performance", "GIL", "Déploiement complexe"],
      difficulty: "easy",
      popularity: 85,
      performance: 60,
      scalability: 75,
      developmentSpeed: 95,
      maintenance: 90,
      cost: "low",
      projectTypes: ["web", "api", "dashboard"],
      icon: "python"
    },
    {
      id: "java",
      name: "Java",
      category: "backend",
      description: "Langage de programmation orienté objet",
      pros: ["Performance", "Écosystème enterprise", "Stabilité", "Scalabilité"],
      cons: ["Verbose", "Courbe d'apprentissage", "Complexité"],
      difficulty: "hard",
      popularity: 80,
      performance: 90,
      scalability: 95,
      developmentSpeed: 60,
      maintenance: 85,
      cost: "high",
      projectTypes: ["web", "api", "ecommerce", "dashboard"],
      icon: "java"
    },
    {
      id: "golang",
      name: "Go",
      category: "backend",
      description: "Langage de programmation moderne et performant",
      pros: ["Performance", "Simplicité", "Concurrence", "Déploiement facile"],
      cons: ["Écosystème plus petit", "Syntaxe particulière"],
      difficulty: "medium",
      popularity: 75,
      performance: 95,
      scalability: 95,
      developmentSpeed: 70,
      maintenance: 85,
      cost: "medium",
      projectTypes: ["api", "web"],
      icon: "golang"
    },
    // Databases
    {
      id: "postgresql",
      name: "PostgreSQL",
      category: "database",
      description: "Base de données relationnelle open source",
      pros: ["ACID", "Extensions", "Performance", "Standards SQL"],
      cons: ["Complexité", "Courbe d'apprentissage"],
      difficulty: "medium",
      popularity: 85,
      performance: 90,
      scalability: 85,
      developmentSpeed: 70,
      maintenance: 80,
      cost: "low",
      projectTypes: ["web", "api", "ecommerce", "dashboard"],
      icon: "postgresql"
    },
    {
      id: "mongodb",
      name: "MongoDB",
      category: "database",
      description: "Base de données NoSQL orientée documents",
      pros: ["Flexibilité", "Développement rapide", "Scalabilité horizontale", "JSON natif"],
      cons: ["Pas d'ACID", "Consommation mémoire", "Requêtes complexes"],
      difficulty: "easy",
      popularity: 80,
      performance: 75,
      scalability: 90,
      developmentSpeed: 90,
      maintenance: 70,
      cost: "medium",
      projectTypes: ["web", "api", "ecommerce", "dashboard"],
      icon: "mongodb"
    },
    {
      id: "redis",
      name: "Redis",
      category: "database",
      description: "Base de données en mémoire pour le cache et les sessions",
      pros: ["Performance", "Simplicité", "Structures de données", "Pub/Sub"],
      cons: ["Volatile", "Limité par la RAM", "Pas de relations"],
      difficulty: "easy",
      popularity: 75,
      performance: 100,
      scalability: 80,
      developmentSpeed: 85,
      maintenance: 90,
      cost: "low",
      projectTypes: ["web", "api", "ecommerce", "dashboard"],
      icon: "redis"
    },
    // Mobile
    {
      id: "react-native",
      name: "React Native",
      category: "mobile",
      description: "Framework pour développer des applications mobiles avec React",
      pros: ["Code partagé", "Performance native", "Écosystème React", "Hot reload"],
      cons: ["Limitations natives", "Debugging complexe", "Updates fréquentes"],
      difficulty: "medium",
      popularity: 85,
      performance: 80,
      scalability: 80,
      developmentSpeed: 85,
      maintenance: 70,
      cost: "medium",
      projectTypes: ["mobile"],
      icon: "react-native"
    },
    {
      id: "flutter",
      name: "Flutter",
      category: "mobile",
      description: "Framework Google pour développer des applications mobiles",
      pros: ["Performance native", "UI cohérente", "Hot reload", "Dart"],
      cons: ["Courbe d'apprentissage", "Taille des apps", "Écosystème"],
      difficulty: "medium",
      popularity: 80,
      performance: 95,
      scalability: 85,
      developmentSpeed: 80,
      maintenance: 75,
      cost: "medium",
      projectTypes: ["mobile"],
      icon: "flutter"
    },
    {
      id: "swift",
      name: "Swift",
      category: "mobile",
      description: "Langage de programmation Apple pour iOS",
      pros: ["Performance native", "Sécurité", "Modernité", "Intégration iOS"],
      cons: ["iOS uniquement", "Courbe d'apprentissage", "Écosystème Apple"],
      difficulty: "hard",
      popularity: 70,
      performance: 100,
      scalability: 90,
      developmentSpeed: 70,
      maintenance: 80,
      cost: "high",
      projectTypes: ["mobile"],
      icon: "swift"
    },
    {
      id: "kotlin",
      name: "Kotlin",
      category: "mobile",
      description: "Langage de programmation moderne pour Android",
      pros: ["Interopérabilité Java", "Sécurité", "Concision", "Performance"],
      cons: ["Android uniquement", "Courbe d'apprentissage", "Écosystème"],
      difficulty: "medium",
      popularity: 75,
      performance: 95,
      scalability: 90,
      developmentSpeed: 75,
      maintenance: 80,
      cost: "medium",
      projectTypes: ["mobile"],
      icon: "kotlin"
    }
  ]

  // Calculate recommendations (memoized)
  const calculateRecommendations = useCallback(() => {
    if (selectedProjectTypes.length === 0) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner au moins un type de projet.",
        variant: "destructive"
      })
      return
    }

    const scores = technologies.map(tech => {
      let score = 0
      let reasons: string[] = []

      // Project type compatibility
      const projectTypeMatch = tech.projectTypes.some(type => selectedProjectTypes.includes(type))
      if (projectTypeMatch) {
        score += 30
        reasons.push("Compatible avec votre type de projet")
      }

      // Priority-based scoring
      priorities.forEach(priority => {
        switch (priority) {
          case "performance":
            score += tech.performance * 0.2
            if (tech.performance > 80) reasons.push("Excellente performance")
            break
          case "scalability":
            score += tech.scalability * 0.2
            if (tech.scalability > 80) reasons.push("Très scalable")
            break
          case "development-speed":
            score += tech.developmentSpeed * 0.2
            if (tech.developmentSpeed > 80) reasons.push("Développement rapide")
            break
          case "maintenance":
            score += tech.maintenance * 0.2
            if (tech.maintenance > 80) reasons.push("Facile à maintenir")
            break
          case "cost":
            const costScore = tech.cost === "low" ? 100 : tech.cost === "medium" ? 60 : 20
            score += costScore * 0.2
            if (tech.cost === "low") reasons.push("Coût faible")
            break
        }
      })

      // Experience level adjustment
      if (experienceLevel === "beginner" && tech.difficulty === "easy") {
        score += 20
        reasons.push("Facile à apprendre")
      } else if (experienceLevel === "advanced" && tech.difficulty === "hard") {
        score += 15
        reasons.push("Technologie avancée")
      }

      // Budget consideration
      if (budget[0] < 10000 && tech.cost === "low") {
        score += 15
        reasons.push("Adapté à votre budget")
      } else if (budget[0] > 50000 && tech.cost === "high") {
        score += 10
        reasons.push("Technologie enterprise")
      }

      // Timeline consideration
      if (timeline[0] < 3 && tech.developmentSpeed > 80) {
        score += 10
        reasons.push("Développement rapide")
      }

      // Team size consideration
      if (teamSize[0] > 5 && tech.popularity > 80) {
        score += 10
        reasons.push("Facile à recruter")
      }

      return { technology: tech, score: Math.round(score), reasons }
    })

    // Sort by score and take top 6
    const sortedRecommendations = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .filter(rec => rec.score > 0)

    setRecommendations(sortedRecommendations)
    setShowResults(true)

    toast({
      title: "Recommandations générées",
      description: `${sortedRecommendations.length} technologies recommandées trouvées.`,
    })
  }, [
    selectedProjectTypes,
    priorities,
    experienceLevel,
    budget,
    timeline,
    teamSize,
    technologies,
    toast
  ])

  const handleProjectTypeChange = useCallback((type: ProjectType, checked: boolean) => {
    if (checked) {
      setSelectedProjectTypes(prev => [...prev, type])
    } else {
      setSelectedProjectTypes(prev => prev.filter(t => t !== type))
    }
  }, [])

  const handlePriorityChange = useCallback((priority: Priority, checked: boolean) => {
    if (checked) {
      setPriorities(prev => [...prev, priority])
    } else {
      setPriorities(prev => prev.filter(p => p !== priority))
    }
  }, [])

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Sélecteur de Technologies</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Trouvez la stack technologique idéale pour votre projet en fonction de vos besoins et contraintes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Filtres</CardTitle>
              <CardDescription>Configurez vos préférences pour obtenir des recommandations personnalisées</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Type de projet */}
              <div>
                <h3 className="font-medium mb-3">Type de projet</h3>
                <div className="space-y-2">
                  {[
                    { id: "web", label: "Site web" },
                    { id: "mobile", label: "Application mobile" },
                    { id: "api", label: "API" },
                    { id: "ecommerce", label: "E-commerce" },
                    { id: "dashboard", label: "Dashboard" },
                    { id: "blog", label: "Blog" },
                    { id: "desktop", label: "Application desktop" }
                  ].map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type.id}`}
                        checked={selectedProjectTypes.includes(type.id as ProjectType)}
                        onCheckedChange={(checked) => handleProjectTypeChange(type.id as ProjectType, checked as boolean)}
                      />
                      <Label htmlFor={`type-${type.id}`} className="text-sm">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Priorités */}
              <div>
                <h3 className="font-medium mb-3">Priorités</h3>
                <div className="space-y-2">
                  {[
                    { id: "performance", label: "Performance" },
                    { id: "scalability", label: "Scalabilité" },
                    { id: "development-speed", label: "Vitesse de développement" },
                    { id: "maintenance", label: "Facilité de maintenance" },
                    { id: "cost", label: "Coût" }
                  ].map((priority) => (
                    <div key={priority.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`priority-${priority.id}`}
                        checked={priorities.includes(priority.id as Priority)}
                        onCheckedChange={(checked) => handlePriorityChange(priority.id as Priority, checked as boolean)}
                      />
                      <Label htmlFor={`priority-${priority.id}`} className="text-sm">
                        {priority.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Niveau d'expérience */}
              <div>
                <h3 className="font-medium mb-3">Niveau d'expérience</h3>
                <RadioGroup value={experienceLevel} onValueChange={(value) => setExperienceLevel(value as ExperienceLevel)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="exp-beginner" />
                    <Label htmlFor="exp-beginner">Débutant</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="exp-intermediate" />
                    <Label htmlFor="exp-intermediate">Intermédiaire</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="exp-advanced" />
                    <Label htmlFor="exp-advanced">Avancé</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Budget */}
              <div>
                <h3 className="font-medium mb-3">Budget (€)</h3>
                <div className="space-y-2">
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
                    min={1000}
                    max={100000}
                    step={1000}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground text-center">
                    {budget[0].toLocaleString()} €
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="font-medium mb-3">Délai (mois)</h3>
                <div className="space-y-2">
                  <Slider
                    value={timeline}
                    onValueChange={setTimeline}
                    min={1}
                    max={12}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground text-center">
                    {timeline[0]} mois
                  </div>
                </div>
              </div>

              {/* Taille de l'équipe */}
              <div>
                <h3 className="font-medium mb-3">Taille de l'équipe</h3>
                <div className="space-y-2">
                  <Slider
                    value={teamSize}
                    onValueChange={setTeamSize}
                    min={1}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground text-center">
                    {teamSize[0]} développeur{teamSize[0] > 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              <Button onClick={calculateRecommendations} className="w-full">
                <Icon name="Search" className="mr-2 h-4 w-4" />
                Générer les recommandations
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {!showResults ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Icon name="Search" className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Configurez vos préférences</h3>
                  <p className="text-muted-foreground">
                    Sélectionnez vos critères dans le panneau de gauche pour obtenir des recommandations personnalisées.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Recommandations</h2>
                <Badge variant="outline">
                  {recommendations.length} technologies trouvées
                </Badge>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">Toutes</TabsTrigger>
                  <TabsTrigger value="frontend">Frontend</TabsTrigger>
                  <TabsTrigger value="backend">Backend</TabsTrigger>
                  <TabsTrigger value="database">Base de données</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <Card key={rec.technology.id} className="relative">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              {rec.technology.icon && (
                                <TechIcon name={rec.technology.icon} className="h-12 w-12" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold">{rec.technology.name}</h3>
                                <Badge variant="secondary">{rec.technology.category}</Badge>
                                <Badge variant={rec.technology.difficulty === "easy" ? "default" : rec.technology.difficulty === "medium" ? "secondary" : "destructive"}>
                                  {rec.technology.difficulty === "easy" ? "Facile" : rec.technology.difficulty === "medium" ? "Moyen" : "Difficile"}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground mb-3">{rec.technology.description}</p>
                              
                              <div className="flex items-center space-x-4 mb-3">
                                <div className="text-sm">
                                  <span className="font-medium">Score: </span>
                                  <span className="text-primary font-bold">{rec.score}/100</span>
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">Popularité: </span>
                                  <span>{rec.technology.popularity}%</span>
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">Coût: </span>
                                  <span className={rec.technology.cost === "low" ? "text-green-600" : rec.technology.cost === "medium" ? "text-yellow-600" : "text-red-600"}>
                                    {rec.technology.cost === "low" ? "Faible" : rec.technology.cost === "medium" ? "Moyen" : "Élevé"}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">Pourquoi cette technologie ?</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {rec.reasons.map((reason, idx) => (
                                    <li key={idx} className="flex items-center">
                                      <Icon name="Check" className="h-3 w-3 mr-2 text-green-500" />
                                      {reason}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {["frontend", "backend", "database"].map(category => (
                  <TabsContent key={category} value={category} className="space-y-4">
                    {recommendations
                      .filter(rec => rec.technology.category === category)
                      .map((rec, index) => (
                        <Card key={rec.technology.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                  {rec.technology.icon && (
                                    <TechIcon name={rec.technology.icon} className="h-12 w-12" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="text-lg font-semibold">{rec.technology.name}</h3>
                                    <Badge variant="secondary">{rec.technology.category}</Badge>
                                  </div>
                                  <p className="text-muted-foreground mb-3">{rec.technology.description}</p>
                                  <div className="text-sm">
                                    <span className="font-medium">Score: </span>
                                    <span className="text-primary font-bold">{rec.score}/100</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}