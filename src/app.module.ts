import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { OAuthModule } from './oauth/oauth.module';
import { UserModule } from './user/user.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentsModule } from './appointment/appontment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // SECURITY: Global rate limiting — max 10 requests per 60 seconds per IP.
    // Individual endpoints can override this with @Throttle() decorator.
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),

    // SECURITY: ScheduleModule enables @Cron decorators for automated tasks
    // like deleting unverified users (CleanupService).
    ScheduleModule.forRoot(),

    AuthModule,
    PrismaModule,
    OAuthModule,
    UserModule,
    DoctorModule,
    AppointmentsModule,

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),

    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
