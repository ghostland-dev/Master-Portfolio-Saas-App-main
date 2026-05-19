import { createHmac } from "crypto"

// Use a secret from environment variables or a fallback for development
const HMAC_KEY = process.env.ALTCHA_HMAC_KEY || "fallback-secret-for-dev-change-in-prod-12345678"

/**
 * Server-side verification helper
 */
export async function verifyAltcha(payload: string): Promise<boolean> {
  try {
    const data = JSON.parse(Buffer.from(payload, "base64").toString())
    const { algorithm, challenge, number, salt, signature } = data

    if (algorithm !== "SHA-256") return false

    // Verify signature
    const expectedSignature = createHmac("sha256", HMAC_KEY).update(challenge).digest("hex")
    if (signature !== expectedSignature) return false

    // Verify challenge
    const expectedChallenge = createHmac("sha256", HMAC_KEY)
      .update(`${salt}${number}`)
      .digest("hex")

    return challenge === expectedChallenge
  } catch (e) {
    return false
  }
}
