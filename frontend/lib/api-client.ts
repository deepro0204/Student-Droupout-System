// Thin client for the CareSphere FastAPI backend.
// Base URL is configurable via NEXT_PUBLIC_API_URL (defaults to local dev).

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return
  if (token) localStorage.setItem("token", token)
  else localStorage.removeItem("token")
}

/**
 * Fetch JSON from the backend, attaching the stored JWT when present.
 * Throws an Error with the backend's `detail`/`error` message on non-2xx.
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = await res.json()
      detail = body.detail || body.error || detail
    } catch {
      // response had no JSON body
    }
    throw new Error(`API ${res.status}: ${detail}`)
  }

  return (await res.json()) as T
}
