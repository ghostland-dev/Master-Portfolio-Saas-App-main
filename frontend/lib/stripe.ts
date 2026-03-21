import Stripe from 'stripe'

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia' as any,
      typescript: true,
    })
  : null as any // Permettre le build même sans clé (sera vérifié au runtime)

export const stripeConfig = {
  plans: {
    basic: {
      name: 'Basique',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || '',
      price: 15,
    },
    pro: {
      name: 'Pro',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || '',
      price: 49,
    },
    enterprise: {
      name: 'Entreprise',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE || '',
      price: 199,
    },
  },
}
