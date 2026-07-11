import type { InquiryStatus, Prisma } from '@pa/db';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class CreateProductDto {
  @IsString() @Length(2, 200) nameUz!: string;
  @IsString() @Length(2, 200) nameRu!: string;
  @IsOptional() @IsString() @MaxLength(200) nameEn?: string;
  @IsOptional() @IsString() @MaxLength(80) @Matches(slugPattern) slug?: string;
  @IsOptional() @IsString() @MaxLength(20_000) descriptionUz?: string;
  @IsOptional() @IsString() @MaxLength(20_000) descriptionRu?: string;
  @IsOptional() @IsString() @MaxLength(20_000) descriptionEn?: string;
  @IsInt() @Min(1) categoryId!: number;
  @IsOptional() @IsInt() @Min(1) brandId?: number;
  @IsArray() @IsString({ each: true }) images!: string[];
  @IsOptional() documents?: Prisma.InputJsonValue;
  @IsOptional() specifications?: Prisma.InputJsonValue;
  @IsArray() @IsString({ each: true }) certificates!: string[];
  @IsArray() @IsString({ each: true }) industries!: string[];
  @IsOptional() @IsString() @MaxLength(80) badge?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
}

export class UpdateProductDto {
  @IsOptional() @IsString() @Length(2, 200) nameUz?: string;
  @IsOptional() @IsString() @Length(2, 200) nameRu?: string;
  @IsOptional() @IsString() @MaxLength(200) nameEn?: string;
  @IsOptional() @IsString() @MaxLength(80) @Matches(slugPattern) slug?: string;
  @IsOptional() @IsString() @MaxLength(20_000) descriptionUz?: string;
  @IsOptional() @IsString() @MaxLength(20_000) descriptionRu?: string;
  @IsOptional() @IsString() @MaxLength(20_000) descriptionEn?: string;
  @IsOptional() @IsInt() @Min(1) categoryId?: number;
  @IsOptional() @IsInt() @Min(1) brandId?: number | null;
  @IsOptional() @IsArray() @IsString({ each: true }) images?: string[];
  @IsOptional() documents?: Prisma.InputJsonValue;
  @IsOptional() specifications?: Prisma.InputJsonValue;
  @IsOptional() @IsArray() @IsString({ each: true }) certificates?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) industries?: string[];
  @IsOptional() @IsString() @MaxLength(80) badge?: string | null;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
}

export class CreateCategoryDto {
  @IsString() @Length(2, 150) nameUz!: string;
  @IsString() @Length(2, 150) nameRu!: string;
  @IsOptional() @IsString() @MaxLength(150) nameEn?: string;
  @IsOptional() @IsString() @MaxLength(80) @Matches(slugPattern) slug?: string;
  @IsOptional() @IsString() @MaxLength(100) icon?: string;
  @IsOptional() @IsInt() @Min(1) parentId?: number;
  @IsOptional() @IsInt() @Min(0) @Max(10_000) order?: number;
}

export class UpdateCategoryDto {
  @IsOptional() @IsString() @Length(2, 150) nameUz?: string;
  @IsOptional() @IsString() @Length(2, 150) nameRu?: string;
  @IsOptional() @IsString() @MaxLength(150) nameEn?: string;
  @IsOptional() @IsString() @MaxLength(80) @Matches(slugPattern) slug?: string;
  @IsOptional() @IsString() @MaxLength(100) icon?: string | null;
  @IsOptional() @IsInt() @Min(1) parentId?: number | null;
  @IsOptional() @IsInt() @Min(0) @Max(10_000) order?: number;
}

export class CreateBrandDto {
  @IsString() @Length(1, 150) name!: string;
  @IsOptional() @IsString() @MaxLength(500) logo?: string;
  @IsOptional() @IsString() @MaxLength(100) country?: string;
  @IsOptional() @IsUrl({ require_protocol: true }) @MaxLength(500) website?: string;
}

