import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './oauth.service';
import type { Response } from 'express';
@Controller('auth')
export class OAuthController {
  constructor(private readonly authService: AuthService) {}

  // google login
  @Get('google/sign')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // SECURITY: Initiates OAuth flow via Passport strategy.
    return { msg: 'Google Authentication' };
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req: any, @Res() res: Response) {
    const userObj = req.user as any;
    const user = {
      userId: userObj.profile.id,
      email: userObj.profile.emails[0].value,
      name: userObj.profile.displayName,
      photo: userObj.profile.photos[0].value,
    };

    // SECURITY: Get JWT tokens after validating Google profile.
    const tokens = await this.authService.validateUser(user);

    // SECURITY: Redirect back to the Next.js frontend route handler.
    // The frontend route handler will consume these tokens from the URL
    // and set them as HTTP-only secure cookies.
    return res.redirect(
      `http://localhost:3000/api/auth/google-success?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`,
    );
  }
}
