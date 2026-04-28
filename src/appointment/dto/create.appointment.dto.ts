import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  // SECURITY: patientId is NOT accepted from the request body.
  // It is extracted from the JWT in the controller. This prevents
  // a patient from booking appointments on behalf of another user.

  @IsString()
  @IsNotEmpty()
  doctorId!: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
