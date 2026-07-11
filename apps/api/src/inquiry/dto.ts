import {
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateInquiryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  productId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  @Matches(/^\d+$/, { message: 'telegramUserId must contain digits only' })
  telegramUserId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 32)
  @Matches(/^[A-Za-z0-9_]+$/, { message: 'telegramUsername has an invalid format' })
  telegramUsername?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  @IsPhoneNumber(undefined, { message: 'phone must be a valid international phone number' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  company?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(2000)
  message!: string;
}

export class CreateContactDto {
  @IsString()
  @Length(2, 100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  company?: string;

  @IsString()
  @MaxLength(32)
  @IsPhoneNumber(undefined, { message: 'phone must be a valid international phone number' })
  phone!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(2000)
  message!: string;
}
