import { Injectable, Logger, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import type { Prisma } from '@pa/db';
import { PrismaService } from '../prisma/prisma.service';
import { SearchService } from '../search/search.service';
import { CacheService } from '../cache/cache.service';

export interface ProductListParams {
  categoryId?: number;
  brandId?: number;
  industry?: string;
  certificate?: string;
  search?: string;
  sort?: 'new' | 'alpha' | 'popular';
  page?: number;
  limit?: number;
}

@Injectable()
export class ProductsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly search: SearchService,
    private readonly cache: CacheService,
  ) {}

  /**
   * Once the app is fully up (so Meilisearch has finished connecting),
   * sync all active products into the search index. Keeps the index in
   * step with data that was seeded directly into the database.
   */
  async onApplicationBootstrap(): Promise<void> {
    if (!this.search.enabled) return;
    try {
      const products = await this.prisma.product.findMany({ where: { isActive: true } });
      await this.search.reindex(products);
      this.logger.log(`Reindexed ${products.length} products into Meilisearch.`);
    } catch (err) {
      this.logger.warn('Initial Meilisearch reindex skipped.');
    }
  }

  async list(params: ProductListParams) {
    const cacheKey = `products:list:${JSON.stringify(params)}`;
    return this.cache.wrap(cacheKey, 120, () => this.queryList(params));
  }

  private async queryList(params: ProductListParams) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));

    const where: Prisma.ProductWhereInput = { isActive: true };

    if (params.categoryId) {
      // Include child categories: if the requested category is a parent,
      // match products in any of its children too.
      const children = await this.prisma.category.findMany({
        where: { parentId: params.categoryId },
        select: { id: true },
      });
      const ids = [params.categoryId, ...children.map((c) => c.id)];
      where.categoryId = { in: ids };
    }
    if (params.brandId) where.brandId = params.brandId;
    if (params.industry) where.industries = { has: params.industry };
    if (params.certificate) where.certificates = { has: params.certificate };

    // Full-text search: prefer Meilisearch, fall back to DB contains.
    let searchIds: number[] | null = null;
    if (params.search && params.search.trim()) {
      searchIds = await this.search.searchIds(params.search.trim());
      if (searchIds) {
        where.id = { in: searchIds.length ? searchIds : [-1] };
      } else {
        const q = params.search.trim();
        where.OR = [
          { nameUz: { contains: q, mode: 'insensitive' } },
          { nameRu: { contains: q, mode: 'insensitive' } },
          { descriptionUz: { contains: q, mode: 'insensitive' } },
          { descriptionRu: { contains: q, mode: 'insensitive' } },
        ];
      }
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      params.sort === 'alpha'
        ? { nameUz: 'asc' }
        : params.sort === 'popular'
          ? { views: 'desc' }
          : { createdAt: 'desc' };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { brand: true, category: true },
      }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async featured() {
    return this.cache.wrap('products:featured', 600, () =>
      this.prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        take: 4,
        orderBy: { createdAt: 'desc' },
        include: { brand: true, category: true },
      }),
    );
  }

  /** Fetch a product with brand + category for datasheet rendering (no view bump). */
  getForDatasheet(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: { brand: true, category: true },
    });
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { brand: true, category: { include: { parent: true } } },
    });
    if (!product) throw new NotFoundException(`Product "${slug}" not found`);

    // Increment views (fire-and-forget style, but awaited for correctness).
    await this.prisma.product.update({
      where: { id: product.id },
      data: { views: { increment: 1 } },
    });

    // Related products: same category, different id.
    const related = await this.prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: product.id }, isActive: true },
      take: 6,
      include: { brand: true },
    });

    return { ...product, related };
  }
}
