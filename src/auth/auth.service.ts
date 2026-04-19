import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { randomInt } from 'crypto';

import {
  SignInDto,
  SignUpDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/auth.dto';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../prisma/prisma.service'; 

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly mailService: MailerService,
    private prisma: PrismaService,
  ) {}

  // =========================
  // SIGN UP
  // =========================
  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signUpDto.email },
    });

    if (existingUser) {
      throw new HttpException('User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 12);

    // SECURITY: Use cryptographically secure random number for OTP generation.
    // Math.random() is NOT suitable for security-sensitive values.
    const code = randomInt(0, 1000000).toString().padStart(6, '0');

    const user = await this.prisma.user.create({
      data: {
        name: signUpDto.name,
        email: signUpDto.email,
        password: hashedPassword,
        role: 'PATIENT',
        verificationCode: code,
      },
    });

    const html = `
      <div>
        <h2>Welcome to our Clinic</h2>
        <p>Your verification code is:</p>
        <h1>${code}</h1>
      </div>
    `;

    await this.mailService.sendMail({
      from: 'clinic Team',
      to: user.email,
      subject: 'Welcome to our Clinic - Verify Your Email',
      html,
    });

    const { password, verificationCode, ...userWithoutPasswordAndVerificationCode } = user; // Exclude password and verificationCode from response

    return {
      status: 'success',
      message:'code send to email',
      data: userWithoutPasswordAndVerificationCode,
    };
  }

  async verifyCodeSignUp(data: { email: string; code: string }) {

    if(!data.email || !data.code){
      throw new HttpException('Email and code are required', 400);
    }
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.verificationCode !== data.code) {
      throw new UnauthorizedException('Invalid verification code');
    }

    // SECURITY: Once the verification code is successfully validated, we nullify it.
    // This prevents replay attacks where an attacker could reuse the same code.
    await this.prisma.user.update({
      where: { email: data.email },
      data: {
        verificationCode: null,
      },
    });

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(
      { ...payload, countEx: 5 },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );

    return {
      status: 'success',
      message: 'Code verified successfully',
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // =========================
  // SIGN IN
  // =========================
  async signIn(signInDto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: signInDto.email },
    });

    // SECURITY: Use a generic error message for both "user not found" and
    // "wrong password" to prevent user enumeration attacks.
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(
      { ...payload, countEx: 5 },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );

    const { password, ...userWithoutPassword } = user; // Exclude password from response

    return {
      status: 'success',
      data: userWithoutPassword,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // =========================
  // RESET PASSWORD (SEND CODE)
  // =========================
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // SECURITY: Always return the same success response regardless of whether
    // the email exists. This prevents user enumeration — an attacker cannot
    // determine which emails are registered by probing this endpoint.
    if (!user) {
      return {
        status: 'success',
        message: 'If this email exists, a verification code has been sent.',
      };
    }

    // SECURITY: Use cryptographically secure random number for OTP generation.
    const code = randomInt(0, 1000000).toString().padStart(6, '0');

    await this.prisma.user.update({
      where: { email: dto.email },
      data: {
        verificationCode: code,
      },
    });

    const html = `
      <div>
        <h2>Password Reset</h2>
        <p>Your verification code is:</p>
        <h1>${code}</h1>
      </div>
    `;

    await this.mailService.sendMail({
      from: 'clinic Team',
      to: user.email,
      subject: 'Password Reset Code',
      html,
    });

    return {
      status: 'success',
      message: 'If this email exists, a verification code has been sent.',
    };
  }

  // =========================
  // VERIFY CODE
  // =========================
  async verifyCode(data: { email: string; code: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.verificationCode !== data.code) {
      throw new UnauthorizedException('Invalid verification code');
    }

    // SECURITY: Generate a secure reset token (UUIDv4) and set to expire in 10 minutes.
    // Using an opaque UUID ensures the token cannot be guessed or forged.
    // Setting an expiry minimizes the window of opportunity if the token is leaked.
    const resetToken = crypto.randomUUID();
    const resetExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // SECURITY: Nullify the OTP verification code to prevent reuse (replay attack).
    await this.prisma.user.update({
      where: { email: data.email },
      data: {
        verificationCode: null,
        resetpasswordToken: resetToken,
        resetpasswordExpire: resetExpire,
      },
    });

    return {
      status: 'success',
      message: 'Code verified successfully',
      resetToken,
    };
  }

  // =========================
  // CHANGE PASSWORD (SECURED)
  // =========================
  async changePassword(dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new NotFoundException('User not found');

    // SECURITY: Verify the reset token exactly matches what is stored in the database.
    // This connects the successful OTP verification context to this password change request.
    if (!user.resetpasswordToken || user.resetpasswordToken !== dto.resetToken) {
      throw new UnauthorizedException('Invalid or missing reset token');
    }

    // Check token hasn't expired
    if (!user.resetpasswordExpire || user.resetpasswordExpire < new Date()) {
      throw new UnauthorizedException('Reset token has expired. Please request a new code.');
    }

    // SECURITY: Use bcrypt to securely hash the new password.
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // SECURITY: After the password is changed successfully, we MUST clear the resetToken
    // and resetExpire to invalidate this specific reset session and prevent reuse.
    await this.prisma.user.update({
      where: { email: dto.email },
      data: {
        password: hashedPassword,
        resetpasswordToken: null,
        resetpasswordExpire: null,
        passwordChangedAt: new Date(),
      },
    });

    return {
      status: 'success',
      message: 'Password changed successfully',
    };
  }

  // =========================
  // REFRESH TOKEN
  // =========================
  async refreshToken(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      if (!decoded || decoded.countEx <= 0) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) throw new NotFoundException('User not found');

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const newAccessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      });

      const newRefreshToken = this.jwtService.sign(
        { ...payload, countEx: decoded.countEx - 1 },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      );

      // SECURITY: Strip sensitive fields before returning user data.
      const { password: _, verificationCode: __, resetpasswordToken: ___, resetpasswordExpire: ____, ...safeUser } = user;

      return {
        status: 'success',
        data: safeUser,
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
