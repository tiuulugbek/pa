import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { Prisma } from '@pa/db';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.admin.dashboard();
  }

  // ---- Products ----
  @Get('products')
  listProducts() {
    return this.admin.listProducts();
  }

  @Get('products/:id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.admin.getProduct(id);
  }

  @Post('products')
  createProduct(@Body() body: Prisma.ProductUncheckedCreateInput) {
    return this.admin.createProduct(body);
  }

  @Put('products/:id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Prisma.ProductUncheckedUpdateInput,
  ) {
    return this.admin.updateProduct(id, body);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.admin.deleteProduct(id);
  }

  // ---- Categories ----
  @Get('categories')
  listCategories() {
    return this.admin.listCategories();
  }

  @Post('categories')
  createCategory(@Body() body: Prisma.CategoryUncheckedCreateInput) {
    return this.admin.createCategory(body);
  }

  @Put('categories/:id')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Prisma.CategoryUncheckedUpdateInput,
  ) {
    return this.admin.updateCategory(id, body);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.admin.deleteCategory(id);
  }

  // ---- Brands ----
  @Get('brands')
  listBrands() {
    return this.admin.listBrands();
  }

  @Post('brands')
  createBrand(@Body() body: Prisma.BrandUncheckedCreateInput) {
    return this.admin.createBrand(body);
  }

  @Put('brands/:id')
  updateBrand(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Prisma.BrandUncheckedUpdateInput,
  ) {
    return this.admin.updateBrand(id, body);
  }

  @Delete('brands/:id')
  deleteBrand(@Param('id', ParseIntPipe) id: number) {
    return this.admin.deleteBrand(id);
  }

  // ---- News ----
  @Get('news')
  listNews() {
    return this.admin.listNews();
  }

  @Get('news/:id')
  getNews(@Param('id', ParseIntPipe) id: number) {
    return this.admin.getNews(id);
  }

  @Post('news')
  createNews(@Body() body: Prisma.NewsPostUncheckedCreateInput) {
    return this.admin.createNews(body);
  }

  @Put('news/:id')
  updateNews(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Prisma.NewsPostUncheckedUpdateInput,
  ) {
    return this.admin.updateNews(id, body);
  }

  @Delete('news/:id')
  deleteNews(@Param('id', ParseIntPipe) id: number) {
    return this.admin.deleteNews(id);
  }

  // ---- Projects ----
  @Get('projects')
  listProjects() {
    return this.admin.listProjects();
  }

  @Get('projects/:id')
  getProject(@Param('id', ParseIntPipe) id: number) {
    return this.admin.getProject(id);
  }

  @Post('projects')
  createProject(@Body() body: Prisma.ProjectUncheckedCreateInput) {
    return this.admin.createProject(body);
  }

  @Put('projects/:id')
  updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Prisma.ProjectUncheckedUpdateInput,
  ) {
    return this.admin.updateProject(id, body);
  }

  @Delete('projects/:id')
  deleteProject(@Param('id', ParseIntPipe) id: number) {
    return this.admin.deleteProject(id);
  }

  // ---- Inquiries ----
  @Get('inquiries')
  listInquiries(@Query('status') status?: string) {
    return this.admin.listInquiries(status);
  }

  @Patch('inquiries/:id/status')
  updateInquiryStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'NEW' | 'SEEN' | 'REPLIED',
  ) {
    return this.admin.updateInquiryStatus(id, status);
  }
}
