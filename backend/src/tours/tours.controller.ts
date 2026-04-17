import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/user.schema';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard';
import { RATE_LIMIT_CONFIG } from '../common/config/rate-limit.config';

@Controller('api/tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Get()
  @UseGuards(RateLimitGuard)
  @RateLimit(RATE_LIMIT_CONFIG.BUSINESS.TOURS_SEARCH)
  async findAll(@Query() query: any) {
    return this.toursService.findAll(query);
  }

  @Get(':id')
  @UseGuards(RateLimitGuard)
  @RateLimit(RATE_LIMIT_CONFIG.BUSINESS.TOUR_DETAILS)
  async findOne(@Param('id') id: string) {
    return this.toursService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createTourDto: CreateTourDto) {
    return this.toursService.create(createTourDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
    return this.toursService.update(id, updateTourDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.toursService.remove(id);
    return { message: 'Tour deleted successfully' };
  }

  @Put(':id/toggle-active')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async toggleActive(@Param('id') id: string) {
    return this.toursService.toggleActive(id);
  }

  @Post(':id/images')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateImages(
    @Param('id') id: string,
    @Body() body: { images: string[] },
  ) {
    return this.toursService.updateImages(id, body.images);
  }
}
