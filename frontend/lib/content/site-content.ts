import { supabase } from "@/lib/supabase"

function asRows(data: unknown): Record<string, unknown>[] {
  return Array.isArray(data) ? (data as Record<string, unknown>[]) : []
}

export type SitePortfolioRow = {
  id: string
  slug: string
  sort_order: number
  list_title: string
  list_description: string | null
  image_url: string | null
  category: string
  technologies: string[]
  card_icon: string | null
  detail: SitePortfolioDetail | null
}

export type SitePortfolioDetail = {
  client?: string
  date?: string
  images?: string[]
  liveUrl?: string | null
  githubUrl?: string | null
  [key: string]: unknown
}

export type ServiceShowcaseTool = {
  name: string
  description: string
  icon?: string
  darkIcon?: string
}

export type ServiceShowcaseProject = {
  name: string
  description: string
  image?: string
}

export type SiteServiceRow = {
  slug: string
  sort_order: number
  title: string
  description: string
  color: string
  icon_lucide: string
  home_icon_lucide: string
  home_card_gradient: string
  features: string[]
  use_cases: { title: string; description: string; icon: string }[]
  long_description?: string | null
  detail_image?: string | null
  showcase_tools?: ServiceShowcaseTool[]
  showcase_projects?: ServiceShowcaseProject[]
}

export type SiteServiceToolRow = {
  id: string
  sort_order: number
  title: string
  description: string
  image_url: string | null
  badge_text: string | null
  badge_color: string
  icon_lucide: string
  link: string
  features: { title: string; description: string; icon: string; iconClass?: string }[]
}

export type SiteResourceRow = {
  id: string
  section: string
  sort_order: number
  title: string
  description: string
  url: string | null
  category: string | null
  icon_slug: string | null
  meta: Record<string, unknown>
}

export type SiteHomeSkillRow = {
  name: string
  level: number
  sort_order: number
}

export type TechItem = { name: string; description: string }

function parseJsonArray<T>(raw: unknown, fallback: T[]): T[] {
  if (Array.isArray(raw)) return raw as T[]
  return fallback
}

function parseServiceRow(row: Record<string, unknown>): SiteServiceRow {
  return {
    slug: String(row.slug),
    sort_order: Number(row.sort_order ?? 0),
    title: String(row.title),
    description: String(row.description),
    color: String(row.color),
    icon_lucide: String(row.icon_lucide),
    home_icon_lucide: String(row.home_icon_lucide),
    home_card_gradient: String(row.home_card_gradient),
    features: parseJsonArray<string>(row.features, []),
    use_cases: parseJsonArray(row.use_cases, []),
  }
}

export async function getSitePortfolioList(): Promise<SitePortfolioRow[]> {
  const { data, error } = await supabase
    .from("site_portfolio")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("[site-content] getSitePortfolioList", error.message)
    return []
  }

  return asRows(data).map((r) => ({
    ...(r as unknown as SitePortfolioRow),
    technologies: Array.isArray(r.technologies) ? (r.technologies as string[]) : [],
    detail: (r.detail as SitePortfolioDetail) || null,
  }))
}

export async function getSitePortfolioBySlug(slug: string): Promise<SitePortfolioRow | null> {
  const { data, error } = await supabase
    .from("site_portfolio")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle()

  if (error) {
    console.error("[site-content] getSitePortfolioBySlug", error.message)
    return null
  }
  if (!data) return null

  const r = data as Record<string, unknown>
  return {
    ...(r as unknown as SitePortfolioRow),
    technologies: Array.isArray(r.technologies) ? (r.technologies as string[]) : [],
    detail: (r.detail as SitePortfolioDetail) || null,
  }
}

export async function getSiteServices(): Promise<SiteServiceRow[]> {
  const { data, error } = await supabase.from("site_services").select("*").eq("published", true).order("sort_order")

  if (error) {
    console.error("[site-content] getSiteServices", error.message)
    return []
  }
  return asRows(data).map((r) => parseServiceRow(r))
}

export async function getSiteServiceBySlug(slug: string): Promise<SiteServiceRow | null> {
  const { data, error } = await supabase
    .from("site_services")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle()

  if (error) {
    console.error("[site-content] getSiteServiceBySlug", error.message)
    return null
  }
  if (!data) return null
  return parseServiceRow(data as Record<string, unknown>)
}

export async function getSiteServiceTools(): Promise<SiteServiceToolRow[]> {
  const { data, error } = await supabase
    .from("site_service_tools")
    .select("*")
    .eq("published", true)
    .order("sort_order")

  if (error) {
    console.error("[site-content] getSiteServiceTools", error.message)
    return []
  }

  return asRows(data).map((row) => ({
    id: String(row.id),
    sort_order: Number(row.sort_order ?? 0),
    title: String(row.title),
    description: String(row.description),
    image_url: row.image_url ? String(row.image_url) : null,
    badge_text: row.badge_text != null ? String(row.badge_text) : null,
    badge_color: String(row.badge_color),
    icon_lucide: String(row.icon_lucide),
    link: String(row.link),
    features: parseJsonArray(row.features, []),
  }))
}

export async function getSiteResourcesBySection(): Promise<Record<string, SiteResourceRow[]>> {
  const { data, error } = await supabase
    .from("site_resources")
    .select("*")
    .eq("published", true)
    .order("section")
    .order("sort_order")

  if (error) {
    console.error("[site-content] getSiteResourcesBySection", error.message)
    return {}
  }

  const out: Record<string, SiteResourceRow[]> = {}
  for (const r of asRows(data)) {
    const section = String(r.section)
    if (!out[section]) out[section] = []
    out[section].push({
      id: String(r.id),
      section,
      sort_order: Number(r.sort_order ?? 0),
      title: String(r.title),
      description: String(r.description),
      url: r.url != null ? String(r.url) : null,
      category: r.category != null ? String(r.category) : null,
      icon_slug: r.icon_slug != null ? String(r.icon_slug) : null,
      meta: (r.meta && typeof r.meta === "object" ? r.meta : {}) as Record<string, unknown>,
    })
  }
  return out
}

/** page = 'services' | 'skills' */
export async function getSiteTechStack(page: "services" | "skills"): Promise<Record<string, TechItem[]>> {
  console.log(`[site-content] getSiteTechStack fetching for page: ${page}`)
  const { data, error } = await supabase.from("site_tech_stack").select("*").eq("page", page)

  if (error) {
    console.error(`[site-content] getSiteTechStack error for page ${page}:`, error.message)
    if (error.details) console.error("[site-content] details:", error.details)
    if (error.hint) console.error("[site-content] hint:", error.hint)
    return {}
  }

  console.log(`[site-content] getSiteTechStack got ${data?.length ?? 0} rows for page ${page}`)
  const out: Record<string, TechItem[]> = {}
  for (const r of asRows(data)) {
    const category = String(r.category)
    out[category] = parseJsonArray<TechItem>(r.items, [])
  }
  return out
}

export async function getSiteHomeSkills(): Promise<SiteHomeSkillRow[]> {
  const { data, error } = await supabase
    .from("site_home_skills")
    .select("name, level, sort_order")
    .eq("published", true)
    .order("sort_order")

  if (error) {
    console.error("[site-content] getSiteHomeSkills", error.message)
    return []
  }

  return asRows(data).map((r) => ({
    name: String(r.name),
    level: Number(r.level),
    sort_order: Number(r.sort_order ?? 0),
  }))
}
