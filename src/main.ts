import 'dotenv/config'; // ←←← لازم يكون أول سطر في الملف

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
 app.enableCors({
  origin: 'http://localhost:3000',     // Next.js frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,                    // لو هتستخدم cookies في المستقبل
});
  await app.listen(4000);
  console.log('🚀 Application is running on: http://localhost:4000');
}
bootstrap();
