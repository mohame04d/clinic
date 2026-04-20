import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppointmentsService {
    constructor ( private prisma: PrismaService){}

    async getMyAppointments(userId: string) {
    const appointments =  this.prisma.appointment.findMany({
      where: {
        patientId: userId,
      },
      orderBy: {
        date: 'desc',
      },
      select: {
        id: true,
        date: true,
        duration: true,
        status: true,
        notes: true,
        adminNotes: true,
        createdAt: true,
        updatedAt: true,
        doctor: {
          select: {
            name: true,
            email: true,
            specialization: true,
            avatarUrl: true,
          },
        },
      },
    });
    return {
        status:200,
        data:{appointments}
    }
  }

  async assertNoConflict(doctorId: string, date: Date, duration: number) {
    const conflict = await this.prisma.appointment.findFirst({
      where: {
        doctorId,
        date,
      },
    });

    if (conflict) {
      throw new BadRequestException('Doctor is not available at this time');
    }
  }

  async createAppointment(dto: any, userId: string) {
    // 1) check doctor exists + active
    const doctor = await this.prisma.doctor.findFirst({
      where: {
        id: dto.doctorId,
        isActive: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException('No active doctor found with that ID');
    }

    // 2) conflict check
    await this.assertNoConflict(
      dto.doctorId,
      new Date(dto.date),
      dto.duration ?? 30,
    );

    // 3) create appointment
    const appointment = await this.prisma.appointment.create({
      data: {
        patientId: userId,
        doctorId: dto.doctorId,
        date: new Date(dto.date),
        duration: dto.duration ?? 30,
        notes: dto.notes ?? null,
      },
      include: {
        doctor: {
          select: {
            name: true,
            email: true,
            specialization: true,
          },
        },
      },
    });

    return {
        status:200,
        data:{appointment}
    }
  }
}
