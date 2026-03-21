import { getSiteHomeSkills, getSiteTechStack } from "@/lib/content/site-content"

export async function GET() {
  try {
    const [stack, homeSkills] = await Promise.all([getSiteTechStack("skills"), getSiteHomeSkills()])
    return Response.json({ stack, homeSkills })
  } catch (error) {
    console.error("Erreur API compétences:", error)
    return Response.json({ message: "Erreur serveur", error: (error as Error).message }, { status: 500 })
  }
}
