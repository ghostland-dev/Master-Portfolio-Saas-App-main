import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get('stripe-signature')!

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Gérer l'événement
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSession = event.data.object as any
      if (checkoutSession.mode === 'subscription') {
        const subscriptionId = checkoutSession.subscription
        const userId = checkoutSession.metadata.userId
        
        // Mettre à jour le statut dans Supabase
        await supabase
          .from('profiles')
          .update({ subscription_status: 'active' })
          .eq('id', userId)

        // Optionnel : Enregistrer les détails de l'abonnement
        const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any
        await supabase.from('subscriptions').insert({
          id: subscription.id,
          user_id: userId,
          status: subscription.status,
          price_id: subscription.items.data[0].price.id,
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
      }
      break

    case 'customer.subscription.deleted':
      const deletedSub = event.data.object as any
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('id', deletedSub.id)
        .single()

      if (sub) {
        await supabase
          .from('profiles')
          .update({ subscription_status: 'none' })
          .eq('id', sub.user_id)
        
        await supabase.from('subscriptions').delete().eq('id', deletedSub.id)
      }
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
