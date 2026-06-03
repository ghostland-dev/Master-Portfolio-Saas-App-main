import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"
import { ProfilePortrait } from "@/components/profile-portrait"
import Link from "next/link"

const values = [
  { label: "Qualité", desc: "Code propre, testé et maintenable sur la durée." },
  { label: "Innovation", desc: "Veille technologique et solutions adaptées au contexte." },
  { label: "Communication", desc: "Transparence et alignement tout au long du projet." },
  { label: "Pragmatisme", desc: "La bonne solution pour le besoin réel, pas la sur-ingénierie." },
]

const timeline = [
  {
    period: "2020 — Présent",
    title: "Développeur Full-Stack & DevOps Indépendant",
    description:
      "Conception d'applications web et mobiles, infrastructures cloud, pipelines CI/CD et conseil en architecture logicielle.",
  },
  {
    period: "2017 — 2020",
    title: "Lead Developer",
    company: "Tech Innovations Inc.",
    description:
      "Direction d'équipe, architecture microservices, pratiques DevOps et applications web à forte charge.",
  },
  {
    period: "2014 — 2017",
    title: "Développeur Full-Stack",
    company: "Digital Solutions",
    description: "Applications React/Node.js, APIs RESTful, optimisation bases de données.",
  },
  {
    period: "2012 — 2014",
    title: "Développeur Front-End",
    company: "WebCreative Agency",
    description: "Interfaces modernes, intégration de maquettes et performance front-end.",
  },
]

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Qui suis-je */}
      <section className="relative border-b border-border/50 overflow-hidden">
        <div className="absolute inset-0 hero-mesh -z-10" aria-hidden />
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <Badge className="px-3 py-1.5 text-sm badge-gradient">Qui suis-je</Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Ismail MOUYAHADA
                <span className="block text-gradient-brand mt-2 text-2xl md:text-3xl font-semibold">
                  DevOps & Full-Stack Developer
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Je transforme des idées en produits numériques fiables — avec une expertise technique solide et une
                attention constante aux enjeux métier de mes clients.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="shadow-lg shadow-primary/15">
                  <Link href="/appointment">
                    <Icon name="Calendar" size="sm" className="mr-2" aria-hidden={true} />
                    Prendre rendez-vous
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="border-primary/30">
                  <Link href="/contact">
                    <Icon name="Mail" size="sm" className="mr-2" aria-hidden={true} />
                    Me contacter
                  </Link>
                </Button>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <ProfilePortrait variant="hero" priority className="lg:mr-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Présentation */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-3xl font-bold">Mon approche</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Développeur full-stack et DevOps, je conçois des solutions logicielles performantes et évolutives. Fort
                de plus de 10 ans d&apos;expérience — de la startup aux grands comptes — je maîtrise un large éventail
                de technologies pour choisir l&apos;approche la plus pertinente à chaque projet.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Au-delà de la technique, je m&apos;efforce de comprendre les objectifs business pour livrer une vraie
                valeur : code de qualité, bonnes pratiques, et livrables alignés avec vos priorités.
              </p>

              <div className="pt-4">
                <h3 className="text-xl font-semibold mb-5">Mes valeurs</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {values.map((v) => (
                    <div
                      key={v.label}
                      className="rounded-xl border border-border/60 bg-card/50 p-4 card-elevated flex gap-3"
                    >
                      <Badge variant="outline" className="shrink-0 h-fit border-primary/30 text-primary">
                        {v.label}
                      </Badge>
                      <span className="text-muted-foreground text-sm leading-relaxed">{v.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <Card className="card-elevated overflow-hidden">
                <CardContent className="p-6 space-y-5">
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" size="icon" asChild className="border-primary/25">
                      <a
                        href="https://github.com/Ismail-Mouyahada"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                      >
                        <Icon name="Github" className="h-5 w-5" aria-hidden={true} />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild className="border-primary/25">
                      <a
                        href="https://www.linkedin.com/in/ismail-mouyahada"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                      >
                        <Icon name="Linkedin" className="h-5 w-5" aria-hidden={true} />
                      </a>
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <Button asChild className="w-full">
                      <Link href="/contact">
                        <Icon name="Mail" size="sm" className="mr-2" aria-hidden={true} />
                        Me contacter
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full border-primary/30">
                      <Link href="/portfolio">
                        <Icon name="FolderKanban" size="sm" className="mr-2" aria-hidden={true} />
                        Voir mon portfolio
                      </Link>
                    </Button>
                    <Button variant="secondary" asChild className="w-full">
                      <Link href="/appointment">
                        <Icon name="Calendar" size="sm" className="mr-2" aria-hidden={true} />
                        Prendre rendez-vous
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-xl section-navy p-6 text-white shadow-xl">
                <p className="text-sky-200/90 text-sm font-medium mb-2">Disponible pour</p>
                <ul className="space-y-2 text-sm text-white/90">
                  <li className="flex items-center gap-2">
                    <Icon name="Check" className="h-4 w-4 text-sky-400" aria-hidden={true} />
                    Missions full-stack & DevOps
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" className="h-4 w-4 text-sky-400" aria-hidden={true} />
                    Audit & refonte d&apos;applications
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" className="h-4 w-4 text-sky-400" aria-hidden={true} />
                    Accompagnement cloud & CI/CD
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parcours */}
      <section className="py-16 md:py-24 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 mb-12">
            <Badge variant="outline" className="border-primary/30 text-primary">
              Parcours
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Expérience professionnelle</h2>
          </div>
          <div className="relative border-l-2 border-primary/30 ml-4 md:mx-auto md:max-w-3xl pl-8 space-y-12">
            {timeline.map((item, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[42px] h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <div className="h-3 w-3 rounded-full bg-background" />
                </div>
                <span className="text-sm text-primary font-medium">{item.period}</span>
                <h3 className="text-xl font-semibold mt-1">{item.title}</h3>
                {item.company && <p className="text-muted-foreground">{item.company}</p>}
                <p className="mt-2 text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl section-navy px-8 py-12 md:py-14 text-center text-white shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Un projet en tête ?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
              Discutons de vos objectifs et voyons comment je peux vous accompagner.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="bg-white text-[hsl(var(--navy-deep))] hover:bg-white/90">
                <Link href="/appointment">
                  <Icon name="Calendar" size="sm" className="mr-2" aria-hidden={true} />
                  Prendre rendez-vous
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/contact">
                  <Icon name="Mail" size="sm" className="mr-2" aria-hidden={true} />
                  Me contacter
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
