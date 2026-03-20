import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Icon } from "@/components/ui/icon"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ressources | Portfolio",
  description: "Ressources utiles pour le développement web, DevOps et les technologies modernes.",
}

export default function ResourcesPage() {
  const resources = {
    documentation: [
      {
        title: "React Documentation",
        description: "Documentation officielle de React avec guides et API reference",
        url: "https://react.dev",
        category: "Frontend",
        difficulty: "Beginner",
        icon: "react"
      },
      {
        title: "Next.js Documentation",
        description: "Guide complet pour Next.js avec exemples pratiques",
        url: "https://nextjs.org/docs",
        category: "Frontend",
        difficulty: "Intermediate",
        icon: "nextjs"
      },
      {
        title: "Node.js Documentation",
        description: "Documentation officielle de Node.js et ses APIs",
        url: "https://nodejs.org/docs",
        category: "Backend",
        difficulty: "Intermediate",
        icon: "nodejs"
      },
      {
        title: "Docker Documentation",
        description: "Guide complet pour containeriser vos applications",
        url: "https://docs.docker.com",
        category: "DevOps",
        difficulty: "Intermediate",
        icon: "docker"
      },
      {
        title: "Kubernetes Documentation",
        description: "Orchestration de conteneurs avec Kubernetes",
        url: "https://kubernetes.io/docs",
        category: "DevOps",
        difficulty: "Advanced",
        icon: "kubernetes"
      },
      {
        title: "PostgreSQL Documentation",
        description: "Base de données relationnelle open source",
        url: "https://www.postgresql.org/docs",
        category: "Database",
        difficulty: "Intermediate",
        icon: "postgresql"
      }
    ],
    tutorials: [
      {
        title: "Full-Stack React Tutorial",
        description: "Créer une application complète avec React, Node.js et MongoDB",
        url: "https://example.com/react-tutorial",
        category: "Full-Stack",
        difficulty: "Intermediate",
        duration: "8h",
        icon: "book"
      },
      {
        title: "DevOps avec Docker et Kubernetes",
        description: "Apprendre les bonnes pratiques DevOps",
        url: "https://example.com/devops-tutorial",
        category: "DevOps",
        difficulty: "Advanced",
        duration: "12h",
        icon: "layers"
      },
      {
        title: "API REST avec Express.js",
        description: "Créer des APIs robustes et sécurisées",
        url: "https://example.com/express-tutorial",
        category: "Backend",
        difficulty: "Intermediate",
        duration: "6h",
        icon: "server"
      },
      {
        title: "Tests Automatisés avec Jest",
        description: "Écrire des tests unitaires et d'intégration",
        url: "https://example.com/jest-tutorial",
        category: "Testing",
        difficulty: "Intermediate",
        duration: "4h",
        icon: "test-tube"
      }
    ],
    tools: [
      {
        title: "VS Code Extensions Pack",
        description: "Collection d'extensions essentielles pour le développement",
        url: "https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next",
        category: "Development",
        type: "Extension",
        icon: "code"
      },
      {
        title: "Postman",
        description: "Plateforme pour tester et documenter les APIs",
        url: "https://www.postman.com",
        category: "API Testing",
        type: "Application",
        icon: "mail"
      },
      {
        title: "Figma",
        description: "Outil de design collaboratif pour les interfaces",
        url: "https://www.figma.com",
        category: "Design",
        type: "Application",
        icon: "palette"
      },
      {
        title: "GitHub Actions",
        description: "Automatisation CI/CD directement dans GitHub",
        url: "https://github.com/features/actions",
        category: "DevOps",
        type: "Service",
        icon: "git-branch"
      },
      {
        title: "Vercel",
        description: "Plateforme de déploiement pour applications frontend",
        url: "https://vercel.com",
        category: "Deployment",
        type: "Platform",
        icon: "cloud"
      },
      {
        title: "MongoDB Compass",
        description: "Interface graphique pour MongoDB",
        url: "https://www.mongodb.com/products/compass",
        category: "Database",
        type: "Application",
        icon: "database"
      }
    ],
    templates: [
      {
        title: "React + TypeScript Template",
        description: "Template de base avec configuration TypeScript et ESLint",
        url: "https://github.com/example/react-ts-template",
        category: "Frontend",
        stars: 150,
        icon: "react"
      },
      {
        title: "Next.js E-commerce Template",
        description: "Template complet pour site e-commerce avec Stripe",
        url: "https://github.com/example/nextjs-ecommerce",
        category: "E-commerce",
        stars: 89,
        icon: "shopping-cart"
      },
      {
        title: "Node.js API Template",
        description: "API REST avec Express, JWT et validation",
        url: "https://github.com/example/nodejs-api-template",
        category: "Backend",
        stars: 67,
        icon: "server"
      },
      {
        title: "Docker Compose Stack",
        description: "Stack complète avec PostgreSQL, Redis et Nginx",
        url: "https://github.com/example/docker-stack",
        category: "DevOps",
        stars: 45,
        icon: "docker"
      }
    ],
    cheatsheets: [
      {
        title: "Git Commands Cheat Sheet",
        description: "Commandes Git essentielles pour le contrôle de version",
        url: "https://example.com/git-cheatsheet",
        category: "Version Control",
        icon: "git-branch"
      },
      {
        title: "Linux Commands Reference",
        description: "Commandes Linux les plus utilisées en développement",
        url: "https://example.com/linux-cheatsheet",
        category: "System",
        icon: "terminal"
      },
      {
        title: "SQL Queries Cheat Sheet",
        description: "Requêtes SQL courantes pour bases de données",
        url: "https://example.com/sql-cheatsheet",
        category: "Database",
        icon: "database"
      },
      {
        title: "Docker Commands Reference",
        description: "Commandes Docker pour la gestion des conteneurs",
        url: "https://example.com/docker-cheatsheet",
        category: "DevOps",
        icon: "docker"
      }
    ]
  }

  const categories = [
    { id: "documentation", label: "Documentation", count: resources.documentation.length },
    { id: "tutorials", label: "Tutoriels", count: resources.tutorials.length },
    { id: "tools", label: "Outils", count: resources.tools.length },
    { id: "templates", label: "Templates", count: resources.templates.length },
    { id: "cheatsheets", label: "Aide-mémoire", count: resources.cheatsheets.length }
  ]

  const getDifficultyColor = (difficulty?: string) => {
    if (!difficulty) return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    switch (difficulty.toLowerCase()) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getCategoryColor = (category?: string) => {
    if (!category) return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    switch (category.toLowerCase()) {
      case "frontend": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "backend": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "devops": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "database": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "full-stack": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
      case "testing": return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
      case "design": return "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300"
      case "development": return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300"
      case "api testing": return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300"
      case "deployment": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
      case "e-commerce": return "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300"
      case "version control": return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300"
      case "system": return "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
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
        <TabsList className="grid w-full grid-cols-5 mb-8">
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
              {resources[category.id as keyof typeof resources].map((resource, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {resource.icon && (
                          <Icon name={resource.icon as any} className="h-5 w-5" />
                        )}
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
                        {resource.category && (
                          <Badge className={getCategoryColor(resource.category)}>
                            {resource.category}
                          </Badge>
                        )}
                        {"difficulty" in resource && resource.difficulty && (
                          <Badge className={getDifficultyColor(resource.difficulty)}>
                            {resource.difficulty}
                          </Badge>
                        )}
                        {"duration" in resource && resource.duration && (
                          <Badge variant="outline">
                            <Icon name="Clock" className="h-3 w-3 mr-1" />
                            {resource.duration}
                          </Badge>
                        )}
                        {"type" in resource && resource.type && (
                          <Badge variant="outline">
                            {resource.type}
                          </Badge>
                        )}
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
        <h2 className="text-2xl font-bold mb-4">Besoin d'aide personnalisée ?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Si vous ne trouvez pas ce que vous cherchez ou si vous avez besoin d'aide pour un projet spécifique, 
          n'hésitez pas à me contacter pour une consultation personnalisée.
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