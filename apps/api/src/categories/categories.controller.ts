import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  /** Returns the full category tree (parents with nested children). Cached 10 min. */
  @Get()
  async tree() {
    return this.cache.wrap('categories:tree', 600, async () => {
      const all = await this.prisma.category.findMany({
        orderBy: { order: 'asc' },
        include: { _count: { select: { products: true } } },
      });
      const parents = all.filter((c) => c.parentId === null);
      return parents.map((p) => ({
        ...p,
        children: all.filter((c) => c.parentId === p.id),
      }));
    });
  }
}
