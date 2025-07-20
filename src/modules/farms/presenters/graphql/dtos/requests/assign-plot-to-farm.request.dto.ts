import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

/**
 * Input DTO for assigning a plot to a farm
 */
@InputType()
export class AssignPlotToFarmRequestDto {
  @Field()
  @IsUUID()
  plotId: string;

  @Field()
  @IsUUID()
  farmId: string;
}
