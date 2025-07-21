import { Field, InputType } from '@nestjs/graphql';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

/**
 * CreateCropRequestDto
 * Input DTO for creating a new crop
 */
@InputType()
export class CreateCropRequestDto {
  @Field(() => String, { description: 'Plot ID where the crop is planted' })
  @IsUUID()
  plotId: string;

  @Field(() => String, { description: 'Crop variety ID' })
  @IsUUID()
  varietyId: string;

  @Field(() => String, { description: 'Actual planting date', nullable: true })
  @IsOptional()
  @IsDateString()
  plantingDate?: string;

  @Field(() => String, { description: 'Expected harvest date', nullable: true })
  @IsOptional()
  @IsDateString()
  expectedHarvest?: string;

  @Field(() => String, { description: 'Actual harvest date', nullable: true })
  @IsOptional()
  @IsDateString()
  actualHarvest?: string;

  @Field(() => Number, {
    description: 'Number of plants/units',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @Field(() => String, { description: 'Crop status', nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field(() => String, { description: 'Planting method' })
  @IsString()
  plantingMethod: string;

  @Field(() => String, { description: 'Additional notes', nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
