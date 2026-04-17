import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function runSeed() {
  console.log('🌱 Starting seed process...');
  const { seed } = await import('./seed');
  await seed();
  console.log('✅ Seed completed!');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ===============================================
  // SỬA Ở ĐÂY: Thêm Domain mạng ngoài vào CORS
  // ===============================================
  app.enableCors({
    origin: [
      'http://10.1.10.20:3000',          // Cho phép IP nội bộ
      'http://travel.hailong.online',    // Cho phép tên miền qua HTTP
      'https://travel.hailong.online'    // Cho phép tên miền qua HTTPS (Cloudflare)
    ], 
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Run seed if RUN_SEED environment variable is set
  if (process.env.RUN_SEED === 'true') {
    try {
      await runSeed();
    } catch (error) {
      console.error('❌ Seed failed:', error);
      // Don't exit, continue with server startup
    }
  }

  const port = process.env.PORT || 3001;
  // Giữ nguyên 0.0.0.0 để Nginx có thể gọi vào
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
}
bootstrap();
