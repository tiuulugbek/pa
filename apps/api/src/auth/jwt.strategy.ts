import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: number;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret || secret.length < 64) {
      throw new Error('JWT_SECRET must contain at least 64 characters');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      issuer: config.get<string>('JWT_ISSUER') ?? 'power-automation-api',
      audience: config.get<string>('JWT_AUDIENCE') ?? 'power-automation-admin',
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return { sub: payload.sub, username: payload.username };
  }
}
