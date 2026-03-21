"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export type PortfolioDetailProject = {
  slug: string
  title: string
  client: string
  date: string
  description: string
  technologies: string[]
  images: string[]
  liveUrl: string | null
  githubUrl: string | null
}

export type PortfolioRelatedCard = {
  slug: string
  title: string
  description: string
  image: string
}

export default function PortfolioDetailClient({
  project,
  related,
}: {
  project: PortfolioDetailProject
  related: PortfolioRelatedCard[]
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href="/portfolio"
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au portfolio
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech, index) => (
              <Badge key={index} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
          <p className="text-xl text-muted-foreground mb-6">{project.description}</p>
          <div className="flex flex-wrap gap-4 mb-8">
            {project.liveUrl ? (
              <Button asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ArrowRight className="mr-2 h-4 w-4" /> Voir le site
                </a>
              </Button>
            ) : null}
            {project.githubUrl ? (
              <Button variant="outline" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <ArrowRight className="mr-2 h-4 w-4" /> Code source
                </a>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Informations</h3>
              <p>Client: {project.client}</p>
              <p>Date: {project.date}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-12">
        <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
          <Image
            src={project.images[activeImageIndex] || "/placeholder.svg"}
            alt={`${project.title} - Image ${activeImageIndex + 1}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {project.images.map((image, index) => (
            <button
              type="button"
              key={index}
              className={`relative aspect-video w-full rounded-md overflow-hidden cursor-pointer border-2 p-0 ${index === activeImageIndex ? "border-primary" : "border-transparent"}`}
              onClick={() => setActiveImageIndex(index)}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${project.title} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {related.length > 0 ? (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Projets similaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((r) => (
              <Card key={r.slug} className="overflow-hidden group">
                <div className="relative h-48 w-full">
                  <Image
                    src={r.image || "/placeholder.svg"}
                    alt={r.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{r.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{r.description}</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/portfolio/${r.slug}`}>Voir le projet</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      <div className="text-center py-8 bg-muted/30 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Vous avez un projet similaire en tête ?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Je serais ravi de discuter de votre projet et de voir comment je peux vous aider à le réaliser.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/appointment">
              <ArrowLeft className="mr-2 h-4 w-4" /> Prendre rendez-vous
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/contact">
              <ArrowLeft className="mr-2 h-4 w-4" /> Contactez-moi
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
