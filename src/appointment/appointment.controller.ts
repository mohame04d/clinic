import { Controller, UseGuards ,  Param , Get, Post } from '@nestjs/common';
import { AppointmentsService } from './appointment.service';
import { Roles } from 'src/user/decorators/user.decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get(':id')
  @Roles(['PATIENT'])
  @UseGuards(AuthGuard)
  getMyAppointments (@Param('id') id: string ){
    return this.appointmentsService.getMyAppointments(id);
  }

  // @desc    Create appointment
// @route   POST /api/v1/appointments
// @access  Patient
@Post()
@Roles(['PATIENT'])
@UseGuards(AuthGuard)
createAppointment(){
    return this.appointmentsService.createAppointment();
  }
}
