import { notFound } from "next/navigation"
import { firstSegment, resolvePageParams } from "@/lib/utils/next-params"
import { getSitePortfolioBySlug, getSitePortfolioList } from "@/lib/content/site-content"
import PortfolioDetailClient, { type PortfolioDetailProject, type PortfolioRelatedCard } from "./portfolio-detail-client"

export const dynamic = "force-dynamic"

function buildDetail(row: Awaited<ReturnType<typeof getSitePortfolioBySlug>>): PortfolioDetailProject | null {
  if (!row) return null
  const d = row.detail || {}
  const images =
    Array.isArray(d.images) && d.images.length > 0
      ? d.images
      : row.image_url
        ? [row.image_url]
        : ["/placeholder.svg"]

  return {
    slug: row.slug,
    title: row.list_title,
    client: typeof d.client === "string" ? d.client : "—",
    date: typeof d.date === "string" ? d.date : "—",
    description: row.list_description || "",
    technologies: row.technologies || [],
    images: images as string[],
    liveUrl: (d.liveUrl as string | null | undefined) ?? null,
    githubUrl: (d.githubUrl as string | null | undefined) ?? null,
  }
}

export default async function PortfolioProjectPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const { id: raw } = await resolvePageParams(params)
  const slug = firstSegment(raw).trim().toLowerCase()
  const row = await getSitePortfolioBySlug(slug)
  const project = buildDetail(row)
  if (!project) {
    notFound()
  }

  const all = await getSitePortfolioList()
  const related: PortfolioRelatedCard[] = all
    .filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.list_title,
      description: p.list_description || "",
      image: p.image_url || "/placeholder.svg",
    }))

  return <PortfolioDetailClient project={project} related={related} />
}
