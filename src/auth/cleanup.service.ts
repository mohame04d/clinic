import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { AUTH_CONSTANTS } from './auth.constants';

// =========================
// UNVERIFIED USER CLEANUP
// =========================
// SECURITY: Prevents database bloat from spam sign-ups.
// Runs every hour and deletes users who:
//   1. Still have a non-null verificationCode (never completed OTP verification)
//   2. Were created more than UNVERIFIED_USER_MAX_AGE_MS ago (24 hours)
@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupUnverifiedUsers() {
    const cutoff = new Date(
      Date.now() - AUTH_CONSTANTS.UNVERIFIED_USER_MAX_AGE_MS,
    );

    const result = await this.prisma.user.deleteMany({
      where: {
        verificationCode: { not: null },
        createdAt: { lt: cutoff },
      },
    });

    if (result.count > 0) {
      this.logger.log(
        `Deleted ${result.count} unverified user(s) older than 24 hours.`,
      );
    }
  }
}
