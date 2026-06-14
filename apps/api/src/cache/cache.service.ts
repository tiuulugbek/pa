import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Thin Redis cache wrapper with graceful degradation: if REDIS_URL is not
 * configured or Redis is unreachable, every operation becomes a no-op and the
 * app falls back to hitting the database directly.
 */
@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private client?: Redis;
  private healthy = false;

  onModuleInit(): void {
    const url = process.env.REDIS_URL;
    if (!url) {
      this.logger.warn('REDIS_URL not set — response caching disabled.');
      return;
    }
    this.client = new Redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 1000)),
    });
    this.client.on('error', () => {
      if (this.healthy) this.logger.warn('Redis connection lost — bypassing cache.');
      this.healthy = false;
    });
    this.client.on('ready', () => {
      this.healthy = true;
      this.logger.log('Redis cache connected.');
    });
    this.client.connect().catch(() => {
      this.logger.warn('Redis unavailable — response caching disabled.');
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.client?.quit().catch(() => undefined);
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client || !this.healthy) return null;
    try {
      const raw = await this.client.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    if (!this.client || !this.healthy) return;
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      /* ignore cache write failures */
    }
  }

  /** Invalidate all keys matching a prefix (e.g. after admin mutations). */
  async invalidate(prefix: string): Promise<void> {
    if (!this.client || !this.healthy) return;
    try {
      const keys = await this.client.keys(`${prefix}*`);
      if (keys.length) await this.client.del(...keys);
    } catch {
      /* ignore */
    }
  }

  /** Get from cache or compute and store. */
  async wrap<T>(key: string, ttlSeconds: number, producer: () => Promise<T>): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;
    const fresh = await producer();
    await this.set(key, fresh, ttlSeconds);
    return fresh;
  }
}
