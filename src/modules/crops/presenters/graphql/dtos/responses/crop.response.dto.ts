import { Field, ObjectType } from '@nestjs/graphql';
import { CropVarietyResponseDto } from 'src/modules/crops-variety/presenters/graphql/dtos/responses/crop-variety.response.dto';

/**
 * CropResponseDto
 * Response DTO for crop data
 */
@ObjectType()
export class CropResponseDto {
  @Field(() => String, { description: 'Unique identifier of the crop' })
  id: string;

  @Field(() => String, { description: 'Plot ID where the crop is planted' })
  plotId: string;

  @Field(() => String, { description: 'Crop variety ID' })
  varietyId: string;

  @Field(() => String, { description: 'Actual planting date', nullable: true })
  plantingDate?: string;

  @Field(() => String, { description: 'Expected harvest date', nullable: true })
  expectedHarvest?: string;

  @Field(() => String, { description: 'Actual harvest date', nullable: true })
  actualHarvest?: string;

  @Field(() => Number, {
    description: 'Number of plants/units',
    nullable: true,
  })
  quantity?: number;

  @Field(() => String, { description: 'Crop status', nullable: true })
  status?: string;

  @Field(() => String, { description: 'Planting method', nullable: true })
  plantingMethod?: string;

  @Field(() => String, { description: 'Additional notes', nullable: true })
  notes?: string;

  @Field(() => CropVarietyResponseDto, { nullable: true })
  cropVariety?: CropVarietyResponseDto;

  @Field(() => String, {
    description: 'Date when the crop was created',
    nullable: true,
  })
  createdAt?: string;

  @Field(() => String, {
    description: 'Date when the crop was last updated',
    nullable: true,
  })
  updatedAt?: string;

  @Field(() => String, {
    description: 'Date when the crop was deleted (soft delete)',
    nullable: true,
  })
  deletedAt?: string;
}
