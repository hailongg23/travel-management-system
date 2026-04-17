import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { AuditService as DatabaseAuditService } from '../audit/audit.service';

export interface AuditEvent {
  userId?: string;
  action: string;
  resource?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
}

@Injectable()
export class AuditService {
  constructor(
    private readonly redisService: RedisService,
    private readonly databaseAuditService: DatabaseAuditService,
  ) {}

  async logEvent(event: Omit<AuditEvent, 'timestamp'>): Promise<void> {
    const auditEvent: AuditEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    // Store in Redis with TTL (30 days) for fast access
    const key = `audit:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    await this.redisService.set(key, auditEvent, 30 * 24 * 60 * 60);

    // Also store in MongoDB database for permanent storage
    if (event.userId) {
      await this.databaseAuditService.logAction(
        event.userId,
        event.action,
        event.resource || 'unknown',
        {
          details: event.details,
          success: event.success,
          errorMessage: event.errorMessage,
        },
        event.ipAddress,
        event.userAgent,
      );

      // Store in user-specific Redis audit log for fast access
      const userKey = `user_audit:${event.userId}`;
      const userEvents = (await this.redisService.get<string[]>(userKey)) || [];
      userEvents.push(key);

      // Keep only last 100 events per user in Redis
      if (userEvents.length > 100) {
        const oldEvent = userEvents.shift();
        if (oldEvent) {
          await this.redisService.del(oldEvent);
        }
      }

      await this.redisService.set(userKey, userEvents, 30 * 24 * 60 * 60);
    }
  }

  async getUserAuditLog(
    userId: string,
    limit: number = 50,
  ): Promise<AuditEvent[]> {
    const userKey = `user_audit:${userId}`;
    const eventKeys = (await this.redisService.get<string[]>(userKey)) || [];

    const events: AuditEvent[] = [];
    const keysToFetch = eventKeys.slice(-limit); // Get last N events

    for (const key of keysToFetch) {
      const event = await this.redisService.get<AuditEvent>(key);
      if (event) {
        events.push(event);
      }
    }

    return events.reverse(); // Most recent first
  }

  async logLogin(
    userId: string,
    success: boolean,
    ipAddress?: string,
    userAgent?: string,
    errorMessage?: string,
  ): Promise<void> {
    await this.logEvent({
      userId,
      action: 'LOGIN',
      success,
      ipAddress,
      userAgent,
      errorMessage,
    });
  }

  async logLogout(
    userId: string,
    sessionId?: string,
    ipAddress?: string,
  ): Promise<void> {
    await this.logEvent({
      userId,
      action: 'LOGOUT',
      details: { sessionId },
      success: true,
      ipAddress,
    });
  }

  async logRegister(
    userId: string,
    email: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.logEvent({
      userId,
      action: 'REGISTER',
      details: { email },
      success: true,
      ipAddress,
      userAgent,
    });
  }

  async logPasswordReset(userId: string, ipAddress?: string): Promise<void> {
    await this.logEvent({
      userId,
      action: 'PASSWORD_RESET',
      success: true,
      ipAddress,
    });
  }

  async logFailedAuthentication(
    action: string,
    identifier: string,
    ipAddress?: string,
    errorMessage?: string,
  ): Promise<void> {
    await this.logEvent({
      action: `FAILED_${action}`,
      details: { identifier },
      success: false,
      ipAddress,
      errorMessage,
    });
  }

  async logSecurityEvent(
    event: string,
    details: any,
    userId?: string,
    ipAddress?: string,
  ): Promise<void> {
    await this.logEvent({
      userId,
      action: 'SECURITY_EVENT',
      resource: event,
      details,
      success: true,
      ipAddress,
    });
  }

  async getSecurityEvents(limit: number = 100): Promise<AuditEvent[]> {
    const pattern = 'audit:*';
    const keys = await this.redisService.keys(pattern);

    // Sort by timestamp (keys contain timestamp)
    keys.sort().reverse();

    const events: AuditEvent[] = [];
    const keysToFetch = keys.slice(0, limit);

    for (const key of keysToFetch) {
      const event = await this.redisService.get<AuditEvent>(key);
      if (event && event.action.includes('SECURITY_EVENT')) {
        events.push(event);
      }
    }

    return events;
  }

  async cleanupOldEvents(): Promise<void> {
    // This method can be called by a cron job to cleanup very old events
    // Redis TTL should handle most cleanup, but this provides additional cleanup
    const cutoffTime = Date.now() - 90 * 24 * 60 * 60 * 1000; // 90 days ago
    const pattern = 'audit:*';
    const keys = await this.redisService.keys(pattern);

    for (const key of keys) {
      const timestampMatch = key.match(/audit:(\d+):/);
      if (timestampMatch) {
        const timestamp = parseInt(timestampMatch[1]);
        if (timestamp < cutoffTime) {
          await this.redisService.del(key);
        }
      }
    }
  }
}
