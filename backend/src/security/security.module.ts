import { Module } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { RateLimiterService } from './rate-limiter.service';
import { AuditService } from './audit.service';
import { RedisModule } from '../redis/redis.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [RedisModule, AuditModule],
  controllers: [],
  providers: [BlacklistService, RateLimiterService, AuditService],
  exports: [BlacklistService, RateLimiterService, AuditService],
})
export class SecurityModule {}
