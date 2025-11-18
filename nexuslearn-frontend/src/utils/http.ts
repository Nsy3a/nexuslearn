export async function safeJson<T = any>(res: Response): Promise<T> {
  try { return await res.json() as T } catch { return {} as T }
}

export async function safeFetchJson<T = any>(url: string, init?: RequestInit, fallback: T = {} as T): Promise<T> {
  try {
    const r = await fetch(url, init)
    return await safeJson<T>(r)
  } catch { return fallback }
}

export function withParams(base: string, params: Record<string, any>): string {
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => usp.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v)))
  return base + '?' + usp.toString()
}