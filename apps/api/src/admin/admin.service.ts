import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { InquiryStatus, Prisma } from '@pa/db';
import { CacheService } from '../cache/cache.service';
import { PrismaService } from '../prisma/prisma.service';
import { SearchService } from '../search/search.service';
import {
  CreateBrandDto,
  CreateCategoryDto,
  CreateNewsDto,
  CreateProductDto,
  CreateProjectDto,
  UpdateBrandDto,
  UpdateCategoryDto,
  UpdateNewsDto,
  UpdateProductDto,
  UpdateProjectDto,
} from './admin.dto';

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/['ʻʼ`]/g, '')
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function cleanOptional(value: string | null | undefined): string | null | undefined {
  if (value === null) return null;
  const cleaned = value?.trim();
  return cleaned || undefined;
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly search: SearchService,
    private readonly cache: CacheService,
  ) {}

  private async bust(): Promise<void> {
    try {
      await Promise.all([
        this.cache.invalidate('products:'),
        this.cache.invalidate('categories:'),
      ]);
    } catch (error) {
      this.logger.error('Cache invalidation failed', error as Error);
    }
  }

  private async syncProduct(product: Parameters<SearchService['upsert']>[0]): Promise<void> {
    try {
      await this.search.upsert(product);
    } catch (error) {
      this.logger.error(`Search indexing failed for product ${product.id}`, error as Error);
    }
  }

  async dashboard() {
    const [totalProducts, totalCategories, totalBrands, grouped] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.category.count(),
      this.prisma.brand.count(),
      this.prisma.inquiry.groupBy({ by: ['status'], _count: true }),
    ]);

    const inquiries = { NEW: 0, SEEN: 0, REPLIED: 0, total: 0 };
    for (const group of grouped) {
      inquiries[group.status] = group._count;
      inquiries.total += group._count;
    }

    const since = new Date();
    since.setMonth(since.getMonth() - 5);
    since.setDate(1);
    since.setHours(0, 0, 0, 0);

    const recent = await this.prisma.inquiry.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    });
    const monthlyMap = new Map<string, number>();
    for (let index = 0; index < 6; index += 1) {
      const date = new Date(since);
      date.setMonth(since.getMonth() + index);
      monthlyMap.set(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        0,
      );
    }
    for (const row of recent) {
      const key = `${row.createdAt.getFullYear()}-${String(row.createdAt.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyMap.has(key)) monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + 1);
    }

    return {
      totalProducts,
      totalCategories,
      totalBrands,
      inquiries,
      monthly: [...monthlyMap.entries()].map(([month, count]) => ({ month, count })),
    };
  }

  listProducts() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { brand: true, category: true },
    });
  }

  async getProduct(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { brand: true, category: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async createProduct(dto: CreateProductDto) {
    const data: Prisma.ProductUncheckedCreateInput = {
      ...dto,
      nameUz: dto.nameUz.trim(),
      nameRu: dto.nameRu.trim(),
      nameEn: cleanOptional(dto.nameEn),
      slug: dto.slug ?? slugify(dto.nameUz),
      descriptionUz: cleanOptional(dto.descriptionUz),
      descriptionRu: cleanOptional(dto.descriptionRu),
      descriptionEn: cleanOptional(dto.descriptionEn),
      badge: cleanOptional(dto.badge),
    };
    const product = await this.prisma.product.create({ data });
    await Promise.all([this.syncProduct(product), this.bust()]);
    return product;
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    await this.getProduct(id);
    const data: Prisma.ProductUncheckedUpdateInput = {
      ...dto,
      nameUz: dto.nameUz?.trim(),
      nameRu: dto.nameRu?.trim(),
      nameEn: cleanOptional(dto.nameEn),
      descriptionUz: cleanOptional(dto.descriptionUz),
      descriptionRu: cleanOptional(dto.descriptionRu),
      descriptionEn: cleanOptional(dto.descriptionEn),
      badge: cleanOptional(dto.badge),
    };
    const product = await this.prisma.product.update({ where: { id }, data });
    await Promise.all([this.syncProduct(product), this.bust()]);
    return product;
  }

  async deleteProduct(id: number) {
    await this.getProduct(id);
    await this.prisma.$transaction([
      this.prisma.inquiry.updateMany({ where: { productId: id }, data: { productId: null } }),
      this.prisma.product.delete({ where: { id } }),
    ]);
    try {
      await this.search.remove(id);
    } catch (error) {
      this.logger.error(`Search removal failed for product ${id}`, error as Error);
    }
    await this.bust();
    return { ok: true };
  }

  listCategories() {
    return this.prisma.category.findMany({ orderBy: { order: 'asc' } });
  }

  async createCategory(dto: CreateCategoryDto) {
    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({ where: { id: dto.parentId } });
      if (!parent) throw new NotFoundException('Parent category not found');
    }
    const data: Prisma.CategoryUncheckedCreateInput = {
      ...dto,
      nameUz: dto.nameUz.trim(),
      nameRu: dto.nameRu.trim(),
      nameEn: cleanOptional(dto.nameEn),
      slug: dto.slug ?? slugify(dto.nameUz),
      icon: cleanOptional(dto.icon),
    };
    const created = await this.prisma.category.create({ data });
    await this.bust();
    return created;
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Category not found');
    if (dto.parentId === id) throw new ConflictException('Category cannot be its own parent');
    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({ where: { id: dto.parentId } });
      if (!parent) throw new NotFoundException('Parent category not found');
    }
    const data: Prisma.CategoryUncheckedUpdateInput = {
      ...dto,
      nameUz: dto.nameUz?.trim(),
      nameRu: dto.nameRu?.trim(),
      nameEn: cleanOptional(dto.nameEn),
      icon: cleanOptional(dto.icon),
    };
    const updated = await this.prisma.category.update({ where: { id }, data });
    await this.bust();
    return updated;
  }

  async deleteCategory(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: { id: true, _count: { select: { children: true, products: true } } },
    });
    if (!category) throw new NotFoundException('Category not found');
    if (category._count.children > 0 || category._count.products > 0) {
      throw new ConflictException('Category still contains child categories or products');
    }
    const deleted = await this.prisma.category.delete({ where: { id } });
    await this.bust();
    return deleted;
  }

  listBrands() {
    return this.prisma.brand.findMany({ orderBy: { name: 'asc' } });
  }

  createBrand(dto: CreateBrandDto) {
    const data: Prisma.BrandUncheckedCreateInput = {
      name: dto.name.trim(),
      logo: cleanOptional(dto.logo),
      country: cleanOptional(dto.country),
      website: cleanOptional(dto.website),
    };
    return this.prisma.brand.create({ data });
  }

  async updateBrand(id: number, dto: UpdateBrandDto) {
    const existing = await this.prisma.brand.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Brand not found');
    const data: Prisma.BrandUncheckedUpdateInput = {
      name: dto.name?.trim(),
      logo: cleanOptional(dto.logo),
      country: cleanOptional(dto.country),
      website: cleanOptional(dto.website),
    };
    return this.prisma.brand.update({ where: { id }, data });
  }

  async deleteBrand(id: number) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      select: { id: true, _count: { select: { products: true } } },
    });
    if (!brand) throw new NotFoundException('Brand not found');
    if (brand._count.products > 0) {
      throw new ConflictException('Brand is still assigned to products');
    }
    return this.prisma.brand.delete({ where: { id } });
  }

  listNews() {
    return this.prisma.newsPost.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getNews(id: number) {
    const news = await this.prisma.newsPost.findUnique({ where: { id } });
    if (!news) throw new NotFoundException('News post not found');
    return news;
  }

  createNews(dto: CreateNewsDto) {
    const data: Prisma.NewsPostUncheckedCreateInput = {
      ...dto,
      titleUz: dto.titleUz.trim(),
      titleRu: dto.titleRu.trim(),
      titleEn: cleanOptional(dto.titleEn),
      slug: dto.slug ?? slugify(dto.titleUz),
      bodyUz: dto.bodyUz.trim(),
      bodyRu: dto.bodyRu.trim(),
      bodyEn: cleanOptional(dto.bodyEn),
      thumbnail: cleanOptional(dto.thumbnail),
      category: cleanOptional(dto.category),
      publishedAt: dto.publishedAt
        ? new Date(dto.publishedAt)
        : dto.isPublished
          ? new Date()
          : undefined,
    };
    return this.prisma.newsPost.create({ data });
  }

  async updateNews(id: number, dto: UpdateNewsDto) {
    await this.getNews(id);
    const data: Prisma.NewsPostUncheckedUpdateInput = {
      ...dto,
      titleUz: dto.titleUz?.trim(),
      titleRu: dto.titleRu?.trim(),
      titleEn: cleanOptional(dto.titleEn),
      bodyUz: dto.bodyUz?.trim(),
      bodyRu: dto.bodyRu?.trim(),
      bodyEn: cleanOptional(dto.bodyEn),
      thumbnail: cleanOptional(dto.thumbnail),
      category: cleanOptional(dto.category),
      publishedAt:
        dto.publishedAt === null
          ? null
          : dto.publishedAt
            ? new Date(dto.publishedAt)
            : undefined,
    };
    return this.prisma.newsPost.update({ where: { id }, data });
  }

  deleteNews(id: number) {
    return this.prisma.newsPost.delete({ where: { id } });
  }

  listProjects() {
    return this.prisma.project.findMany({ orderBy: { year: 'desc' } });
  }

  async getProject(id: number) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  createProject(dto: CreateProjectDto) {
    const data: Prisma.ProjectUncheckedCreateInput = {
      ...dto,
      titleUz: dto.titleUz.trim(),
      titleRu: dto.titleRu.trim(),
      titleEn: cleanOptional(dto.titleEn),
      slug: dto.slug ?? slugify(dto.titleUz),
      descUz: dto.descUz.trim(),
      descRu: dto.descRu.trim(),
      descEn: cleanOptional(dto.descEn),
      industry: dto.industry.trim(),
      location: cleanOptional(dto.location),
    };
    return this.prisma.project.create({ data });
  }

  async updateProject(id: number, dto: UpdateProjectDto) {
    await this.getProject(id);
    const data: Prisma.ProjectUncheckedUpdateInput = {
      ...dto,
      titleUz: dto.titleUz?.trim(),
      titleRu: dto.titleRu?.trim(),
      titleEn: cleanOptional(dto.titleEn),
      descUz: dto.descUz?.trim(),
      descRu: dto.descRu?.trim(),
      descEn: cleanOptional(dto.descEn),
      industry: dto.industry?.trim(),
      location: cleanOptional(dto.location),
    };
    return this.prisma.project.update({ where: { id }, data });
  }

  deleteProject(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }

  listInquiries(status?: InquiryStatus) {
    const where: Prisma.InquiryWhereInput = status ? { status } : {};
    return this.prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { product: { select: { nameUz: true, slug: true } } },
    });
  }

  async updateInquiryStatus(id: number, status: InquiryStatus) {
    const inquiry = await this.prisma.inquiry.findUnique({ where: { id }, select: { id: true } });
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    return this.prisma.inquiry.update({ where: { id }, data: { status } });
  }
}
