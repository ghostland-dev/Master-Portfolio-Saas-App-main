import HomeClient from "./home-client"
import { getSiteHomeSkills, getSitePortfolioList, getSiteServices } from "@/lib/content/site-content"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [servicesRows, portfolioRows, skillRows] = await Promise.all([
    getSiteServices(),
    getSitePortfolioList(),
    getSiteHomeSkills(),
  ])

  const homeServices = servicesRows.slice(0, 4).map((s) => ({
    icon: s.home_icon_lucide,
    title: s.title,
    description: s.description,
    color: s.home_card_gradient,
  }))

  const homeProjects = portfolioRows.slice(0, 3).map((p) => ({
    id: p.slug,
    title: p.list_title,
    description: p.list_description || "",
    image: p.image_url || "/placeholder.svg",
    icon: p.card_icon || "Layers",
    tags: (p.technologies || []).slice(0, 8),
  }))

  const homeSkills = skillRows.map((s) => ({ name: s.name, level: s.level }))

  return (
    <HomeClient homeServices={homeServices} homeProjects={homeProjects} homeSkills={homeSkills} />
  )
}
