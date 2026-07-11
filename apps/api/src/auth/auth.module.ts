import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

function parseJwtExpiry(value: string | undefined): number {
  if (!value) return 7_200;
  const seconds = Number(value);
  if (!Number.isInteger(seconds) || seconds < 300 || seconds > 86_400) {
    throw new Error('JWT_EXPIRES_IN_SECONDS must be an integer between 300 and 86400');
  }
  return seconds;
}

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret || secret.length < 64) {
          throw new Error('JWT_SECRET must contain at least 64 characters');
        }

        return {
          secret,
          signOptions: {
            expiresIn: parseJwtExpiry(config.get<string>('JWT_EXPIRES_IN_SECONDS')),
            issuer: config.get<string>('JWT_ISSUER') ?? 'power-automation-api',
            audience: config.get<string>('JWT_AUDIENCE') ?? 'power-automation-admin',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
