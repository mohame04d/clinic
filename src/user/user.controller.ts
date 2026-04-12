import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guard/auth.guard';
import { Roles } from './decorators/user.decorators';


@Controller('userMe')
export class UserMeController {
  constructor(private readonly userService: UserService){}
   @Get()
  @Roles(['DOCTOR','PATIENT'])
  @UseGuards(AuthGuard)
  getMe(@Req() req){
    console.log(req.user)
    return this.userService.getMe(req.user)
  }
  @Patch()
  @Roles(['DOCTOR','PATIENT'])
  @UseGuards(AuthGuard)
  updateMe(@Req() req,@Body(new ValidationPipe({forbidNonWhitelisted:true}))updateUserDto:UpdateUserDto){
    return this.userService.updateMe(req.user,updateUserDto);
  }
  @Delete()
  @Roles(['PATIENT'])
  @UseGuards(AuthGuard)
  deleteMetadata(@Req()req) {
    return this.userService.deleteMe(req.user)
  }
}