/**
 * Thin typed client for the backend API (NestJS).
 * Set NEXT_PUBLIC_API_URL in your environment (see .env.example).
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type FetchOptions = RequestInit & { json?: unknown };

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { json, headers, ...rest } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
