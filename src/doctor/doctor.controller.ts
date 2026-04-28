import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Query,
  Body,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { AuthGuard } from '../user/guard/auth.guard';
import { Roles } from '../user/decorators/user.decorators';
import { UpdateDoctorProfileDto } from './dto/update-doctor.dto';
import { SetWeeklyScheduleDto } from './dto/schedule.dto';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  // =========================
  // GET /doctor — List all doctors (search + pagination)
  // =========================
  @Get()
  @Roles(['PATIENT', 'DOCTOR'])
  @UseGuards(AuthGuard)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('specialty') specialty?: string,
  ) {
    return this.doctorService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      specialty,
    });
  }

  // =========================
  // GET /doctor/me — Current doctor's own profile
  // =========================
  @Get('me')
  @Roles(['DOCTOR'])
  @UseGuards(AuthGuard)
  getMyProfile(@Req() req: any) {
    return this.doctorService.findOneByUserId(req.user.id);
  }

  // =========================
  // PATCH /doctor/profile — Update own profile (#21)
  // =========================
  @Patch('profile')
  @Roles(['DOCTOR'])
  @UseGuards(AuthGuard)
  updateProfile(
    @Req() req: any,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    dto: UpdateDoctorProfileDto,
  ) {
    return this.doctorService.updateProfile(req.user.id, dto);
  }

  // =========================
  // POST /doctor/schedule — Set weekly schedule (#18)
  // =========================
  @Post('schedule')
  @Roles(['DOCTOR'])
  @UseGuards(AuthGuard)
  setSchedule(
    @Req() req: any,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    dto: SetWeeklyScheduleDto,
  ) {
    return this.doctorService.setSchedule(req.user.id, dto);
  }

  // =========================
  // GET /doctor/availability — All doctors' schedules
  // =========================
  @Get('availability')
  @Roles(['PATIENT', 'DOCTOR'])
  @UseGuards(AuthGuard)
  getDoctorsAvailability() {
    return this.doctorService.getDoctorsAvailability();
  }

  // =========================
  // GET /doctor/:id — Single doctor
  // =========================
  @Get(':id')
  @Roles(['PATIENT', 'DOCTOR'])
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(id);
  }

  // =========================
  // GET /doctor/:id/availability — Single doctor's schedule
  // =========================
  @Get(':id/availability')
  @Roles(['PATIENT', 'DOCTOR'])
  @UseGuards(AuthGuard)
  getDoctorAvailability(@Param('id') id: string) {
    return this.doctorService.getDoctorAvailability(id);
  }
}
