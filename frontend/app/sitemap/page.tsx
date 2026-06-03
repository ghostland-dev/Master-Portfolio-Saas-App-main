import type { Metadata } from "next"
import Link from "next/link"
import { Icon } from "@/components/ui/icon"

export const metadata: Metadata = {
  title: "Plan du site | Ismail MOUYAHADA",
  description: "Plan du site web d'Ismail MOUYAHADA, développeur Full-Stack et DevOps.",
}

const siteMap = [
  {
    category: "Pages principales",
    links: [
      { name: "Accueil", path: "/", icon: "Home" },
      { name: "Qui suis-je", path: "/about", icon: "User" },
      { name: "Services", path: "/services", icon: "Briefcase" },
      { name: "Portfolio", path: "/portfolio", icon: "FolderKanban" },
      { name: "Compétences", path: "/skills", icon: "Award" },
      { name: "Méthodologie", path: "/methodology", icon: "GitMerge" },
      { name: "Blog", path: "/blog", icon: "FileText" },
      { name: "Témoignages", path: "/testimonials", icon: "MessageSquareQuote" },
      { name: "Contact", path: "/contact", icon: "Mail" },
      { name: "Ressources", path: "/resources", icon: "Library" },
      { name: "Tarifs", path: "/pricing", icon: "Tag" },
      { name: "FAQ", path: "/faq", icon: "CircleHelp" },
      { name: "Prendre rendez-vous", path: "/appointment", icon: "CalendarDays" },
    ],
  },
  {
    category: "Outils",
    links: [
      { name: "Tous les outils", path: "/tools", icon: "Wrench" },
      { name: "Sélecteur de technologies", path: "/tools/technology-selector", icon: "Filter" },
      { name: "Calculateur de performance", path: "/tools/performance-calculator", icon: "Calculator" },
      { name: "Checklist DevOps", path: "/tools/devops-checklist", icon: "CheckSquare" },
      { name: "Planificateur de projet", path: "/tools/project-planner", icon: "Calendar" },
      { name: "Simulateur de budget", path: "/tools/budget-simulator", icon: "DollarSign" },
    ],
  },
  {
    category: "Espace client",
    links: [
      { name: "Connexion", path: "/login", icon: "LogIn" },
      { name: "Inscription", path: "/signup", icon: "UserPlus" },
      { name: "Mot de passe oublié", path: "/forgot-password", icon: "Key" },
      { name: "Accès refusé", path: "/unauthorized", icon: "ShieldAlert" },
      { name: "Tableau de bord", path: "/dashboard", icon: "LayoutDashboard" },
      { name: "Profil", path: "/dashboard/profile", icon: "User" },
      { name: "Projets", path: "/dashboard/projects", icon: "FolderKanban" },
      { name: "Nouveau projet", path: "/dashboard/projects/new", icon: "PlusCircle" },
      { name: "Messages", path: "/dashboard/messages", icon: "MessageSquare" },
      { name: "Composer un message", path: "/dashboard/messages/compose", icon: "PenLine" },
      { name: "Factures", path: "/dashboard/invoices", icon: "Receipt" },
      { name: "Clients", path: "/dashboard/clients", icon: "Users" },
      { name: "Fichiers", path: "/dashboard/files", icon: "FileStack" },
      { name: "Analytics", path: "/dashboard/analytics", icon: "TrendingUp" },
      { name: "Rapports", path: "/dashboard/reports", icon: "FileBarChart" },
      { name: "Support", path: "/dashboard/support", icon: "LifeBuoy" },
      { name: "Paramètres", path: "/dashboard/settings", icon: "Settings" },
    ],
  },
  {
    category: "Informations légales",
    links: [
      { name: "Conditions d'utilisation", path: "/terms", icon: "FileText" },
      { name: "Politique de confidentialité", path: "/privacy", icon: "Shield" },
      { name: "Politique de cookies", path: "/cookies", icon: "Cookie" },
      { name: "Plan du site", path: "/sitemap", icon: "Map" },
    ],
  },
]

export default function SitemapPage() {
  return (
    <div className="container py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">Plan du Site</h1>
        <p className="text-xl text-muted-foreground">Retrouvez facilement toutes les pages disponibles sur ce site.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {siteMap.map((category, index) => (
          <div key={index} className="space-y-4">
            <h2 className="text-xl font-bold border-b pb-2">{category.category}</h2>
            <ul className="space-y-2">
              {category.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link
                    href={link.path}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Icon name={link.icon as any} size="sm" aria-hidden={true} />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
