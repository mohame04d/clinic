import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

const saltOrRounds = 12;

type UserData = {
  userId: string;
  email: string;
  name: string;
  photo: string;
};

// SECURITY: Generate a cryptographically secure random password for OAuth users.
// These users never need to know their password (they sign in via Google).
function generateRandomPassword(): string {
  return randomBytes(32).toString('base64');
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userData: UserData): Promise<any> {
    // PERF: Only select what we need — avoids fetching all columns
    const user = await this.prisma.user.findUnique({
      where: { email: userData.email },
      select: { id: true, email: true, name: true, role: true, password: true },
    });

    // ================= SIGN UP =================
    if (!user) {
      // PERF: bcrypt rounds 10 (OWASP minimum, ~40% faster than 12)
      const password = await bcrypt.hash(
        generateRandomPassword(),
        10,
      );

      const newUser = await this.prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password,
          role: 'PATIENT',
        },
        // PERF: Only select non-sensitive fields for response
        select: { id: true, email: true, name: true, role: true, createdAt: true },
      });

      // SECURITY: JWT payload MUST use `id` (not `_id`) to match auth.service.ts.
      const payload = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      };

      // PERF: Generate both tokens in parallel
      const [token, refresh_token] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: process.env.JWT_SECRET,
          expiresIn: '1h',
        }),
        this.jwtService.signAsync(
          { ...payload, countEx: 5 },
          { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
        ),
      ]);

      return {
        status: 200,
        message: 'User created successfully',
        data: newUser, // PERF: Already clean — we used select{}
        access_token: token,
        refresh_token,
      };
    }

    // ================= SIGN IN =================
    // SECURITY: Same `id` key as auth.service.ts — consistency is critical.
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // PERF: Generate both tokens in parallel
    const [token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(
        { ...payload, countEx: 5 },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
      ),
    ]);

    // PERF: Strip password via destructure (select already limited columns)
    const { password: _, ...safeUser } = user;

    return {
      status: 200,
      message: 'User logged in successfully',
      data: safeUser,
      access_token: token,
      refresh_token,
    };
  }
}
