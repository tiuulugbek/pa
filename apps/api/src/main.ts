import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from './app.module';

function parseAllowedOrigins(): string[] {
  const raw = process.env.CORS_ORIGINS ?? '';
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  const allowedOrigins = parseAllowedOrigins();
  if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
    throw new Error('CORS_ORIGINS must be configured in production');
  }

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Origin is not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86_400,
  });

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      stopAtFirstError: false,
      exceptionFactory: (errors) => new BadRequestException({
        message: 'Request validation failed',
        errors,
      }),
    }),
  );

  app.use(
    '/uploads',
    express.static(join(process.cwd(), 'uploads'), {
      dotfiles: 'deny',
      fallthrough: false,
      index: false,
      maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
      immutable: false,
    }),
  );

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('PORT must be a valid TCP port');
  }

  await app.listen(port, '0.0.0.0');
  console.log(`API running on port ${port}`);
}

void bootstrap();
