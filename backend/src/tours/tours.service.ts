import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tour, TourDocument } from './tour.schema';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';

@Injectable()
export class ToursService {
  constructor(@InjectModel(Tour.name) private tourModel: Model<TourDocument>) {}

  async create(createTourDto: CreateTourDto): Promise<Tour> {
    const tour = new this.tourModel(createTourDto);
    return tour.save();
  }

  async findAll(query: any = {}): Promise<Tour[]> {
    const { search, location, minPrice, maxPrice } = query;

    const filter: any = { isActive: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    return this.tourModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Tour> {
    const tour = await this.tourModel.findById(id).exec();
    if (!tour) {
      throw new NotFoundException('Tour not found');
    }
    return tour;
  }

  async update(id: string, updateTourDto: UpdateTourDto): Promise<Tour> {
    const tour = await this.tourModel
      .findByIdAndUpdate(id, updateTourDto, { new: true })
      .exec();

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    return tour;
  }

  async remove(id: string): Promise<void> {
    const result = await this.tourModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Tour not found');
    }
  }

  async toggleActive(id: string): Promise<Tour> {
    const tour = await this.tourModel.findById(id);
    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    tour.isActive = !tour.isActive;
    return tour.save();
  }

  async updateImages(id: string, images: string[]): Promise<Tour> {
    const tour = await this.tourModel
      .findByIdAndUpdate(id, { images }, { new: true })
      .exec();

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    return tour;
  }
}
