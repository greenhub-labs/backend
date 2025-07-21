import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

/**
 * GetCropByIdRequestDto
 * Input DTO for getting a crop by ID
 */
@InputType()
export class GetCropByIdRequestDto {
  @Field(() => String, { description: 'Crop unique identifier' })
  @IsUUID()
  cropId: string;
}
