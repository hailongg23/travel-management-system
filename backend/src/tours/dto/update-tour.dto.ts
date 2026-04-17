import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
} from 'class-validator';

export class UpdateTourDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
