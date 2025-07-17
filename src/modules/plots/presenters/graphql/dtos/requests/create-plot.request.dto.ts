import { Field, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { PLOT_STATUS } from 'src/modules/plots/domain/constants/plot-status.constant';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';

/**
 * CreatePlotRequestDto
 * Input DTO for creating a new plot
 */
@InputType()
export class CreatePlotRequestDto {
  @Field(() => String, {
    description: 'Name of the plot',
  })
  @IsString()
  name: string;

  @Field(() => String, {
    description: 'Optional description of the plot',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Number, {
    description: 'Width of the plot in the specified unit',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  width: number;

  @Field(() => Number, {
    description: 'Length of the plot in the specified unit',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  length: number;

  @Field(() => Number, {
    description: 'Height of the plot in the specified unit',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  height: number;

  @Field(() => String, {
    description:
      'Unit of measurement for the plot dimensions (e.g., METERS, FEET, CENTIMETERS, INCHES)',
    nullable: true,
  })
  @IsOptional()
  @IsEnum(UNIT_MEASUREMENT)
  unitMeasurement: UNIT_MEASUREMENT;

  @Field(() => String, {
    description: 'Type of soil in the plot',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  soilType: string;

  @Field(() => Number, {
    description: 'Soil pH level (0-14)',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(14)
  soilPh: number;

  @Field(() => String, {
    description: 'Status of the plot',
    nullable: true,
  })
  @IsOptional()
  @IsEnum(PLOT_STATUS)
  status: PLOT_STATUS;

  @Field(() => String, {
    description: 'ID of the farm this plot belongs to',
  })
  @IsUUID()
  farmId: string;
}
