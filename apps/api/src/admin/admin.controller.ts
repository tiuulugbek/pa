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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateBrandDto,
  CreateCategoryDto,
  CreateNewsDto,
  CreateProductDto,
  CreateProjectDto,
  InquiryQueryDto,
  InquiryStatusDto,
  UpdateBrandDto,
  UpdateCategoryDto,
  UpdateNewsDto,
  UpdateProductDto,
  UpdateProjectDto,
} from './admin.dto';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.admin.dashboard();
  }

  @Get('products')
  listProducts() {
    return this.admin.listProducts();
  }

  @Get('products/:id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.admin.getProduct(id);
  }

  @Post('products')
  createProduct(@Body() body: CreateProductDto) {
    return this.admin.createProduct(body);
  }

  @Put('products/:id')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateProductDto) {
    return this.admin.updateProduct(id, body);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.admin.deleteProduct(id);
  }

  @Get('categories')
  listCategories() {
    return this.admin.listCategories();
  }

  @Post('categories')
  createCategory(@Body() body: CreateCategoryDto) {
    return this.admin.createCategory(body);
  }

  @Put('categories/:id')
  updateCategory(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateCategoryDto) {
    return this.admin.updateCategory(id, body);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.admin.deleteCategory(id);
  }

  @Get('brands')
  listBrands() {
    return this.admin.listBrands();
  }

  @Post('brands')
  createBrand(@Body() body: CreateBrandDto) {
    return this.admin.createBrand(body);
  }

  @Put('brands/:id')
  updateBrand(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateBrandDto) {
    return this.admin.updateBrand(id, body);
  }

  @Delete('brands/:id')
  deleteBrand(@Param('id', ParseIntPipe) id: number) {
    return this.admin.deleteBrand(id);
  }

  @Get('news')
  listNews() {
    return this.admin.listNews();
  }

  @Get('news/:id')
  getNews(@Param('id', ParseIntPipe) id: number) {
    return this.admin.getNews(id);
  }

  @Post('news')
  createNews(@Body() body: CreateNewsDto) {
    return this.admin.createNews(body);
  }

  @Put('news/:id')
  updateNews(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateNewsDto) {
    return this.admin.updateNews(id, body);
  }

  @Delete('news/:id')
  deleteNews(@Param('id', ParseIntPipe) id: number) {
    return this.admin.deleteNews(id);
  }

  @Get('projects')
  listProjects() {
    return this.admin.listProjects();
  }

  @Get('projects/:id')
  getProject(@Param('id', ParseIntPipe) id: number) {
    return this.admin.getProject(id);
  }

  @Post('projects')
  createProject(@Body() body: CreateProjectDto) {
    return this.admin.createProject(body);
  }

  @Put('projects/:id')
  updateProject(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateProjectDto) {
    return this.admin.updateProject(id, body);
  }

  @Delete('projects/:id')
  deleteProject(@Param('id', ParseIntPipe) id: number) {
    return this.admin.deleteProject(id);
  }

  @Get('inquiries')
  listInquiries(@Query() query: InquiryQueryDto) {
    return this.admin.listInquiries(query.status);
  }

  @Patch('inquiries/:id/status')
  updateInquiryStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: InquiryStatusDto,
  ) {
    return this.admin.updateInquiryStatus(id, body.status);
  }
}
