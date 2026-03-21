"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Icon } from "@/components/ui/icon"
import { TechIcon } from "@/components/tech/tech-icon"
import Link from "next/link"

export type ResourcesBundle = {
  documentation: {
    title: string
    description: string
    url: string
    category?: string
    difficulty?: string
    icon?: string
  }[]
  tutorials: {
    title: string
    description: string
    url: string
    category?: string
    difficulty?: string
    duration?: string
    icon?: string
  }[]
  tools: {
    title: string
    description: string
    url: string
    category?: string
    type?: string
    icon?: string
  }[]
  templates: {
    title: string
    description: string
    url: string
    category?: string
    stars?: number
    icon?: string
  }[]
  cheatsheets: {
    title: string
    description: string
    url: string
    category?: string
    icon?: string
  }[]
}

export default function ResourcesClient({ resources }: { resources: ResourcesBundle }) {
  const categories = [
    { id: "documentation" as const, label: "Documentation", count: resources.documentation.length },
    { id: "tutorials" as const, label: "Tutoriels", count: resources.tutorials.length },
    { id: "tools" as const, label: "Outils", count: resources.tools.length },
    { id: "templates" as const, label: "Templates", count: resources.templates.length },
    { id: "cheatsheets" as const, label: "Aide-mémoire", count: resources.cheatsheets.length },
  ]

  const getDifficultyColor = (difficulty?: string) => {
    if (!difficulty) return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getCategoryColor = (category?: string) => {
    if (!category) return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    switch (category.toLowerCase()) {
      case "frontend":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "backend":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "devops":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "database":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "full-stack":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
      case "testing":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
      case "design":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300"
      case "development":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300"
      case "api testing":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300"
      case "deployment":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
      case "e-commerce":
        return "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300"
      case "version control":
        return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300"
      case "system":
        return "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Ressources</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Une collection de ressources utiles pour le développement web, DevOps et les technologies modernes.
        </p>
      </div>

      <Tabs defaultValue="documentation" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-8 h-auto gap-1">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              {category.label}
              <Badge variant="secondary" className="ml-1">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resources[category.id].map((resource, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {resource.icon ? <TechIcon name={resource.icon} size={22} className="shrink-0" /> : null}
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                      </div>
                      {"stars" in resource && resource.stars != null && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Icon name="Star" className="h-3 w-3" />
                          {resource.stars}
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {resource.category ? (
                          <Badge className={getCategoryColor(resource.category)}>{resource.category}</Badge>
                        ) : null}
                        {"difficulty" in resource && resource.difficulty ? (
                          <Badge className={getDifficultyColor(resource.difficulty)}>{resource.difficulty}</Badge>
                        ) : null}
                        {"duration" in resource && resource.duration ? (
                          <Badge variant="outline">
                            <Icon name="Clock" className="h-3 w-3 mr-1" />
                            {resource.duration}
                          </Badge>
                        ) : null}
                        {"type" in resource && resource.type ? <Badge variant="outline">{resource.type}</Badge> : null}
                      </div>

                      <div className="pt-2">
                        <Button asChild className="w-full">
                          <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                            <Icon name="ExternalLink" className="mr-2 h-4 w-4" />
                            Voir la ressource
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Separator className="my-12" />

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Besoin d&apos;aide personnalisée ?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Si vous ne trouvez pas ce que vous cherchez ou si vous avez besoin d&apos;aide pour un projet spécifique,
          n&apos;hésitez pas à me contacter pour une consultation personnalisée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/contact">
              <Icon name="Mail" className="mr-2 h-4 w-4" />
              Me contacter
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/services">
              <Icon name="Briefcase" className="mr-2 h-4 w-4" />
              Mes services
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
