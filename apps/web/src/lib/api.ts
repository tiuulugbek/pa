import type {
  Brand,
  Category,
  NewsPost,
  Paginated,
  Product,
  Project,
} from '@pa/types';

// Browser-facing API origin (used for client fetches and image URLs).
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// On the server, prefer the internal service URL (e.g. http://api:3001 on the
// Docker network); fall back to the public URL when not set. In the browser
// always use the public URL.
function apiBase(): string {
  if (typeof window === 'undefined') {
    return process.env.API_INTERNAL_URL || API_URL;
  }
  return API_URL;
}

type Query = Record<string, string | number | undefined>;

function buildUrl(path: string, query?: Query): string {
  const url = new URL(`${apiBase()}/api${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function get<T>(
  path: string,
  query?: Query,
  fallback?: T,
  revalidate?: number,
): Promise<T> {
  // When `revalidate` is provided the response participates in ISR; otherwise
  // it is always fresh (no-store) for filter-driven, request-specific data.
  const init: RequestInit =
    revalidate !== undefined ? { next: { revalidate } } : { cache: 'no-store' };
  try {
    const res = await fetch(buildUrl(path, query), init);
    if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    if (fallback !== undefined) return fallback;
    throw err;
  }
}

// ---- Product detail with related ----
export type ProductDetail = Product & {
  category: Category & { parent: Category | null };
  related: Product[];
};
export type NewsDetail = NewsPost & { related: NewsPost[] };

export const api = {
  categories: () => get<Category[]>('/categories', undefined, []),
  brands: () => get<Brand[]>('/brands', undefined, []),
  featured: () => get<Product[]>('/products/featured', undefined, []),
  products: (query?: Query) =>
    get<Paginated<Product>>('/products', query, {
      data: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 1,
    }),
  product: (slug: string) => get<ProductDetail>(`/products/${slug}`, undefined, undefined, 600),
  news: (query?: Query) =>
    get<Paginated<NewsPost>>('/news', query, {
      data: [],
      total: 0,
      page: 1,
      limit: 9,
      totalPages: 1,
    }),
  latestNews: () => get<NewsPost[]>('/news/latest', undefined, []),
  newsPost: (slug: string) => get<NewsDetail>(`/news/${slug}`, undefined, undefined, 600),
  projects: (query?: Query) => get<Project[]>('/projects', query, []),
  project: (slug: string) => get<Project>(`/projects/${slug}`, undefined, undefined, 600),
};

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed`);
  return (await res.json()) as T;
}

export { API_URL };
