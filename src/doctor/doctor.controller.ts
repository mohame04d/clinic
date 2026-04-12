import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Roles } from 'src/user/decorators/user.decorators';
import { AuthGuard } from 'src/user/guard/auth.guard';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}


  @Get()
  @Roles(['PATIENT','DOCTOR'])
  @UseGuards(AuthGuard)
  findAll() {
    return this.doctorService.findAll();
  }

  @Get(':id')
  @Roles(['PATIENT','DOCTOR'])
  @UseGuards(AuthGuard)
  findOne(@Param('id') id:any) {
    return this.doctorService.findOne(id);
  }

}
