import { Module } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { GoogleStrategy } from './strategies/google.startetgy';
import { AuthService } from './oauth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [OAuthController],
  providers: [
    GoogleStrategy,
    AuthService,
    PrismaService, 
  ],
})
export class OAuthModule {}