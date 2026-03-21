/**
 * Next.js 14–16: `params` may be a plain object or a Promise depending on version / runtime.
 */
export async function resolvePageParams<P extends Record<string, string | string[] | undefined>>(
  params: Promise<P> | P,
): Promise<P> {
  if (params != null && typeof (params as Promise<P>).then === "function") {
    return await (params as Promise<P>)
  }
  return params as P
}

export function firstSegment(value: string | string[] | undefined): string {
  if (value == null) return ""
  return (Array.isArray(value) ? value[0] : value) ?? ""
}
