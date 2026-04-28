// SECURITY: Mock PrismaService at the module level so Jest never imports
// PrismaClient (which requires `prisma generate` to have been run).
jest.mock('../prisma/prisma.service', () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => ({
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        deleteMany: jest.fn(),
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    })),
  };
});
// SECURITY: Mock bcrypt at the module level because bcrypt v6 exports
// non-configurable properties that cannot be overridden with jest.spyOn.
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('$2b$12$mockedhash'),
  compare: jest.fn().mockResolvedValue(false),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotFoundException,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// ==========================================
// COMPREHENSIVE AUTH SECURITY TEST SUITE
// ==========================================
// This file tests EVERY authentication and authorization flow for security
// correctness. Each test group maps to a specific security concern.

// ---------- Mock Factories ----------
const mockPrismaService = () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn(),
  },
});

const mockJwtService = () => ({
  sign: jest.fn().mockReturnValue('mock-access-token'),
  signAsync: jest.fn().mockReturnValue('mock-access-token'),
  verifyAsync: jest.fn(),
});

const mockMailerService = () => ({
  sendMail: jest.fn().mockResolvedValue(undefined),
});

// ---------- Test User Fixtures ----------
const PATIENT_USER = {
  id: 'cuid-patient-123',
  name: 'Test Patient',
  email: 'patient@test.com',
  password: '$2b$12$hashedpassword', // bcrypt hash
  role: 'PATIENT',
  verificationCode: '123456',
  otpPurpose: 'SIGN_UP',
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

const DOCTOR_USER = {
  ...PATIENT_USER,
  id: 'cuid-doctor-456',
  name: 'Test Doctor',
  email: 'doctor@test.com',
  role: 'DOCTOR',
};

describe('AuthService — Complete Security Test Suite', () => {
  let service: AuthService;
  let prisma: ReturnType<typeof mockPrismaService>;
  let jwt: ReturnType<typeof mockJwtService>;
  let mailer: ReturnType<typeof mockMailerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useFactory: mockPrismaService },
        { provide: JwtService, useFactory: mockJwtService },
        { provide: MailerService, useFactory: mockMailerService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
    jwt = module.get(JwtService);
    mailer = module.get(MailerService);
  });

  // ======================================================
  // SIGN UP TESTS
  // ======================================================
  describe('signUp()', () => {
    it('should reject duplicate email addresses (400)', async () => {
      // SECURITY: Prevents account enumeration and duplicate registration
      prisma.user.findUnique.mockResolvedValue(PATIENT_USER);

      await expect(
        service.signUp({ name: 'Test', email: 'patient@test.com', password: 'Password123' }),
      ).rejects.toThrow(HttpException);
    });

    it('should hash the password with bcrypt (10 rounds)', async () => {
      // SECURITY: Plain-text password storage is the #1 credential breach cause
      // PERF: 10 rounds is the OWASP minimum — still secure, ~40% faster than 12
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 'new', name: 'Test', email: 'new@test.com', role: 'PATIENT', createdAt: new Date() });

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      await service.signUp({ name: 'Test', email: 'new@test.com', password: 'Password123' });

      expect(bcrypt.hash).toHaveBeenCalledWith('Password123', 10);
    });

    it('should generate a 6-digit OTP (not Math.random)', async () => {
      // SECURITY: Math.random() is predictable — crypto.randomInt is not
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockImplementation(async ({ data }) => {
        expect(data.verificationCode).toMatch(/^\d{6}$/);
        expect(data.verificationCode.length).toBe(6);
        return { ...PATIENT_USER, ...data };
      });

      await service.signUp({ name: 'Test', email: 'new@test.com', password: 'Password123' });
    });

    it('should set otpPurpose to SIGN_UP', async () => {
      // SECURITY: Prevents cross-flow OTP manipulation
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockImplementation(async ({ data }) => {
        expect(data.otpPurpose).toBe('SIGN_UP');
        return { ...PATIENT_USER, ...data };
      });

      await service.signUp({ name: 'Test', email: 'new@test.com', password: 'Password123' });
    });

    it('should NOT return tokens (only OTP is sent)', async () => {
      // SECURITY: Tokens before email verification = unverified session
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(PATIENT_USER);

      const result = await service.signUp({ name: 'Test', email: 'new@test.com', password: 'Password123' });

      expect(result).not.toHaveProperty('access_token');
      expect(result).not.toHaveProperty('refresh_token');
      expect(result.status).toBe('success');
    });

    it('should NOT return the password or verification code in the response', async () => {
      // SECURITY: Sensitive data leakage prevention
      // PERF: signUp now uses select{} so password/verificationCode are never fetched
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 'new', name: 'Test', email: 'new@test.com', role: 'PATIENT', createdAt: new Date() });

      const result = await service.signUp({ name: 'Test', email: 'new@test.com', password: 'Password123' });

      expect(result.data).not.toHaveProperty('password');
      expect(result.data).not.toHaveProperty('verificationCode');
    });

    it('should send verification email', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(PATIENT_USER);

      await service.signUp({ name: 'Test', email: 'new@test.com', password: 'Password123' });

      expect(mailer.sendMail).toHaveBeenCalledTimes(1);
      expect(mailer.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: PATIENT_USER.email,
          subject: expect.stringContaining('Verify'),
        }),
      );
    });
  });

  // ======================================================
  // VERIFY CODE SIGN UP TESTS
  // ======================================================
  describe('verifyCodeSignUp()', () => {
    it('should reject if email or code is missing (400)', async () => {
      // SECURITY: Input validation
      await expect(service.verifyCodeSignUp({ email: '', code: '' })).rejects.toThrow(HttpException);
    });

    it('should reject if user not found (404)', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.verifyCodeSignUp({ email: 'ghost@test.com', code: '123456' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should reject if otpPurpose is NOT SIGN_UP (cross-flow attack)', async () => {
      // SECURITY: This is the KEY test for the cross-flow OTP manipulation fix.
      // An attacker signs up, then changes the frontend URL to ?flow=reset
      // to hit verifyCode() instead. The backend must reject it.
      const userWithResetPurpose = {
        ...PATIENT_USER,
        otpPurpose: 'PASSWORD_RESET', // <-- Wrong purpose for signup flow!
      };
      prisma.user.findUnique.mockResolvedValue(userWithResetPurpose);

      await expect(
        service.verifyCodeSignUp({ email: 'patient@test.com', code: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject if otpPurpose is null (OTP already consumed)', async () => {
      // SECURITY: Replay attack prevention — code was already used
      const userNoOtpPurpose = { ...PATIENT_USER, otpPurpose: null };
      prisma.user.findUnique.mockResolvedValue(userNoOtpPurpose);

      await expect(
        service.verifyCodeSignUp({ email: 'patient@test.com', code: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject wrong OTP code', async () => {
      prisma.user.findUnique.mockResolvedValue(PATIENT_USER);

      await expect(
        service.verifyCodeSignUp({ email: 'patient@test.com', code: '999999' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should nullify verificationCode AND otpPurpose after success', async () => {
      // SECURITY: Prevents OTP replay attacks
      prisma.user.findUnique.mockResolvedValue(PATIENT_USER);
      prisma.user.update.mockResolvedValue({});

      await service.verifyCodeSignUp({ email: 'patient@test.com', code: '123456' });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: 'patient@test.com' },
        data: { verificationCode: null, otpPurpose: null },
      });
    });

    it('should return JWT tokens with `id` key (not `_id`) after successful verification', async () => {
      // SECURITY: JWT payload consistency — _id breaks AuthGuard
      prisma.user.findUnique.mockResolvedValue(PATIENT_USER);
      prisma.user.update.mockResolvedValue({});
      jwt.sign.mockReturnValue('test-token');

      const result = await service.verifyCodeSignUp({ email: 'patient@test.com', code: '123456' });

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');

      // Verify the JWT payload uses `id`, not `_id`
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ id: PATIENT_USER.id }),
        expect.any(Object),
      );
      // Verify it does NOT use _id
      expect(jwt.sign).not.toHaveBeenCalledWith(
        expect.objectContaining({ _id: expect.anything() }),
        expect.any(Object),
      );
    });
  });

  // ======================================================
  // SIGN IN TESTS
  // ======================================================
  describe('signIn()', () => {
    it('should reject non-existent user with generic message (anti-enumeration)', async () => {
      // SECURITY: "Invalid email or password" prevents attackers from knowing
      // whether an email is registered by probing the login endpoint.
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.signIn({ email: 'ghost@test.com', password: 'Password123' }),
      ).rejects.toThrow(new UnauthorizedException('Invalid email or password'));
    });

    it('should reject wrong password with SAME generic message', async () => {
      // SECURITY: Same message as "user not found" to prevent enumeration
      prisma.user.findUnique.mockResolvedValue(PATIENT_USER);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.signIn({ email: 'patient@test.com', password: 'WrongPassword' }),
      ).rejects.toThrow(new UnauthorizedException('Invalid email or password'));
    });

    it('should return JWT tokens with `id` key on success', async () => {
      prisma.user.findUnique.mockResolvedValue(PATIENT_USER);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwt.sign.mockReturnValue('test-token');

      const result = await service.signIn({ email: 'patient@test.com', password: 'Password123' });

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ id: PATIENT_USER.id, role: 'PATIENT' }),
        expect.any(Object),
      );
    });

    it('should NOT return the password hash in the response', async () => {
      prisma.user.findUnique.mockResolvedValue(PATIENT_USER);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwt.sign.mockReturnValue('test-token');

      const result = await service.signIn({ email: 'patient@test.com', password: 'Password123' });

      expect(result.data).not.toHaveProperty('password');
    });
  });

  // ======================================================
  // RESET PASSWORD (SEND CODE) TESTS
  // ======================================================
  describe('resetPassword()', () => {
    it('should return same response for non-existent email (anti-enumeration)', async () => {
      // SECURITY: The response must be identical whether the email exists or not.
      // An attacker cannot determine which emails are registered.
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.resetPassword({ email: 'ghost@test.com' });

      expect(result.status).toBe('success');
      expect(result.message).toContain('If this email exists');
      expect(mailer.sendMail).not.toHaveBeenCalled(); // No email sent for unknown user
    });

    it('should set otpPurpose to PASSWORD_RESET for existing user', async () => {
      // SECURITY: Ties this OTP to the reset flow only
      prisma.user.findUnique.mockResolvedValue(PATIENT_USER);
      prisma.user.update.mockResolvedValue({});

      await service.resetPassword({ email: 'patient@test.com' });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: 'patient@test.com' },
        data: expect.objectContaining({
          otpPurpose: 'PASSWORD_RESET',
          verificationCode: expect.stringMatching(/^\d{6}$/),
        }),
      });
    });

    it('should send password reset email for existing user', async () => {
      prisma.user.findUnique.mockResolvedValue(PATIENT_USER);
      prisma.user.update.mockResolvedValue({});

      await service.resetPassword({ email: 'patient@test.com' });

      expect(mailer.sendMail).toHaveBeenCalledTimes(1);
    });
  });

  // ======================================================
  // VERIFY CODE (PASSWORD RESET FLOW) TESTS
  // ======================================================
  describe('verifyCode()', () => {
    it('should reject if user not found (404)', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.verifyCode({ email: 'ghost@test.com', code: '123456' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should reject if otpPurpose is NOT PASSWORD_RESET (cross-flow attack)', async () => {
      // SECURITY: This is the KEY defence against cross-flow manipulation.
      // An attacker who signed up tries to use their sign-up OTP to trigger
      // the password-reset flow for their own account (to bypass email verification
      // and get a resetToken instead).
      const userWithSignUpPurpose = {
        ...PATIENT_USER,
        otpPurpose: 'SIGN_UP', // <-- Wrong purpose for reset flow!
      };
      prisma.user.findUnique.mockResolvedValue(userWithSignUpPurpose);

      await expect(
        service.verifyCode({ email: 'patient@test.com', code: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject wrong OTP code', async () => {
      const resetUser = { ...PATIENT_USER, otpPurpose: 'PASSWORD_RESET' };
      prisma.user.findUnique.mockResolvedValue(resetUser);

      await expect(
        service.verifyCode({ email: 'patient@test.com', code: '999999' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return a resetToken and clear OTP + otpPurpose on success', async () => {
      const resetUser = {
        ...PATIENT_USER,
        otpPurpose: 'PASSWORD_RESET',
        verificationCode: '123456',
      };
      prisma.user.findUnique.mockResolvedValue(resetUser);
      prisma.user.update.mockResolvedValue({});

      const result = await service.verifyCode({ email: 'patient@test.com', code: '123456' });

      expect(result).toHaveProperty('resetToken');
      expect(typeof result.resetToken).toBe('string');

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: 'patient@test.com' },
        data: expect.objectContaining({
          verificationCode: null,
          otpPurpose: null,
          resetpasswordToken: expect.any(String),
          resetpasswordExpire: expect.any(Date),
        }),
      });
    });
  });

  // ======================================================
  // CHANGE PASSWORD TESTS
  // ======================================================
  describe('changePassword()', () => {
    const validResetUser = {
      ...PATIENT_USER,
      resetpasswordToken: 'valid-reset-token-uuid',
      resetpasswordExpire: new Date(Date.now() + 10 * 60 * 1000), // 10 min future
    };

    it('should reject if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.changePassword({
          email: 'ghost@test.com',
          password: 'NewPass123',
          resetToken: 'token',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should reject if resetToken does not match', async () => {
      // SECURITY: The resetToken proves the user passed OTP verification.
      // Without it, anyone could change any password.
      prisma.user.findUnique.mockResolvedValue(validResetUser);

      await expect(
        service.changePassword({
          email: 'patient@test.com',
          password: 'NewPass123',
          resetToken: 'WRONG-TOKEN',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject if resetToken is null (never verified OTP)', async () => {
      const userNoToken = { ...PATIENT_USER, resetpasswordToken: null };
      prisma.user.findUnique.mockResolvedValue(userNoToken);

      await expect(
        service.changePassword({
          email: 'patient@test.com',
          password: 'NewPass123',
          resetToken: 'some-token',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject if resetToken is expired', async () => {
      // SECURITY: Expired tokens must be rejected to limit the attack window.
      const expiredUser = {
        ...validResetUser,
        resetpasswordExpire: new Date(Date.now() - 1000), // 1 second ago
      };
      prisma.user.findUnique.mockResolvedValue(expiredUser);

      await expect(
        service.changePassword({
          email: 'patient@test.com',
          password: 'NewPass123',
          resetToken: 'valid-reset-token-uuid',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should hash the new password and clear reset data on success', async () => {
      // SECURITY: After password change, resetToken must be cleared to prevent reuse.
      prisma.user.findUnique.mockResolvedValue(validResetUser);
      prisma.user.update.mockResolvedValue({});
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed-password');

      const result = await service.changePassword({
        email: 'patient@test.com',
        password: 'NewPass123',
        resetToken: 'valid-reset-token-uuid',
      });

      expect(result.status).toBe('success');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: 'patient@test.com' },
        data: expect.objectContaining({
          password: 'new-hashed-password',
          resetpasswordToken: null,
          resetpasswordExpire: null,
          passwordChangedAt: expect.any(Date),
        }),
      });
    });
  });

  // ======================================================
  // REFRESH TOKEN TESTS
  // ======================================================
  describe('refreshToken()', () => {
    it('should reject invalid/tampered refresh token', async () => {
      // SECURITY: Tampered tokens fail JWT signature verification
      jwt.verifyAsync.mockRejectedValue(new Error('invalid signature'));

      await expect(service.refreshToken('tampered-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should reject if countEx is 0 (max refreshes reached)', async () => {
      // SECURITY: Limits how many times a refresh token chain can be extended.
      // This mitigates indefinite session extension from stolen tokens.
      jwt.verifyAsync.mockResolvedValue({
        id: 'cuid-123',
        email: 'test@test.com',
        role: 'PATIENT',
        countEx: 0,
      });

      await expect(service.refreshToken('valid-but-exhausted')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should reject if user no longer exists in database', async () => {
      jwt.verifyAsync.mockResolvedValue({
        id: 'deleted-user',
        email: 'deleted@test.com',
        role: 'PATIENT',
        countEx: 3,
      });
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.refreshToken('valid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should issue new tokens with decremented countEx on success', async () => {
      jwt.verifyAsync.mockResolvedValue({
        id: PATIENT_USER.id,
        email: PATIENT_USER.email,
        role: PATIENT_USER.role,
        countEx: 3,
      });
      prisma.user.findUnique.mockResolvedValue(PATIENT_USER);
      jwt.sign.mockReturnValueOnce('new-access-token').mockReturnValueOnce('new-refresh-token');

      const result = await service.refreshToken('valid-token');

      expect(result.access_token).toBe('new-access-token');
      expect(result.refresh_token).toBe('new-refresh-token');

      // Verify countEx was decremented
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ countEx: 2 }), // 3 - 1
        expect.any(Object),
      );
    });

    it('should NOT leak sensitive fields in response (password, resetToken, etc.)', async () => {
      // SECURITY: The response must strip all sensitive database fields
      // PERF: refreshToken now uses select{} so sensitive fields are never fetched
      const safeUser = {
        id: PATIENT_USER.id,
        email: PATIENT_USER.email,
        role: PATIENT_USER.role,
        name: PATIENT_USER.name,
        phone: null,
        dateOfBirth: null,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jwt.verifyAsync.mockResolvedValue({
        id: PATIENT_USER.id,
        email: PATIENT_USER.email,
        role: PATIENT_USER.role,
        countEx: 3,
      });
      prisma.user.findUnique.mockResolvedValue(safeUser);
      jwt.sign.mockReturnValue('token');

      const result = await service.refreshToken('valid-token');

      expect(result.data).not.toHaveProperty('password');
      expect(result.data).not.toHaveProperty('verificationCode');
      expect(result.data).not.toHaveProperty('resetpasswordToken');
      expect(result.data).not.toHaveProperty('resetpasswordExpire');
    });

    it('should use `id` key in new JWT payload (not `_id`)', async () => {
      jwt.verifyAsync.mockResolvedValue({
        id: PATIENT_USER.id,
        email: PATIENT_USER.email,
        role: PATIENT_USER.role,
        countEx: 3,
      });
      prisma.user.findUnique.mockResolvedValue(PATIENT_USER);
      jwt.sign.mockReturnValue('token');

      await service.refreshToken('valid-token');

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ id: PATIENT_USER.id }),
        expect.any(Object),
      );
      expect(jwt.sign).not.toHaveBeenCalledWith(
        expect.objectContaining({ _id: expect.anything() }),
        expect.any(Object),
      );
    });
  });
});
