import type { Metadata } from "next"
import SkillsClient, { type SkillsTechnologies } from "./skills-client"
import { getSiteTechStack } from "@/lib/content/site-content"

export const metadata: Metadata = {
  title: "Compétences techniques | Portfolio",
  description:
    "Découvrez mes compétences techniques et mon expertise dans différents domaines du développement web et logiciel.",
}

export const dynamic = "force-dynamic"

export default async function SkillsPage() {
  const stack = await getSiteTechStack("skills")
  const technologies = stack as SkillsTechnologies
  return <SkillsClient technologies={technologies} />
}
