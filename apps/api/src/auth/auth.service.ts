import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { username } });
    if (!user) throw new UnauthorizedException('Login yoki parol notoʻgʻri');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Login yoki parol notoʻgʻri');

    const token = await this.jwt.signAsync({ sub: user.id, username: user.username });
    return { token, user: { id: user.id, username: user.username } };
  }
}
