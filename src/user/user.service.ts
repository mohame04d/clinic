import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(payload) {
    if (!payload._id) throw new NotFoundException('user not found');

    const user = await this.prisma.user.findUnique({
      where: { id: payload._id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      },
    });

    if (!user) throw new NotFoundException('user not found');

    return {
      status: 'success',
      data: { user },
    };
  }

  async updateMe(payload, updateUserDto) {
    if (!payload._id) throw new NotFoundException('user not found');

    const user = await this.prisma.user.findUnique({
      where: { id: payload._id },
    });

    if (!user) throw new NotFoundException('user not found');

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: payload._id },
      data: updateUserDto,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      },
    });

    return {
      status: 'success',
      data: updatedUser,
    };
  }

  async deleteMe(payload): Promise<void> {
    if (!payload._id) throw new NotFoundException('user not found');

    const user = await this.prisma.user.findUnique({
      where: { id: payload._id },
    });

    if (!user) throw new NotFoundException('user not found');

    await this.prisma.user.update({
      where: { id: payload._id },
      data: { active: false },
    });
  }
}
