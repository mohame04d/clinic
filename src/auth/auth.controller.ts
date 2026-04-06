import { Body, Controller, Param, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/sign-up')
  signUp(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    signUpDto: SignUpDto,
  ) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/signup-code')
  verifyCodeSignUp(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    verifyCode: {
      email: string;
      code: string;
    },
  ) {
    return this.authService.verifyCodeSignUp(verifyCode);
  }
  @Post('/sign-in')
  signIn(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    signInDto: SignInDto,
  ) {
    return this.authService.signIn(signInDto);
  }
  @Post('/reset-password')
  resetPssword(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    email: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(email);
  }
  @Post('/verify-code')
  verifyCode(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    verifyCode: {
      email: string;
      code: string;
    },
  ) {
    return this.authService.verifyCode(verifyCode);
  }
  @Post('/change-password')
    changePassword(@Body(new ValidationPipe({forbidNonWhitelisted:true}))changePassword:SignInDto){
      return this.authService.changePassword(changePassword);
  }
  @Post('/refresh-token')   // بدون :refreshToken في الـ path
refreshToken(
  @Body('refreshToken') refresh_Token: string   // أو @Body() body: { refreshToken: string }
) {
  console.log(refresh_Token);
  return this.authService.refreshToken(refresh_Token);
}
}
