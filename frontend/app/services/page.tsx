import ServicesClientPage from "./ServicesClientPage"
import type { Metadata } from "next"
import { getSiteServiceTools, getSiteServices, getSiteTechStack } from "@/lib/content/site-content"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Services | Portfolio de Développeur Web Full-Stack",
  description:
    "Découvrez les services de développement web full-stack, incluant le développement front-end, back-end, DevOps et bases de données.",
}

export default async function ServicesPage() {
  const [services, technologies, tools] = await Promise.all([
    getSiteServices(),
    getSiteTechStack("services"),
    getSiteServiceTools(),
  ])
  return <ServicesClientPage services={services} technologies={technologies} tools={tools} />
}

