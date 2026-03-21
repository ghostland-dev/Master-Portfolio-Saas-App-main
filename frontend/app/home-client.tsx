"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Icon } from "@/components/ui/icon"
import { CustomImage } from "@/components/ui/image"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs-stable"
import { HeroWaveCanvas } from "@/components/hero-wave-canvas"

export type HomeClientProps = {
  homeServices: { icon: string; title: string; description: string; color: string }[]
  homeProjects: { id: string; title: string; description: string; image: string; icon: string; tags: string[] }[]
  homeSkills: { name: string; level: number }[]
}

export default function HomeClient({ homeServices, homeProjects, homeSkills }: HomeClientProps) {
  const services = homeServices
  const projects = homeProjects
  const skills = homeSkills
  return (
    <div className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] opacity-20 dark:opacity-10">
        <div className="absolute top-0 right-0 h-full w-full rounded-full bg-gradient-to-bl from-primary/30 to-transparent blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] opacity-20 dark:opacity-10">
        <div className="absolute bottom-0 left-0 h-full w-full rounded-full bg-gradient-to-tr from-primary/30 to-transparent blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 lg:pt-32 pb-16 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="inline-flex">
                <Badge className="px-3 py-1.5 text-sm bg-primary/10 border-primary/20 text-primary font-medium">
                  Développeur Full-Stack & DevOps
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Ismail MOUYAHADA
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70 mt-2">
                  Solutions numériques sur mesure
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] mx-auto lg:mx-0">
                Transformez vos idées en solutions robustes et évolutives. Expertise en développement full-stack et
                pratiques DevOps pour des applications performantes.
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {["React", "Node.js", "AWS", "Docker", "Kubernetes", "CI/CD"].map((tech) => (
                  <Badge key={tech} variant="outline" className="px-3 py-1 text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="relative overflow-hidden group">
                  <Link href="/appointment">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 group-hover:animate-shimmer"></span>
                    <Icon name="Calendar" size="sm" className="mr-2" aria-hidden={true} /> Prendre rendez-vous
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="group">
                  <Link href="/portfolio">
                    Voir mes projets{" "}
                    <Icon
                      name="ArrowRight"
                      size="sm"
                      className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden={true}
                    />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <ModeToggle variant="switch" />
                <span className="text-sm text-muted-foreground">Préférez-vous le mode sombre ?</span>
              </div>
            </div>

            <div className="flex-1 flex justify-center lg:justify-end">
              <div
                className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl bg-muted/20 dark:bg-muted/10"
                aria-hidden
              >
                <HeroWaveCanvas />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <Badge className="px-3 py-1.5 text-sm bg-gradient-to-r from-primary/80 to-primary text-primary-foreground font-medium">
              Services
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Une expertise complète</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[800px] mx-auto">
              Une gamme complète de services couvrant l'ensemble du cycle de vie des projets informatiques
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {services.map((service) => (
              <Card key={service.title} className="h-full border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden group">
                <CardContent className="p-6 flex flex-col h-full">
                  <div
                    className={`p-3 rounded-xl mb-4 ${service.color} group-hover:scale-105 transition-transform duration-300`}
                  >
                    <Icon
                      name={service.icon as any}
                      size="xl"
                      variant="solid"
                      className="text-primary"
                      aria-hidden={true}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground flex-grow">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="group">
              <Link href="/services">
                Tous les services{" "}
                <Icon
                  name="ArrowRight"
                  size="sm"
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden={true}
                />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 md:py-24 bg-muted/30 dark:bg-muted/10">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <Badge className="px-3 py-1.5 text-sm bg-gradient-to-r from-primary/80 to-primary text-primary-foreground font-medium">
              Portfolio
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Projets Récents</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[800px] mx-auto">
              Découvrez quelques-uns de mes projets récents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden group h-full border border-border/50 hover:border-primary/50 transition-all duration-300">
                <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-full h-full">
                    <CustomImage
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110 image-filter"
                    />
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      name={project.icon as any}
                      size="sm"
                      variant="solid"
                      className="text-primary"
                      aria-hidden={true}
                    />
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="group w-full sm:w-auto justify-center sm:justify-start"
                  >
                    <Link href={`/portfolio/${project.id}`}>
                      Voir le projet{" "}
                      <Icon
                        name="ArrowRight"
                        size="sm"
                        className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden={true}
                      />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="group">
              <Link href="/portfolio">
                Tous les projets{" "}
                <Icon
                  name="ArrowRight"
                  size="sm"
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden={true}
                />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Skills & Tools Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <Badge className="px-3 py-1.5 text-sm bg-gradient-to-r from-primary/80 to-primary text-primary-foreground font-medium">
              Compétences
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Expertise Technique</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[800px] mx-auto">
              Des compétences variées pour répondre à tous vos besoins techniques
            </p>
          </div>

          <Tabs defaultValue="skills" className="w-full max-w-4xl mx-auto" stableId="skills-tabs">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="skills">Compétences</TabsTrigger>
              <TabsTrigger value="tools">Technologies</TabsTrigger>
            </TabsList>
            <TabsContent value="skills" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{skill.name}</h3>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button asChild variant="outline" className="group">
                  <Link href="/skills">
                    Toutes mes compétences{" "}
                    <Icon
                      name="ArrowRight"
                      size="sm"
                      className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden={true}
                    />
                  </Link>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="tools" className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {[
                  { name: "React", image: "/images/tech/react.svg" },
                  { name: "Vue.js", image: "/images/tech/vue.svg" },
                  { name: "Next.js", image: "/images/tech/nextjs.svg", darkImage: "/images/tech/nextjs-dark.svg" },
                  { name: "Nuxt", image: "/images/tech/nuxt.svg" },
                  { name: "Tailwind", image: "/images/tech/tailwind.svg" },
                  { name: "Material UI", image: "/images/tech/mui.svg" },
                ].map((tech) => (
                  <div
                    key={tech.name}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 group"
                  >
                    <div className="relative w-16 h-16 mb-3">
                      <div className="relative w-full h-full">
                        {tech.darkImage ? (
                          <>
                            <CustomImage
                              src={tech.image || "/placeholder.svg"}
                              alt={tech.name}
                              fill
                              className="object-contain transition-all duration-300 dark:opacity-0"
                            />
                            <CustomImage
                              src={tech.darkImage || "/placeholder.svg"}
                              alt={tech.name}
                              fill
                              className="object-contain transition-all duration-300 opacity-0 dark:opacity-100"
                            />
                          </>
                        ) : (
                          <CustomImage
                            src={tech.image || "/placeholder.svg"}
                            alt={tech.name}
                            fill
                            className="object-contain transition-all duration-300 group-hover:scale-110"
                          />
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium group-hover:text-primary transition-colors duration-300">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button asChild variant="outline" className="group">
                  <Link href="/tools">
                    Tous mes outils{" "}
                    <Icon
                      name="ArrowRight"
                      size="sm"
                      className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden={true}
                    />
                  </Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
        <div className="container px-4 md:px-6 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
            <Badge className="px-3 py-1.5 text-sm bg-gradient-to-r from-primary/80 to-primary text-primary-foreground font-medium">
              Collaboration
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Prêt à démarrer votre projet ?</h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Prenez rendez-vous pour discuter de vos besoins et découvrir comment je peux vous aider à atteindre vos
              objectifs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button asChild size="lg" className="relative overflow-hidden group">
                <Link href="/appointment">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 group-hover:animate-shimmer"></span>
                  <Icon name="Calendar" size="sm" className="mr-2" aria-hidden={true} /> Prendre rendez-vous
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="group">
                <Link href="/contact">
                  <Icon name="Mail" size="sm" className="mr-2" aria-hidden={true} /> Contactez-moi
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-muted/30 dark:bg-muted/10">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <Badge className="px-3 py-1.5 text-sm bg-gradient-to-r from-primary/80 to-primary text-primary-foreground font-medium">
              Témoignages
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Ce que disent mes clients</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[800px] mx-auto">
              Découvrez les retours d'expérience de clients satisfaits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sophie Martin",
                role: "CEO, TechStart",
                content:
                  "Ismail a transformé notre idée en une application web performante et intuitive. Son expertise technique et sa capacité à comprendre nos besoins ont été déterminantes pour le succès de notre projet.",
                avatar: "/placeholder.svg?height=80&width=80",
              },
              {
                name: "Thomas Dubois",
                role: "CTO, InnovGroup",
                content:
                  "La mise en place de notre infrastructure DevOps par Ismail a considérablement amélioré notre processus de développement. Nous avons réduit notre temps de déploiement de 70% et la qualité de notre code s'est nettement améliorée.",
                avatar: "/placeholder.svg?height=80&width=80",
              },
              {
                name: "Marie Leroy",
                role: "Product Manager, E-Shop Plus",
                content:
                  "Travailler avec Ismail a été une expérience exceptionnelle. Sa rigueur, sa réactivité et son expertise technique ont permis de livrer notre plateforme e-commerce dans les délais et avec une qualité irréprochable.",
                avatar: "/placeholder.svg?height=80&width=80",
              },
            ].map((testimonial) => (
              <Card key={testimonial.name} className="h-full border border-border/50 hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex-grow">
                    <Icon name="Quote" className="h-8 w-8 text-primary/40 mb-4" aria-hidden={true} />
                    <p className="text-muted-foreground italic mb-6">{testimonial.content}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <div className="relative w-full h-full">
                        <CustomImage
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="group">
              <Link href="/testimonials">
                Tous les témoignages{" "}
                <Icon
                  name="ArrowRight"
                  size="sm"
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden={true}
                />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
