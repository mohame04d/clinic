import 'dotenv/config'; 
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');

  // SECURITY: Helmet adds essential security headers (X-Content-Type-Options,
  // X-Frame-Options, Strict-Transport-Security, etc.) to every response.
  app.use(helmet());

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(4000);
  console.log('🚀 Application is running on: http://localhost:4000');
}
bootstrap();

