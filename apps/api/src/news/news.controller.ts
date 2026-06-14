import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('news')
export class NewsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
  ) {
    const p = Math.max(1, page ? Number(page) : 1);
    const l = Math.min(50, Math.max(1, limit ? Number(limit) : 9));
    const where = { isPublished: true, ...(category ? { category } : {}) };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.newsPost.count({ where }),
      this.prisma.newsPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (p - 1) * l,
        take: l,
      }),
    ]);

    return { data, total, page: p, limit: l, totalPages: Math.ceil(total / l) || 1 };
  }

  @Get('latest')
  latest() {
    return this.prisma.newsPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    });
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const post = await this.prisma.newsPost.findUnique({ where: { slug } });
    if (!post || !post.isPublished) throw new NotFoundException('News post not found');
    const related = await this.prisma.newsPost.findMany({
      where: { isPublished: true, slug: { not: slug } },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    });
    return { ...post, related };
  }
}
