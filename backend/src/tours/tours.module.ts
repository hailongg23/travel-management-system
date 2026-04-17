import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ToursController } from './tours.controller';
import { ToursService } from './tours.service';
import { Tour, TourSchema } from './tour.schema';
import { SecurityModule } from '../security/security.module';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
    SecurityModule,
  ],
  controllers: [ToursController],
  providers: [ToursService, RateLimitGuard],
  exports: [ToursService],
})
export class ToursModule {}
