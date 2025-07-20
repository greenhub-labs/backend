import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

/**
 * DeletePlotRequestDto
 * Input DTO for deleting a plot by ID
 */
@InputType()
export class DeletePlotRequestDto {
  @Field(() => String, {
    description: 'Unique identifier of the plot to delete',
  })
  @IsUUID()
  id: string;
}
