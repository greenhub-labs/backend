import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

/**
 * GetCropsByFarmIdRequestDto
 * Input DTO for getting all crops by farm ID
 */
@InputType()
export class GetCropsByFarmIdRequestDto {
  @Field(() => String, { description: 'Farm unique identifier' })
  @IsUUID()
  farmId: string;
}
