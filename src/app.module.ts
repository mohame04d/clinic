import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule} from '@nestjs/jwt';  
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { OAuthModule } from './oauth/oauth.module';
import { UserModule } from './user/user.module';
import { DoctorModule } from './doctor/doctor.module';



@Module({
  imports: [ConfigModule.forRoot({
  isGlobal: true,
}),
AuthModule, 
PrismaModule , 
OAuthModule, 
UserModule,
DoctorModule,
 JwtModule.register({
      global: true,
      secret:process.env.JWT_SECRET,
      // signOptions:{expiresIn:'60s'}
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
   UserModule,
   DoctorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
