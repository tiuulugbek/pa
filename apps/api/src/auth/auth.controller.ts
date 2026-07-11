import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { IsString, Length, MaxLength, MinLength } from 'class-validator';
import { AuthService } from './auth.service';

class LoginDto {
  @IsString()
  @Length(3, 64)
  username!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}

@Controller('admin')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.username.trim(), dto.password);
  }
}
