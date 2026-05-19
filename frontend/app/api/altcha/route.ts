import { NextResponse } from "next/server"
import { createHmac, randomBytes } from "crypto"

export const dynamic = "force-dynamic"

// Use a secret from environment variables or a fallback for development
const HMAC_KEY = process.env.ALTCHA_HMAC_KEY || "fallback-secret-for-dev-change-in-prod-12345678"

export async function GET() {
  const salt = randomBytes(16).toString("hex")
  const number = Math.floor(Math.random() * 100000) // Complexity
  const algorithm = "SHA-256"

  // Create challenge
  const challenge = createHmac("sha256", HMAC_KEY)
    .update(`${salt}${number}`)
    .digest("hex")

  return NextResponse.json({
    algorithm,
    challenge,
    salt,
    signature: createHmac("sha256", HMAC_KEY).update(challenge).digest("hex"),
  })
}
