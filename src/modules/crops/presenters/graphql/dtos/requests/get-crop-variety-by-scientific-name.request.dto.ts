import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * GetCropVarietyByScientificNameRequestDto
 * Input DTO for getting a crop variety by scientific name
 */
@InputType()
export class GetCropVarietyByScientificNameRequestDto {
  @Field(() => String, { description: 'Scientific name of the crop variety' })
  @IsString()
  @IsNotEmpty()
  scientificName: string;
}
