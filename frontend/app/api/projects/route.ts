import { getSitePortfolioList } from "@/lib/content/site-content"

export async function GET() {
  try {
    const projects = await getSitePortfolioList()
    return Response.json(projects)
  } catch (error) {
    console.error("Erreur API projets:", error)
    return Response.json({ message: "Erreur serveur", error: (error as Error).message }, { status: 500 })
  }
}
