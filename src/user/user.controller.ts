import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guard/auth.guard';
import { Roles } from './decorators/user.decorators';

@Controller('userMe')
export class UserMeController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(['DOCTOR', 'PATIENT'])
  @UseGuards(AuthGuard)
  getMe(@Req() req: any) {
    return this.userService.getMe(req.user);
  }

  @Patch()
  @Roles(['DOCTOR', 'PATIENT'])
  @UseGuards(AuthGuard)
  updateMe(
    @Req() req: any,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateMe(req.user, updateUserDto);
  }

  @Delete()
  @Roles(['PATIENT'])
  @UseGuards(AuthGuard)
  deleteMe(@Req() req: any) {
    return this.userService.deleteMe(req.user);
  }
}