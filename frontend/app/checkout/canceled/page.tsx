import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import Link from "next/link"

export default function CheckoutCanceledPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto">
            <Icon name="AlertCircle" className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold">Paiement Annulé</h1>
          <p className="text-muted-foreground">
            Le processus de paiement a été interrompu. Aucune somme n'a été débitée de votre compte.
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/pricing">Réessayer</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
