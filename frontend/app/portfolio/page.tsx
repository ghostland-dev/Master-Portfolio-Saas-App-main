import type { Metadata } from "next"
import PortfolioClient from "./portfolio-client"
import { getSitePortfolioList } from "@/lib/content/site-content"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Portfolio | Projets récents",
  description: "Découvrez mes projets récents et les technologies utilisées.",
}

export default async function PortfolioPage() {
  const rows = await getSitePortfolioList()
  const projects = rows.map((p) => ({
    slug: p.slug,
    title: p.list_title,
    description: p.list_description || "",
    image: p.image_url || "/placeholder.svg",
    category: p.category,
    technologies: p.technologies || [],
  }))

  return <PortfolioClient projects={projects} />
}
