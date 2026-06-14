import { Injectable } from '@nestjs/common';
import type { Prisma, InquiryStatus } from '@pa/db';
import { PrismaService } from '../prisma/prisma.service';
import { SearchService } from '../search/search.service';
import { CacheService } from '../cache/cache.service';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/['ʻʼ`]/g, '')
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly search: SearchService,
    private readonly cache: CacheService,
  ) {}

  /** Drop cached public responses after a mutation. */
  private async bust(): Promise<void> {
    await Promise.all([this.cache.invalidate('products:'), this.cache.invalidate('categories:')]);
  }

  // ---------------- Dashboard ----------------
  async dashboard() {
    const [totalProducts, totalCategories, totalBrands, grouped] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.category.count(),
      this.prisma.brand.count(),
      this.prisma.inquiry.groupBy({ by: ['status'], _count: true }),
    ]);

    const inquiries = { NEW: 0, SEEN: 0, REPLIED: 0, total: 0 };
    for (const g of grouped) {
      inquiries[g.status] = g._count;
      inquiries.total += g._count;
    }

    // Monthly inquiry counts for the last 6 months.
    const since = new Date();
    since.setMonth(since.getMonth() - 5);
    since.setDate(1);
    const recent = await this.prisma.inquiry.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    });
    const monthlyMap = new Map<string, number>();
    for (let i = 0; i < 6; i++) {
      const d = new Date(since);
      d.setMonth(since.getMonth() + i);
      monthlyMap.set(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, 0);
    }
    for (const r of recent) {
      const key = `${r.createdAt.getFullYear()}-${String(r.createdAt.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyMap.has(key)) monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + 1);
    }
    const monthly = [...monthlyMap.entries()].map(([month, count]) => ({ month, count }));

    return { totalProducts, totalCategories, totalBrands, inquiries, monthly };
  }

  // ---------------- Products ----------------
  listProducts() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { brand: true, category: true },
    });
  }

  getProduct(id: number) {
    return this.prisma.product.findUnique({ where: { id }, include: { brand: true, category: true } });
  }

  async createProduct(data: Prisma.ProductUncheckedCreateInput) {
    if (!data.slug && data.nameUz) data.slug = slugify(data.nameUz);
    const product = await this.prisma.product.create({ data });
    await this.search.upsert(product);
    await this.bust();
    return product;
  }

  async updateProduct(id: number, data: Prisma.ProductUncheckedUpdateInput) {
    const product = await this.prisma.product.update({ where: { id }, data });
    await this.search.upsert(product);
    await this.bust();
    return product;
  }

  async deleteProduct(id: number) {
    await this.prisma.inquiry.updateMany({ where: { productId: id }, data: { productId: null } });
    await this.prisma.product.delete({ where: { id } });
    await this.search.remove(id);
    await this.bust();
    return { ok: true };
  }

  // ---------------- Categories ----------------
  listCategories() {
    return this.prisma.category.findMany({ orderBy: { order: 'asc' } });
  }

  async createCategory(data: Prisma.CategoryUncheckedCreateInput) {
    if (!data.slug && data.nameUz) data.slug = slugify(data.nameUz);
    const created = await this.prisma.category.create({ data });
    await this.bust();
    return created;
  }

  async updateCategory(id: number, data: Prisma.CategoryUncheckedUpdateInput) {
    const updated = await this.prisma.category.update({ where: { id }, data });
    await this.bust();
    return updated;
  }

  async deleteCategory(id: number) {
    const deleted = await this.prisma.category.delete({ where: { id } });
    await this.bust();
    return deleted;
  }

  // ---------------- Brands ----------------
  listBrands() {
    return this.prisma.brand.findMany({ orderBy: { name: 'asc' } });
  }

  createBrand(data: Prisma.BrandUncheckedCreateInput) {
    return this.prisma.brand.create({ data });
  }

  updateBrand(id: number, data: Prisma.BrandUncheckedUpdateInput) {
    return this.prisma.brand.update({ where: { id }, data });
  }

  deleteBrand(id: number) {
    return this.prisma.brand.delete({ where: { id } });
  }

  // ---------------- News ----------------
  listNews() {
    return this.prisma.newsPost.findMany({ orderBy: { createdAt: 'desc' } });
  }

  getNews(id: number) {
    return this.prisma.newsPost.findUnique({ where: { id } });
  }

  createNews(data: Prisma.NewsPostUncheckedCreateInput) {
    if (!data.slug && data.titleUz) data.slug = slugify(data.titleUz);
    if (data.isPublished && !data.publishedAt) data.publishedAt = new Date();
    return this.prisma.newsPost.create({ data });
  }

  updateNews(id: number, data: Prisma.NewsPostUncheckedUpdateInput) {
    return this.prisma.newsPost.update({ where: { id }, data });
  }

  deleteNews(id: number) {
    return this.prisma.newsPost.delete({ where: { id } });
  }

  // ---------------- Projects ----------------
  listProjects() {
    return this.prisma.project.findMany({ orderBy: { year: 'desc' } });
  }

  getProject(id: number) {
    return this.prisma.project.findUnique({ where: { id } });
  }

  createProject(data: Prisma.ProjectUncheckedCreateInput) {
    if (!data.slug && data.titleUz) data.slug = slugify(data.titleUz);
    return this.prisma.project.create({ data });
  }

  updateProject(id: number, data: Prisma.ProjectUncheckedUpdateInput) {
    return this.prisma.project.update({ where: { id }, data });
  }

  deleteProject(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }

  // ---------------- Inquiries ----------------
  listInquiries(status?: string) {
    const where: Prisma.InquiryWhereInput =
      status === 'NEW' || status === 'SEEN' || status === 'REPLIED'
        ? { status: status as InquiryStatus }
        : {};
    return this.prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { product: { select: { nameUz: true, slug: true } } },
    });
  }

  updateInquiryStatus(id: number, status: 'NEW' | 'SEEN' | 'REPLIED') {
    return this.prisma.inquiry.update({ where: { id }, data: { status } });
  }
}
