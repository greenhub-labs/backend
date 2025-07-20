import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { PLOT_SOIL_TYPES } from 'src/modules/plots/domain/constants/plot-soil-types.constant';
import { PLOT_STATUS } from 'src/modules/plots/domain/constants/plot-status.constant';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';

/**
 * UpdatePlotRequestDto
 * Input DTO for updating an existing plot
 */
@InputType()
export class UpdatePlotRequestDto {
  @Field(() => String, {
    description: 'Unique identifier of the plot to update',
  })
  @IsUUID()
  id: string;

  @Field(() => String, {
    description: 'Name of the plot',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  name?: string;

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
  width?: number;

  @Field(() => Number, {
    description: 'Length of the plot in the specified unit',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  length?: number;

  @Field(() => Number, {
    description: 'Height of the plot in the specified unit',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  height?: number;

  @Field(() => String, {
    description:
      'Unit of measurement for the plot dimensions (e.g., METERS, FEET, CENTIMETERS, INCHES)',
    nullable: true,
  })
  @IsOptional()
  @IsEnum(UNIT_MEASUREMENT)
  unitMeasurement?: UNIT_MEASUREMENT;

  @Field(() => String, {
    description: 'Type of soil in the plot',
    nullable: true,
  })
  @IsOptional()
  @IsEnum(PLOT_SOIL_TYPES)
  soilType?: PLOT_SOIL_TYPES;

  @Field(() => Number, {
    description: 'Soil pH level (0-14)',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(14)
  soilPh?: number;

  @Field(() => String, {
    description: 'Status of the plot',
    nullable: true,
  })
  @IsOptional()
  @IsEnum(PLOT_STATUS)
  status?: PLOT_STATUS;
}
