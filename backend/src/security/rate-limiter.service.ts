import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  blockDuration?: number; // Block duration in seconds (optional)
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  totalHits: number;
}

@Injectable()
export class RateLimiterService {
  constructor(private readonly redisService: RedisService) {}

  async checkRateLimit(
    identifier: string,
    config: RateLimitConfig,
    category: string = 'default',
  ): Promise<RateLimitResult> {
    const key = `rate_limit:${category}:${identifier}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get current count
    const currentCount = (await this.redisService.get<number>(key)) || 0;

    // Check if limit exceeded
    if (currentCount >= config.maxRequests) {
      const ttl = await this.redisService.ttl(key);
      const resetTime = now + ttl * 1000;

      return {
        allowed: false,
        remaining: 0,
        resetTime,
        totalHits: currentCount,
      };
    }

    // Increment counter
    const newCount = await this.redisService.increment(
      key,
      Math.ceil(config.windowMs / 1000),
    );

    return {
      allowed: true,
      remaining: Math.max(0, config.maxRequests - newCount),
      resetTime: now + config.windowMs,
      totalHits: newCount,
    };
  }

  async resetRateLimit(
    identifier: string,
    category: string = 'default',
  ): Promise<void> {
    const key = `rate_limit:${category}:${identifier}`;
    await this.redisService.del(key);
  }

  async blockUser(
    identifier: string,
    durationSeconds: number,
    category: string = 'blocked',
  ): Promise<void> {
    const key = `rate_limit:${category}:${identifier}`;
    await this.redisService.set(key, 'blocked', durationSeconds);
  }

  async isBlocked(
    identifier: string,
    category: string = 'blocked',
  ): Promise<boolean> {
    const key = `rate_limit:${category}:${identifier}`;
    const result = await this.redisService.get(key);
    return result === 'blocked';
  }

  async unblockUser(
    identifier: string,
    category: string = 'blocked',
  ): Promise<void> {
    const key = `rate_limit:${category}:${identifier}`;
    await this.redisService.del(key);
  }
  async checkLoginRateLimit(identifier: string): Promise<RateLimitResult> {
    return this.checkRateLimit(
      identifier,
      {
        windowMs: 5 * 60 * 1000, // 5 minutes
        maxRequests: 25, // 25 attempts per 5 minutes (increased for large systems)
      },
      'login',
    );
  }

  async checkRegisterRateLimit(identifier: string): Promise<RateLimitResult> {
    return this.checkRateLimit(
      identifier,
      {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 20, // 20 registrations per hour (increased for large systems)
      },
      'register',
    );
  }

  async checkPasswordResetRateLimit(
    identifier: string,
  ): Promise<RateLimitResult> {
    return this.checkRateLimit(
      identifier,
      {
        windowMs: 30 * 60 * 1000, // 30 minutes
        maxRequests: 10, // 10 reset attempts per 30 minutes (increased)
      },
      'password_reset',
    );
  }

  async recordFailedLogin(identifier: string): Promise<void> {
    const key = `failed_login:${identifier}`;
    const count = await this.redisService.increment(key, 2 * 60 * 60); // 2 hours TTL

    // Progressive blocking for large systems: More lenient thresholds
    if (count >= 25) {
      await this.blockUser(identifier, 2 * 60 * 60, 'login_blocked'); // Block for 2 hours after 25 attempts
    } else if (count >= 20) {
      await this.blockUser(identifier, 1 * 60 * 60, 'login_blocked'); // Block for 1 hour after 20 attempts
    } else if (count >= 15) {
      await this.blockUser(identifier, 30 * 60, 'login_blocked'); // Block for 30 minutes after 15 attempts
    } else if (count >= 10) {
      await this.blockUser(identifier, 15 * 60, 'login_blocked'); // Block for 15 minutes after 10 attempts
    }
  }

  async clearFailedLogins(identifier: string): Promise<void> {
    const key = `failed_login:${identifier}`;
    await this.redisService.del(key);
  }

  async getFailedLoginCount(identifier: string): Promise<number> {
    const key = `failed_login:${identifier}`;
    return (await this.redisService.get<number>(key)) || 0;
  }

  // Add whitelist functionality for trusted IPs/users
  async addToWhitelist(
    identifier: string,
    category: string = 'whitelist',
    durationSeconds?: number,
  ): Promise<void> {
    const key = `whitelist:${category}:${identifier}`;
    if (durationSeconds) {
      await this.redisService.set(key, 'whitelisted', durationSeconds);
    } else {
      await this.redisService.set(key, 'whitelisted');
    }
  }

  async isWhitelisted(
    identifier: string,
    category: string = 'whitelist',
  ): Promise<boolean> {
    const key = `whitelist:${category}:${identifier}`;
    const result = await this.redisService.get(key);
    return result === 'whitelisted';
  }

  async removeFromWhitelist(
    identifier: string,
    category: string = 'whitelist',
  ): Promise<void> {
    const key = `whitelist:${category}:${identifier}`;
    await this.redisService.del(key);
  }

  // Get rate limit status for monitoring
  async getRateLimitStatus(
    identifier: string,
    category: string,
  ): Promise<{
    currentCount: number;
    ttl: number;
    isBlocked: boolean;
    isWhitelisted: boolean;
  }> {
    const key = `rate_limit:${category}:${identifier}`;
    const currentCount = (await this.redisService.get<number>(key)) || 0;
    const ttl = await this.redisService.ttl(key);
    const isBlocked = await this.isBlocked(identifier, category + '_blocked');
    const isWhitelisted = await this.isWhitelisted(identifier, category);

    return {
      currentCount,
      ttl,
      isBlocked,
      isWhitelisted,
    };
  }
}
