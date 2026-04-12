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

}
