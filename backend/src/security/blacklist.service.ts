import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class BlacklistService {
  constructor(private readonly redisService: RedisService) {}

  async addToBlacklist(token: string, ttl?: number): Promise<void> {
    const key = `blacklist:${token}`;
    await this.redisService.set(key, true, ttl || 86400); // Default 24 hours
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist:${token}`;
    return await this.redisService.exists(key);
  }

  async removeFromBlacklist(token: string): Promise<void> {
    const key = `blacklist:${token}`;
    await this.redisService.del(key);
  }

  async addUserTokensToBlacklist(
    userId: string,
    tokens: string[],
  ): Promise<void> {
    const promises = tokens.map((token) => this.addToBlacklist(token));
    await Promise.all(promises);
  }

  async cleanupExpiredTokens(): Promise<void> {
    // This method can be called by a cron job to cleanup expired blacklisted tokens
    // Redis automatically handles TTL, but we can also manually clean up if needed
    const pattern = 'blacklist:*';
    const keys = await this.redisService.keys(pattern);

    for (const key of keys) {
      const ttl = await this.redisService.ttl(key);
      if (ttl === -1) {
        // No expiration set
        await this.redisService.expire(key, 86400); // Set 24 hour expiration
      }
    }
  }
}
