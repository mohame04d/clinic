import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateDoctorProfileDto } from './dto/update-doctor.dto';
import { SetWeeklyScheduleDto } from './dto/schedule.dto';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

  // =========================
  // LIST ALL DOCTORS (with search + pagination)
  // =========================
  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    specialty?: string;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 10));
    const skip = (page - 1) * limit;

    // PERF: Build dynamic where clause for search/filter
    const where: any = {};
    if (query.specialty) {
      where.specialty = { contains: query.specialty, mode: 'insensitive' };
    }
    if (query.search) {
      where.OR = [
        { specialty: { contains: query.search, mode: 'insensitive' } },
        { bio: { contains: query.search, mode: 'insensitive' } },
        { user: { name: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const [doctors, total] = await Promise.all([
      this.prisma.doctor.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              active: true,
            },
          },
        },
        orderBy: { rating: 'desc' },
      }),
      this.prisma.doctor.count({ where }),
    ]);

    return {
      status: 'success',
      data: doctors,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =========================
  // GET SINGLE DOCTOR
  // =========================
  async findOne(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true,
          },
        },
        schedules: {
          include: {
            timeSlots: {
              select: { id: true, start: true, end: true },
            },
          },
        },
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return {
      status: 'success',
      data: doctor,
    };
  }

  // =========================
  // GET DOCTOR BY USER ID (for /me endpoint)
  // =========================
  async findOneByUserId(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true,
          },
        },
        schedules: {
          include: {
            timeSlots: {
              select: { id: true, start: true, end: true },
            },
          },
        },
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    return {
      status: 'success',
      data: doctor,
    };
  }

  // =========================
  // GET ALL DOCTORS' AVAILABILITY
  // =========================
  async getDoctorsAvailability() {
    const availability = await this.prisma.doctor.findMany({
      select: {
        id: true,
        user: { select: { name: true } },
        schedules: {
          select: {
            day: true,
            timeSlots: {
              select: { start: true, end: true },
            },
          },
        },
      },
    });

    return {
      status: 'success',
      data: availability,
    };
  }

  // =========================
  // GET SINGLE DOCTOR'S AVAILABILITY
  // =========================
  async getDoctorAvailability(doctorId: string) {
    const availability = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
      select: {
        id: true,
        user: { select: { name: true } },
        schedules: {
          select: {
            day: true,
            timeSlots: {
              select: { start: true, end: true },
            },
          },
        },
      },
    });

    if (!availability) {
      throw new NotFoundException('Doctor availability not found');
    }

    return {
      status: 'success',
      data: availability,
    };
  }

  // =========================
  // UPDATE DOCTOR PROFILE (#21)
  // =========================
  async updateProfile(userId: string, dto: UpdateDoctorProfileDto) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor profile not found for this user');
    }

    const updated = await this.prisma.doctor.update({
      where: { id: doctor.id },
      data: dto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      status: 'success',
      data: updated,
    };
  }

  // =========================
  // SET WEEKLY SCHEDULE (#18)
  // =========================
  // Replaces the doctor's entire schedule with the new one.
  // This is a "set" operation, not "append" — simpler and safer.
  async setSchedule(userId: string, dto: SetWeeklyScheduleDto) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor profile not found for this user');
    }

    // PERF: Delete all existing schedules + time slots, then recreate.
    // Using a transaction ensures atomicity — no partial state.
    await this.prisma.$transaction(async (tx) => {
      // 1) Delete all time slots for this doctor's schedules
      const scheduleIds = await tx.daySchedule.findMany({
        where: { doctorId: doctor.id },
        select: { id: true },
      });

      if (scheduleIds.length > 0) {
        await tx.timeSlot.deleteMany({
          where: {
            dayScheduleId: {
              in: scheduleIds.map((s) => s.id),
            },
          },
        });
        await tx.daySchedule.deleteMany({
          where: { doctorId: doctor.id },
        });
      }

      // 2) Create new schedules with time slots
      for (const schedule of dto.schedules) {
        await tx.daySchedule.create({
          data: {
            day: schedule.day,
            doctorId: doctor.id,
            timeSlots: {
              create: schedule.timeSlots.map((slot) => ({
                start: slot.start,
                end: slot.end,
              })),
            },
          },
        });
      }
    });

    // 3) Return the updated schedule
    return this.getDoctorAvailability(doctor.id);
  }
}
