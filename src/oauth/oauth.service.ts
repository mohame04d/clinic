import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

const saltOrRounds = 10;

type UserData = {
  userId: string;
  email: string;
  name: string;
  photo: string;
};

function generateRandomPassword() {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=';
  let password = '';
  const passwordLength = Math.floor(Math.random() * (20 - 4 + 1)) + 4;

  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userData: UserData): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    // ================= SIGN UP =================
    if (!user) {
      const password = await bcrypt.hash(
        generateRandomPassword(),
        saltOrRounds,
      );

      const newUser = await this.prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password,
          role: 'PATIENT',
        },
      });

      const payload = {
        _id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      };

      const token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      });

      const refresh_token = await this.jwtService.signAsync(
        { ...payload, countEX: 5 },
        {
          secret: process.env.JWT_SECRET_REFRESHTOKEN,
          expiresIn: '7d',
        },
      );

      return {
        status: 200,
        message: 'User created successfully',
        data: newUser,
        access_token: token,
        refresh_token,
      };
    }

    // ================= SIGN IN =================
    const payload = {
      _id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    const refresh_token = await this.jwtService.signAsync(
      { ...payload, countEX: 5 },
      {
        secret: process.env.JWT_SECRET_REFRESHTOKEN,
        expiresIn: '7d',
      },
    );

    return {
      status: 200,
      message: 'User logged in successfully',
      data: user,
      access_token: token,
      refresh_token,
    };
  }
}