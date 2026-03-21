"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Icon } from "@/components/ui/icon"
import { getCategoryIcon } from "@/lib/utils/icon-utils"
import Image from "next/image"

export type PortfolioProjectCard = {
  slug: string
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
}

export default function PortfolioClient({ projects }: { projects: PortfolioProjectCard[] }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-bold">Portfolio</h1>
        <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
          Découvrez mes projets récents et les technologies que j&apos;utilise
        </p>
      </div>

      <Tabs defaultValue="all" className="mb-12">
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-1.5">
              <Icon name="Grid" size="sm" aria-hidden={true} /> Tous
            </TabsTrigger>
            <TabsTrigger value="web" className="flex items-center gap-1.5">
              <Icon name="Globe" size="sm" aria-hidden={true} /> Web
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-1.5">
              <Icon name="Smartphone" size="sm" aria-hidden={true} /> Mobile
            </TabsTrigger>
            <TabsTrigger value="devops" className="flex items-center gap-1.5">
              <Icon name="Server" size="sm" aria-hidden={true} /> DevOps
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="web" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects
              .filter((project) => project.category === "web")
              .map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="mobile" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects
              .filter((project) => project.category === "mobile")
              .map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="devops" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects
              .filter((project) => project.category === "devops")
              .map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProjectCard({ project }: { project: PortfolioProjectCard }) {
  const categoryIcon = getCategoryIcon(project.category)

  return (
    <Card className="overflow-hidden group">
      <div className="relative h-64 w-full">
        <div className="absolute top-4 right-4 z-10">
          <Badge className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm">
            <Icon name={categoryIcon as any} size="xs" aria-hidden={true} />
            {project.category}
          </Badge>
        </div>
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Icon name={categoryIcon as any} size="sm" variant="solid" aria-hidden={true} />
          <h3 className="text-xl font-semibold">{project.title}</h3>
        </div>
        <p className="text-muted-foreground mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <Badge key={index} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/portfolio/${project.slug}`}>
            Voir le projet <Icon name="ArrowRight" size="sm" className="ml-2" aria-hidden={true} />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
