import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

/**
 * DeleteCropRequestDto
 * Input DTO for deleting a crop
 */
@InputType()
export class DeleteCropRequestDto {
  @Field(() => String, { description: 'Crop unique identifier' })
  @IsUUID()
  cropId: string;
}
