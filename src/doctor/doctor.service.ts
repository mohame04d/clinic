import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DoctorService {
  constructor( private prisma: PrismaService ) {}
 

  findAll() {
    const doctors = this.prisma.doctor.findMany({
      include:{
        user:true
      }
    });
    return {
      status:'success',
      data:doctors
    };

  }

  findOne(id: any) {
    const doctor = this.prisma.doctor.findUnique({
      where:{id},
      include:{
        user:true
      }
    });
    if(!doctor){
      return {
        status:'fail',  
        message:'doctor not found'
      }
    }
    return {
      status:'success',
      data:doctor
    };
  }

  async getDoctorsAvailability() {
  return this.prisma.doctor.findMany({
    select: {
      user: {
        select: {
          name: true, // اسم الدكتور
        },
      },
      schedules: {
        select: {
          day: true,
          timeSlots: {
            select: {
              start: true,
              end: true,
            },
          },
        },
      },
    },
  });
}

async getDoctorAvailability(doctorId: string) {
  return this.prisma.doctor.findUnique({
    where: { id: doctorId },
    select: {
      user: {
        select: {
          name: true,
        },
      },
      schedules: {
        select: {
          day: true,
          timeSlots: {
            select: {
              start: true,
              end: true,
            },
          },
        },
      },
    },
  });
}
}
