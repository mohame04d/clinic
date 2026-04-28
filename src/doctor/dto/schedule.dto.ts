import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum DayEnum {
  SAT = 'SAT',
  SUN = 'SUN',
  MON = 'MON',
  TUE = 'TUE',
  WED = 'WED',
  THU = 'THU',
  FRI = 'FRI',
}

export class TimeSlotDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'start must be in HH:mm format (e.g., 09:00)',
  })
  start!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'end must be in HH:mm format (e.g., 17:00)',
  })
  end!: string;
}

export class SetScheduleDto {
  @IsEnum(DayEnum, {
    message: 'day must be one of: SAT, SUN, MON, TUE, WED, THU, FRI',
  })
  day!: DayEnum;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  timeSlots!: TimeSlotDto[];
}

// For setting the full weekly schedule at once
export class SetWeeklyScheduleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SetScheduleDto)
  schedules!: SetScheduleDto[];
}
