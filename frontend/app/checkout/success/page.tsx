import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <Icon name="CheckCircle2" className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold">Paiement Réussi !</h1>
          <p className="text-muted-foreground">
            Merci pour votre confiance. Votre abonnement est désormais actif. Vous allez recevoir un email de confirmation sous peu.
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/dashboard">Accéder au Dashboard</Link>
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
