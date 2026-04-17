import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateTourDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  duration: number;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
