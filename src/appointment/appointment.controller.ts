import {
  Controller,
  UseGuards,
  Param,
  Get,
  Post,
  Patch,
  Req,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { AppointmentsService } from './appointment.service';
import { Roles } from 'src/user/decorators/user.decorators';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { CreateAppointmentDto } from './dto/create.appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // =========================
  // GET /appointments/my — Patient's own appointments
  // =========================
  @Get('my')
  @Roles(['PATIENT'])
  @UseGuards(AuthGuard)
  getMyAppointments(@Req() req: any) {
    // SECURITY: Uses the patient's ID from the JWT, not from the URL.
    return this.appointmentsService.getMyAppointments(req.user.id);
  }

  // =========================
  // GET /appointments/doctor — Doctor's own appointments
  // =========================
  @Get('doctor')
  @Roles(['DOCTOR'])
  @UseGuards(AuthGuard)
  getDoctorAppointments(@Req() req: any) {
    // SECURITY: Uses the doctor's userId from the JWT.
    return this.appointmentsService.getDoctorAppointments(req.user.id);
  }

  // =========================
  // GET /appointments/:id — Single appointment (patient or doctor)
  // =========================
  @Get(':id')
  @Roles(['PATIENT', 'DOCTOR'])
  @UseGuards(AuthGuard)
  getAppointmentById(@Param('id') id: string, @Req() req: any) {
    return this.appointmentsService.getAppointmentById(
      id,
      req.user.id,
      req.user.role,
    );
  }

  // =========================
  // POST /appointments — Create (patient only)
  // =========================
  @Post()
  @Roles(['PATIENT'])
  @UseGuards(AuthGuard)
  createAppointment(
    @Req() req: any,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    dto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.createAppointment(dto, req.user.id);
  }

  // =========================
  // PATCH /appointments/:id — Update (reschedule, status change)
  // =========================
  @Patch(':id')
  @Roles(['PATIENT', 'DOCTOR'])
  @UseGuards(AuthGuard)
  updateAppointment(
    @Param('id') id: string,
    @Req() req: any,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    dto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.updateAppointment(
      id,
      dto,
      req.user.id,
      req.user.role,
    );
  }

  // =========================
  // PATCH /appointments/:id/cancel — Cancel shortcut (patient or doctor)
  // =========================
  @Patch(':id/cancel')
  @Roles(['PATIENT', 'DOCTOR'])
  @UseGuards(AuthGuard)
  cancelAppointment(@Param('id') id: string, @Req() req: any) {
    return this.appointmentsService.cancelAppointment(
      id,
      req.user.id,
      req.user.role,
    );
  }
}
