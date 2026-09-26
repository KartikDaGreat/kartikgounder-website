import { SignJWT, jwtVerify } from "jose"

const getSecret = () =>
  new TextEncoder().encode(process.env.ASKOS_JWT_SECRET || "")

export async function signToken(
  name: string,
  expiresIn = "90d"
): Promise<string> {
  return new SignJWT({ name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret())
}

export async function verifyToken(
  token: string
): Promise<{ name: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (typeof payload.name !== "string") return null
    return { name: payload.name }
  } catch {
    return null
  }
}

export function extractToken(request: Request): string | null {
  const auth = request.headers.get("authorization")
  if (!auth?.startsWith("Bearer ")) return null
  return auth.slice(7)
}

export function verifyAdminKey(request: Request): boolean {
  return request.headers.get("x-admin-key") === process.env.ASKOS_ADMIN_KEY
}
