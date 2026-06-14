import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list(@Query('industry') industry?: string) {
    return this.prisma.project.findMany({
      where: { isPublished: true, ...(industry ? { industry } : {}) },
      orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
    });
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const project = await this.prisma.project.findUnique({ where: { slug } });
    if (!project || !project.isPublished) throw new NotFoundException('Project not found');
    return project;
  }
}
