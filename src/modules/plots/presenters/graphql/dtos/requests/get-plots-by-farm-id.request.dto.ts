import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

/**
 * GetPlotByFarmIdRequestDto
 * Input DTO for getting a plot by farm ID
 */
@InputType()
export class GetPlotsByFarmIdRequestDto {
  @Field(() => String, {
    description: 'Unique identifier of the farm',
  })
  @IsUUID()
  farmId: string;
}
