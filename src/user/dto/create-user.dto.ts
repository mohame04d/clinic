import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  isObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'name must be string' })
  @MinLength(3, { message: 'name must be at least 3 characters' })
  @MaxLength(30, { message: 'name must be at most 30' })
  @IsNotEmpty({message:'name must be required'})
  name!: string;

  @IsString({ message: 'email must be string' })
  @IsEmail({}, { message: 'email not valid' })
  @IsNotEmpty({message:'email is required'})
  email!: string;

  @IsString({ message: 'password must be string' })
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @MaxLength(20, { message: 'password must ba at most 20 characters' })
  @IsNotEmpty({message:'password must be required'})
  password!: string;

  @IsEnum(['ADMIN', 'PATIENT'], { message: 'role must be ADMIN or PATIENT' })
  @IsOptional()
  role!: string;


  @IsString({ message: 'phone must be string' })
  @IsPhoneNumber('EG', { message: 'phone not valid' })
  @IsOptional()
  phone!: string;


  

  @IsString({ message: 'vertificationCode must be string' })
  @IsOptional()
  vertificationCode!: string;
  
}