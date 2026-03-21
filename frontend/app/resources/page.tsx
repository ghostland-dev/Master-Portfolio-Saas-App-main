import type { Metadata } from "next"
import ResourcesClient, { type ResourcesBundle } from "./resources-client"
import { getSiteResourcesBySection, type SiteResourceRow } from "@/lib/content/site-content"

export const metadata: Metadata = {
  title: "Ressources | Portfolio",
  description: "Ressources utiles pour le développement web, DevOps et les technologies modernes.",
}

export const dynamic = "force-dynamic"

function bundleFromRows(by: Record<string, SiteResourceRow[]>): ResourcesBundle {
  const list = (key: string) => by[key] ?? []

  return {
    documentation: list("documentation").map((r) => ({
      title: r.title,
      description: r.description,
      url: r.url || "#",
      category: r.category || undefined,
      difficulty: typeof r.meta?.difficulty === "string" ? r.meta.difficulty : undefined,
      icon: r.icon_slug || undefined,
    })),
    tutorials: list("tutorials").map((r) => ({
      title: r.title,
      description: r.description,
      url: r.url || "#",
      category: r.category || undefined,
      difficulty: typeof r.meta?.difficulty === "string" ? r.meta.difficulty : undefined,
      duration: typeof r.meta?.duration === "string" ? r.meta.duration : undefined,
      icon: r.icon_slug || undefined,
    })),
    tools: list("tools").map((r) => ({
      title: r.title,
      description: r.description,
      url: r.url || "#",
      category: r.category || undefined,
      type: typeof r.meta?.type === "string" ? r.meta.type : undefined,
      icon: r.icon_slug || undefined,
    })),
    templates: list("templates").map((r) => ({
      title: r.title,
      description: r.description,
      url: r.url || "#",
      category: r.category || undefined,
      stars: typeof r.meta?.stars === "number" ? r.meta.stars : undefined,
      icon: r.icon_slug || undefined,
    })),
    cheatsheets: list("cheatsheets").map((r) => ({
      title: r.title,
      description: r.description,
      url: r.url || "#",
      category: r.category || undefined,
      icon: r.icon_slug || undefined,
    })),
  }
}

export default async function ResourcesPage() {
  const by = await getSiteResourcesBySection()
  return <ResourcesClient resources={bundleFromRows(by)} />
}
