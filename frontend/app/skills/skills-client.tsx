"use client"

import type { ReactNode } from "react"
import { TechGrid } from "@/components/tech/tech-grid"
import { Code, Layers, Server, Database, Cloud, TestTube, Wrench } from "lucide-react"
import type { TechItem } from "@/lib/content/site-content"

export type SkillsTechnologies = Record<string, TechItem[]>

const sectionConfig: { key: keyof SkillsTechnologies; title: string; icon: ReactNode }[] = [
  { key: "languages", title: "Langages de programmation", icon: <Code className="h-6 w-6" /> },
  { key: "frontend", title: "Développement Frontend", icon: <Layers className="h-6 w-6" /> },
  { key: "backend", title: "Développement Backend", icon: <Server className="h-6 w-6" /> },
  { key: "database", title: "Bases de données", icon: <Database className="h-6 w-6" /> },
  { key: "devops", title: "DevOps & Cloud", icon: <Cloud className="h-6 w-6" /> },
  { key: "testing", title: "Tests & Qualité", icon: <TestTube className="h-6 w-6" /> },
  { key: "tools", title: "Outils & Environnements", icon: <Wrench className="h-6 w-6" /> },
]

export default function SkillsClient({ technologies }: { technologies: SkillsTechnologies }) {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Compétences techniques</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Une expertise approfondie dans un large éventail de technologies modernes pour répondre à tous vos besoins de
          développement.
        </p>
      </div>

      <div className="space-y-16">
        {sectionConfig.map(({ key, title, icon }) => {
          const items = technologies[key] ?? []
          if (items.length === 0) return null
          return (
            <section key={key}>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-primary/10 text-primary p-2 rounded-md mr-3">{icon}</span>
                {title}
              </h2>
              <TechGrid technologies={items} iconSize={48} />
            </section>
          )
        })}
      </div>
    </div>
  )
}
