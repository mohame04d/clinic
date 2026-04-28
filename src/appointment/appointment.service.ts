import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create.appointment.dto';
import {
  UpdateAppointmentDto,
  AppointmentStatus,
} from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  // =========================
  // PATIENT: Get My Appointments
  // =========================
  async getMyAppointments(userId: string) {
    const appointments = await this.prisma.appointment.findMany({
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
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            specialty: true,
            photo: true,
          },
        },
      },
    });
    return {
      status: 'success',
      data: { appointments },
    };
  }

  // =========================
  // DOCTOR: Get My Appointments
  // =========================
  async getDoctorAppointments(userId: string) {
    // SECURITY: Look up the Doctor record via the userId from the JWT.
    // This ensures a doctor can ONLY see their own appointments.
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor profile not found for this user');
    }

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
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
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            dateOfBirth: true,
          },
        },
      },
    });

    return {
      status: 'success',
      data: { appointments },
    };
  }

  // =========================
  // SHARED: Get Single Appointment
  // =========================
  async getAppointmentById(
    appointmentId: string,
    userId: string,
    role: string,
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        doctor: {
          select: {
            id: true,
            userId: true,
            specialty: true,
            photo: true,
            user: { select: { name: true, email: true } },
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // SECURITY: Verify the requester owns this appointment.
    // Patients can only view their own. Doctors can only view appointments assigned to them.
    if (role === 'PATIENT' && appointment.patientId !== userId) {
      throw new ForbiddenException(
        'You do not have access to this appointment',
      );
    }
    if (role === 'DOCTOR' && appointment.doctor.userId !== userId) {
      throw new ForbiddenException(
        'You do not have access to this appointment',
      );
    }

    return {
      status: 'success',
      data: { appointment },
    };
  }

  // =========================
  // CONFLICT CHECK
  // =========================
  async assertNoConflict(
    doctorId: string,
    date: Date,
    duration: number,
    excludeAppointmentId?: string,
  ) {
    const conflict = await this.prisma.appointment.findFirst({
      where: {
        doctorId,
        date,
        // SECURITY: Exclude the current appointment when rescheduling
        ...(excludeAppointmentId ? { id: { not: excludeAppointmentId } } : {}),
      },
    });

    if (conflict) {
      throw new BadRequestException('Doctor is not available at this time');
    }
  }

  // =========================
  // PATIENT: Create Appointment
  // =========================
  async createAppointment(dto: CreateAppointmentDto, userId: string) {
    // 1) check doctor exists + active
    const doctor = await this.prisma.doctor.findFirst({
      where: {
        id: dto.doctorId,
        user: { active: true },
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
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            specialty: true,
          },
        },
      },
    });

    return {
      status: 'success',
      data: { appointment },
    };
  }

  // =========================
  // UPDATE APPOINTMENT (Reschedule / Change status)
  // =========================
  async updateAppointment(
    appointmentId: string,
    dto: UpdateAppointmentDto,
    userId: string,
    role: string,
  ) {
    const existing = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        doctor: { select: { id: true, userId: true } },
      },
    });

    if (!existing) {
      throw new NotFoundException('Appointment not found');
    }

    // SECURITY: Ownership check — patients can only update their own,
    // doctors can only update appointments assigned to them.
    if (role === 'PATIENT' && existing.patientId !== userId) {
      throw new ForbiddenException(
        'You do not have access to this appointment',
      );
    }
    if (role === 'DOCTOR' && existing.doctor.userId !== userId) {
      throw new ForbiddenException(
        'You do not have access to this appointment',
      );
    }

    // SECURITY: Prevent modifications to completed or cancelled appointments
    if (existing.status === 'completed' || existing.status === 'cancelled') {
      throw new BadRequestException(
        `Cannot modify an appointment that is already ${existing.status}`,
      );
    }

    // SECURITY: Role-based field restrictions
    // Patients can only: reschedule (date/duration), add notes, or cancel
    // Doctors can: confirm, complete, cancel, add adminNotes
    const updateData: Record<string, any> = {};

    if (role === 'PATIENT') {
      if (dto.status && dto.status !== AppointmentStatus.CANCELLED) {
        throw new ForbiddenException('Patients can only cancel appointments');
      }
      if (dto.date) updateData.date = new Date(dto.date);
      if (dto.duration) updateData.duration = dto.duration;
      if (dto.notes !== undefined) updateData.notes = dto.notes;
      if (dto.status) updateData.status = dto.status;
    }

    if (role === 'DOCTOR') {
      // SECURITY: Doctors can confirm, complete, or cancel — not reschedule
      if (dto.status) {
        const allowed = [
          AppointmentStatus.CONFIRMED,
          AppointmentStatus.COMPLETED,
          AppointmentStatus.CANCELLED,
        ];
        if (!allowed.includes(dto.status)) {
          throw new ForbiddenException(
            `Doctors cannot set status to ${dto.status}`,
          );
        }
        updateData.status = dto.status;
      }
      if (dto.adminNotes !== undefined) updateData.adminNotes = dto.adminNotes;
    }

    // If patient is rescheduling, run conflict check
    if (updateData.date) {
      await this.assertNoConflict(
        existing.doctorId,
        updateData.date,
        updateData.duration ?? existing.duration,
        appointmentId,
      );
    }

    const appointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: updateData,
      include: {
        doctor: {
          select: {
            user: { select: { name: true, email: true } },
            specialty: true,
          },
        },
        patient: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return {
      status: 'success',
      data: { appointment },
    };
  }

  // =========================
  // CANCEL APPOINTMENT (convenience shortcut)
  // =========================
  async cancelAppointment(appointmentId: string, userId: string, role: string) {
    return this.updateAppointment(
      appointmentId,
      { status: AppointmentStatus.CANCELLED },
      userId,
      role,
    );
  }
}
