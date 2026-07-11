'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_KEY = 'pa_admin_token';

function requireApiUrl(): string {
  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }
  return API_URL.replace(/\/$/, '');
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(TOKEN_KEY);
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${requireApiUrl()}/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (res.status === 401) {
    clearToken();
    if (typeof window !== 'undefined') window.location.replace('/login');
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    let message = `${method} ${path} failed with status ${res.status}`;
    try {
      const payload = (await res.json()) as { message?: string | string[] };
      if (payload.message) {
        message = Array.isArray(payload.message) ? payload.message.join(', ') : payload.message;
      }
    } catch {
      // Preserve the status-based message when the response is not JSON.
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const adminApi = {
  login: (username: string, password: string) =>
    request<{ token: string; user: { id: number; username: string } }>('POST', '/admin/login', {
      username,
      password,
    }),
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  del: <T>(path: string) => request<T>('DELETE', path),
  async upload(file: File): Promise<{ url: string }> {
    const token = getToken();
    if (!token) throw new Error('Unauthorized');

    const fd = new FormData();
    fd.append('file', file);

    const res = await fetch(`${requireApiUrl()}/api/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
      cache: 'no-store',
    });

    if (res.status === 401) {
      clearToken();
      if (typeof window !== 'undefined') window.location.replace('/login');
      throw new Error('Unauthorized');
    }
    if (!res.ok) throw new Error(`Upload failed with status ${res.status}`);
    return (await res.json()) as { url: string };
  },
};

export { API_URL };
