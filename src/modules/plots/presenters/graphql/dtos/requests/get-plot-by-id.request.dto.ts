import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

/**
 * GetPlotByIdRequestDto
 * Input DTO for getting a plot by ID
 */
@InputType()
export class GetPlotByIdRequestDto {
  @Field(() => String, {
    description: 'Unique identifier of the plot',
  })
  @IsUUID()
  id: string;
}
