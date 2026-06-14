import { Controller, Get, NotFoundException, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ProductsService } from './products.service';
import { DatasheetService } from '../datasheet/datasheet.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly products: ProductsService,
    private readonly datasheet: DatasheetService,
  ) {}

  @Get()
  list(
    @Query('categoryId') categoryId?: string,
    @Query('brandId') brandId?: string,
    @Query('industry') industry?: string,
    @Query('certificate') certificate?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: 'new' | 'alpha' | 'popular',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.products.list({
      categoryId: categoryId ? Number(categoryId) : undefined,
      brandId: brandId ? Number(brandId) : undefined,
      industry,
      certificate,
      search,
      sort,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('featured')
  featured() {
    return this.products.featured();
  }

  /** Generates a branded PDF datasheet from the product's own data. */
  @Get(':slug/datasheet')
  async downloadDatasheet(
    @Param('slug') slug: string,
    @Query('lang') lang: string,
    @Res() res: Response,
  ): Promise<void> {
    const product = await this.products.getForDatasheet(slug);
    if (!product) throw new NotFoundException('Product not found');
    const locale = lang === 'ru' ? 'ru' : lang === 'en' ? 'en' : 'uz';
    const pdf = await this.datasheet.build(product, locale);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${slug}-datasheet.pdf"`,
      'Cache-Control': 'public, max-age=3600',
    });
    res.send(pdf);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.products.findBySlug(slug);
  }
}
