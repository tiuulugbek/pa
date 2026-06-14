// Shared TypeScript types for the Power Automation monorepo.
// These mirror the Prisma models but stay framework-agnostic so the
// web, admin, api and bot apps can all share a single source of truth.

export type Locale = 'uz' | 'ru' | 'en';

export type Industry = 'oil_gas' | 'chemical' | 'mining' | 'energy' | 'food' | 'water';

export const INDUSTRIES: Industry[] = [
  'oil_gas',
  'chemical',
  'mining',
  'energy',
  'food',
  'water',
];

export type Certificate = 'ATEX' | 'IECEx' | 'GOST' | 'CE' | 'ISO9001';

export type InquiryStatus = 'NEW' | 'SEEN' | 'REPLIED';

export interface Specification {
  label: string;
  value: string;
}

export interface ProductDocument {
  name: string;
  url: string;
}

export interface Category {
  id: number;
  nameUz: string;
  nameRu: string;
  nameEn: string | null;
  slug: string;
  icon: string | null;
  parentId: number | null;
  order: number;
  createdAt: string;
  children?: Category[];
  _count?: { products: number };
}

export interface Brand {
  id: number;
  name: string;
  logo: string | null;
  country: string | null;
  website: string | null;
  createdAt: string;
}

export interface Product {
  id: number;
  nameUz: string;
  nameRu: string;
  nameEn: string | null;
  slug: string;
  descriptionUz: string | null;
  descriptionRu: string | null;
  descriptionEn: string | null;
  categoryId: number;
  category?: Category;
  brandId: number | null;
  brand?: Brand | null;
  images: string[];
  documents: ProductDocument[] | null;
  specifications: Specification[] | null;
  certificates: string[];
  industries: string[];
  badge: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsPost {
  id: number;
  titleUz: string;
  titleRu: string;
  titleEn: string | null;
  slug: string;
  bodyUz: string;
  bodyRu: string;
  bodyEn: string | null;
  thumbnail: string | null;
  category: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export interface Project {
  id: number;
  titleUz: string;
  titleRu: string;
  titleEn: string | null;
  slug: string;
  descUz: string;
  descRu: string;
  descEn: string | null;
  industry: string;
  location: string | null;
  year: number | null;
  images: string[];
  isPublished: boolean;
  createdAt: string;
}

export interface Inquiry {
  id: number;
  productId: number | null;
  product?: Product | null;
  telegramUserId: string | null;
  telegramUsername: string | null;
  name: string | null;
  phone: string | null;
  company: string | null;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

// ---------- API request / response payloads ----------

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductListQuery {
  categoryId?: number;
  brandId?: number;
  industry?: string;
  certificate?: string;
  search?: string;
  sort?: 'new' | 'alpha' | 'popular';
  page?: number;
  limit?: number;
}

export interface ContactPayload {
  name: string;
  company?: string;
  phone: string;
  industry?: string;
  message: string;
}

export interface InquiryPayload {
  productId?: number;
  telegramUserId?: string;
  telegramUsername?: string;
  name?: string;
  phone?: string;
  company?: string;
  message: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: { id: number; username: string };
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
  inquiries: { NEW: number; SEEN: number; REPLIED: number; total: number };
  monthly: { month: string; count: number }[];
}