export class UpdateBrandDto {
  @IsOptional() @IsString() @Length(1, 150) name?: string;
  @IsOptional() @IsString() @MaxLength(500) logo?: string | null;
  @IsOptional() @IsString() @MaxLength(100) country?: string | null;
  @IsOptional() @IsUrl({ require_protocol: true }) @MaxLength(500) website?: string | null;
}

export class CreateNewsDto {
  @IsString() @Length(2, 250) titleUz!: string;
  @IsString() @Length(2, 250) titleRu!: string;
  @IsOptional() @IsString() @MaxLength(250) titleEn?: string;
  @IsOptional() @IsString() @MaxLength(80) @Matches(slugPattern) slug?: string;
  @IsString() @Length(2, 50_000) bodyUz!: string;
  @IsString() @Length(2, 50_000) bodyRu!: string;
  @IsOptional() @IsString() @MaxLength(50_000) bodyEn?: string;
  @IsOptional() @IsString() @MaxLength(500) thumbnail?: string;
  @IsOptional() @IsString() @MaxLength(100) category?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsDateString() publishedAt?: string;
}

export class UpdateNewsDto {
  @IsOptional() @IsString() @Length(2, 250) titleUz?: string;
  @IsOptional() @IsString() @Length(2, 250) titleRu?: string;
  @IsOptional() @IsString() @MaxLength(250) titleEn?: string;
  @IsOptional() @IsString() @MaxLength(80) @Matches(slugPattern) slug?: string;
  @IsOptional() @IsString() @Length(2, 50_000) bodyUz?: string;
  @IsOptional() @IsString() @Length(2, 50_000) bodyRu?: string;
  @IsOptional() @IsString() @MaxLength(50_000) bodyEn?: string;
  @IsOptional() @IsString() @MaxLength(500) thumbnail?: string | null;
  @IsOptional() @IsString() @MaxLength(100) category?: string | null;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsDateString() publishedAt?: string | null;
}

export class CreateProjectDto {
  @IsString() @Length(2, 250) titleUz!: string;
  @IsString() @Length(2, 250) titleRu!: string;
  @IsOptional() @IsString() @MaxLength(250) titleEn?: string;
  @IsOptional() @IsString() @MaxLength(80) @Matches(slugPattern) slug?: string;
  @IsString() @Length(2, 50_000) descUz!: string;
  @IsString() @Length(2, 50_000) descRu!: string;
  @IsOptional() @IsString() @MaxLength(50_000) descEn?: string;
  @IsString() @Length(2, 100) industry!: string;
  @IsOptional() @IsString() @MaxLength(200) location?: string;
  @IsOptional() @IsInt() @Min(1900) @Max(2200) year?: number;
  @IsArray() @IsString({ each: true }) images!: string[];
  @IsOptional() @IsBoolean() isPublished?: boolean;
}

export class UpdateProjectDto {
  @IsOptional() @IsString() @Length(2, 250) titleUz?: string;
  @IsOptional() @IsString() @Length(2, 250) titleRu?: string;
  @IsOptional() @IsString() @MaxLength(250) titleEn?: string;
  @IsOptional() @IsString() @MaxLength(80) @Matches(slugPattern) slug?: string;
  @IsOptional() @IsString() @Length(2, 50_000) descUz?: string;
  @IsOptional() @IsString() @Length(2, 50_000) descRu?: string;
  @IsOptional() @IsString() @MaxLength(50_000) descEn?: string;
  @IsOptional() @IsString() @Length(2, 100) industry?: string;
  @IsOptional() @IsString() @MaxLength(200) location?: string | null;
  @IsOptional() @IsInt() @Min(1900) @Max(2200) year?: number | null;
  @IsOptional() @IsArray() @IsString({ each: true }) images?: string[];
  @IsOptional() @IsBoolean() isPublished?: boolean;
}

export class InquiryStatusDto {
  @IsEnum({ NEW: 'NEW', SEEN: 'SEEN', REPLIED: 'REPLIED' })
  status!: InquiryStatus;
}

export class InquiryQueryDto {
  @IsOptional()
  @IsEnum({ NEW: 'NEW', SEEN: 'SEEN', REPLIED: 'REPLIED' })
  status?: InquiryStatus;
}
