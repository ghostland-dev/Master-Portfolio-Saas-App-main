import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CheckCircle, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { firstSegment, resolvePageParams } from "@/lib/utils/next-params"
import { getSiteServiceBySlug } from "@/lib/content/site-content"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const { id: raw } = await resolvePageParams(params)
  const id = firstSegment(raw).trim().toLowerCase()
  const service = await getSiteServiceBySlug(id)

  if (!service) {
    return {
      title: "Service non trouvé",
      description: "Le service demandé n'existe pas",
    }
  }

  return {
    title: `${service.title} | Portfolio de Développeur Web Full-Stack`,
    description: service.description,
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const { id: raw } = await resolvePageParams(params)
  const id = firstSegment(raw).trim().toLowerCase()
  const row = await getSiteServiceBySlug(id)

  if (!row) {
    notFound()
  }

  const service = {
    id: row.slug,
    title: row.title,
    description: row.description,
    longDescription: row.long_description || row.description,
    image: row.detail_image || "/placeholder.svg",
    color: row.color,
    features: row.features,
    tools: row.showcase_tools || [],
    projects: row.showcase_projects || [],
  }

  const colorClasses = {
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    purple: "bg-purple-500 text-white",
    orange: "bg-orange-500 text-white",
  }

  const bgColorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20",
    green: "bg-green-50 dark:bg-green-900/20",
    purple: "bg-purple-50 dark:bg-purple-900/20",
    orange: "bg-orange-50 dark:bg-orange-900/20",
  }

  const borderColorClasses = {
    blue: "border-blue-200 dark:border-blue-800",
    green: "border-green-200 dark:border-green-800",
    purple: "border-purple-200 dark:border-purple-800",
    orange: "border-orange-200 dark:border-orange-800",
  }

  const textColorClasses = {
    blue: "text-blue-700 dark:text-blue-300",
    green: "text-green-700 dark:text-green-300",
    purple: "text-purple-700 dark:text-purple-300",
    orange: "text-orange-700 dark:text-orange-300",
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container px-4 md:px-6">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/services" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux services
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className={`mb-4 ${colorClasses[service.color as keyof typeof colorClasses]}`}>{service.id}</Badge>
              <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{service.longDescription}</p>
              <Button asChild className={colorClasses[service.color as keyof typeof colorClasses]}>
                <Link href="/contact" className="flex items-center">
                  Discuter de votre projet
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src={service.image || "/placeholder.svg?height=300&width=600"}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div
          className={`p-8 rounded-lg mb-12 ${bgColorClasses[service.color as keyof typeof bgColorClasses]} ${borderColorClasses[service.color as keyof typeof borderColorClasses]} border`}
        >
          <h2 className="text-2xl font-bold mb-6">Caractéristiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle
                  className={`h-5 w-5 mt-0.5 ${textColorClasses[service.color as keyof typeof textColorClasses]}`}
                />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Outils et technologies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {service.tools.map((tool, index) => (
              <Card key={index} className="border hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="relative h-16 w-16 mb-4">
                    {tool.darkIcon ? (
                      <>
                        <Image
                          src={tool.icon || "/placeholder.svg"}
                          alt={tool.name}
                          fill
                          className="object-contain dark:hidden"
                        />
                        <Image
                          src={tool.darkIcon || "/placeholder.svg"}
                          alt={tool.name}
                          fill
                          className="object-contain hidden dark:block"
                        />
                      </>
                    ) : (
                      <Image src={tool.icon || "/placeholder.svg"} alt={tool.name} fill className="object-contain" />
                    )}
                  </div>
                  <h3 className="font-medium mb-1">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Projets réalisés</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.projects.map((project, index) => (
              <Card
                key={index}
                className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48">
                  <Image src={project.image || "/placeholder.svg"} alt={project.name} fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{project.name}</h3>
                  <p className="text-muted-foreground">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Prêt à démarrer votre projet ?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Discutons de vos besoins spécifiques et voyons comment je peux vous aider à atteindre vos objectifs.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className={colorClasses[service.color as keyof typeof colorClasses]}>
              <Link href="/contact">
                Prendre contact
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/portfolio">Voir mes réalisations</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
