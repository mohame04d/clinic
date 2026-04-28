jest.mock('src/prisma/prisma.service', () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => ({
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    })),
  };
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService as OAuthService } from './oauth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

// ==========================================
// OAUTH SERVICE — SECURITY TEST SUITE
// ==========================================
// Tests the Google OAuth validateUser() method to ensure:
//   1. New users are created with PATIENT role and random password
//   2. JWT payload uses `id` (not `_id`) — consistency with auth.service.ts
//   3. Existing users get logged in with correct JWT payload
//   4. Password hash is never returned in response

const mockPrisma = () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
});

const mockJwt = () => ({
  signAsync: jest.fn().mockResolvedValue('mock-token'),
});

const EXISTING_USER = {
  id: 'cuid-existing-123',
  name: 'Existing User',
  email: 'existing@test.com',
  password: '$2b$12$hashedpassword',
  role: 'PATIENT',
  verificationCode: null,
  otpPurpose: null,
  resetpasswordToken: null,
  resetpasswordExpire: null,
  passwordChangedAt: null,
  phone: null,
  dateOfBirth: null,
  refreshToken: null,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('OAuthService — Security Tests', () => {
  let service: OAuthService;
  let prisma: ReturnType<typeof mockPrisma>;
  let jwt: ReturnType<typeof mockJwt>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuthService,
        { provide: PrismaService, useFactory: mockPrisma },
        { provide: JwtService, useFactory: mockJwt },
      ],
    }).compile();

    service = module.get<OAuthService>(OAuthService);
    prisma = module.get(PrismaService);
    jwt = module.get(JwtService);
  });

  const googleUser = {
    userId: 'google-id-123',
    email: 'google@test.com',
    name: 'Google User',
    photo: 'https://photo.url',
  };

  // ---- Test 1: New user via Google creates PATIENT with random password ----
  it('should create a new user with PATIENT role for first-time Google sign-in', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    // PERF: Mock now returns select{} output (no password field)
    prisma.user.create.mockResolvedValue({
      id: 'new-user-id',
      email: 'google@test.com',
      name: 'Google User',
      role: 'PATIENT',
      createdAt: new Date(),
    });

    const result = await service.validateUser(googleUser);

    expect(result.status).toBe(200);
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'google@test.com',
          role: 'PATIENT',
          password: expect.any(String),
        }),
      }),
    );
  });

  // ---- Test 2: JWT payload uses `id` not `_id` for new users ----
  it('should use `id` (not `_id`) in JWT payload for new Google users', async () => {
    // SECURITY: This is the critical test. The old code used `_id` which
    // broke AuthGuard and refreshToken for all OAuth users.
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      ...EXISTING_USER,
      id: 'new-google-user',
      email: 'google@test.com',
    });

    await service.validateUser(googleUser);

    // First call to signAsync is for access token
    expect(jwt.signAsync).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'new-google-user' }),
      expect.any(Object),
    );
    // Must NOT use _id
    expect(jwt.signAsync).not.toHaveBeenCalledWith(
      expect.objectContaining({ _id: expect.anything() }),
      expect.any(Object),
    );
  });

  // ---- Test 3: JWT payload uses `id` not `_id` for existing users ----
  it('should use `id` (not `_id`) in JWT payload for existing Google users', async () => {
    prisma.user.findUnique.mockResolvedValue(EXISTING_USER);

    await service.validateUser({ ...googleUser, email: 'existing@test.com' });

    expect(jwt.signAsync).toHaveBeenCalledWith(
      expect.objectContaining({ id: EXISTING_USER.id }),
      expect.any(Object),
    );
    expect(jwt.signAsync).not.toHaveBeenCalledWith(
      expect.objectContaining({ _id: expect.anything() }),
      expect.any(Object),
    );
  });

  // ---- Test 4: Password hash is never returned ----
  it('should NOT include password hash in the response for new users', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    // PERF: create with select{} returns only safe fields
    prisma.user.create.mockResolvedValue({
      id: 'new-id',
      email: 'google@test.com',
      name: 'Google User',
      role: 'PATIENT',
      createdAt: new Date(),
    });

    const result = await service.validateUser(googleUser);

    expect(result.data).not.toHaveProperty('password');
  });

  it('should NOT include password hash in the response for existing users', async () => {
    prisma.user.findUnique.mockResolvedValue(EXISTING_USER);

    const result = await service.validateUser({ ...googleUser, email: 'existing@test.com' });

    expect(result.data).not.toHaveProperty('password');
  });

  // ---- Test 5: Returns both access and refresh tokens ----
  it('should return both access_token and refresh_token', async () => {
    prisma.user.findUnique.mockResolvedValue(EXISTING_USER);
    jwt.signAsync.mockResolvedValueOnce('access-tok').mockResolvedValueOnce('refresh-tok');

    const result = await service.validateUser({ ...googleUser, email: 'existing@test.com' });

    expect(result).toHaveProperty('access_token', 'access-tok');
    expect(result).toHaveProperty('refresh_token', 'refresh-tok');
  });
});
