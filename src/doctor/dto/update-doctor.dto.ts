import {
  IsString,
  IsOptional,
  IsNumber,
  IsUrl,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class UpdateDoctorProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  specialty?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'photo must be a valid URL' })
  photo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;
}
