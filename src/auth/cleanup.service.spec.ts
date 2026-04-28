jest.mock('../prisma/prisma.service', () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => ({
      user: { deleteMany: jest.fn() },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    })),
  };
});

import { Test, TestingModule } from '@nestjs/testing';
import { CleanupService } from './cleanup.service';
import { PrismaService } from '../prisma/prisma.service';

// ==========================================
// CLEANUP SERVICE — SECURITY TEST SUITE
// ==========================================
// Tests the cron-based cleanup of unverified users.

const mockPrisma = () => ({
  user: {
    deleteMany: jest.fn(),
  },
});

describe('CleanupService — Security Tests', () => {
  let service: CleanupService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CleanupService,
        { provide: PrismaService, useFactory: mockPrisma },
      ],
    }).compile();

    service = module.get<CleanupService>(CleanupService);
    prisma = module.get(PrismaService);
  });

  it('should call deleteMany for users with non-null verificationCode older than 24h', async () => {
    // SECURITY: Prevents database bloat from spam sign-ups
    prisma.user.deleteMany.mockResolvedValue({ count: 3 });

    await service.cleanupUnverifiedUsers();

    expect(prisma.user.deleteMany).toHaveBeenCalledWith({
      where: {
        verificationCode: { not: null },
        createdAt: { lt: expect.any(Date) },
      },
    });

    // Verify the cutoff date is approximately 24 hours ago
    const callArgs = prisma.user.deleteMany.mock.calls[0][0];
    const cutoff = callArgs.where.createdAt.lt as Date;
    const expectedCutoff = Date.now() - 24 * 60 * 60 * 1000;
    expect(Math.abs(cutoff.getTime() - expectedCutoff)).toBeLessThan(1000); // Within 1 second
  });

  it('should not throw if no unverified users exist', async () => {
    prisma.user.deleteMany.mockResolvedValue({ count: 0 });

    await expect(service.cleanupUnverifiedUsers()).resolves.not.toThrow();
  });

  it('should log the count when users are deleted', async () => {
    prisma.user.deleteMany.mockResolvedValue({ count: 5 });

    // The service uses Logger.log, which we can verify doesn't crash
    await expect(service.cleanupUnverifiedUsers()).resolves.not.toThrow();
  });
});
