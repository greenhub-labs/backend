import { Field, ObjectType } from '@nestjs/graphql';
import { PLOT_SOIL_TYPES } from 'src/modules/plots/domain/constants/plot-soil-types.constant';
import {
  UNIT_MEASUREMENT,
  UNIT_MEASUREMENT_CATEGORY,
} from 'src/shared/domain/constants/unit-measurement.constant';

/**
 * PlotDimensionsResponseDto
 * Response DTO for plot dimensions
 */
@ObjectType()
export class PlotDimensionsResponseDto {
  @Field(() => Number, {
    description: 'Width of the plot',
    nullable: true,
  })
  width: number;

  @Field(() => Number, {
    description: 'Length of the plot',
    nullable: true,
  })
  length: number;

  @Field(() => Number, {
    description: 'Height of the plot',
    nullable: true,
  })
  height: number;

  @Field(() => Number, {
    description: 'Area of the plot',
    nullable: true,
  })
  area: number;

  @Field(() => Number, {
    description: 'Perimeter of the plot',
    nullable: true,
  })
  perimeter: number;

  @Field(() => Number, {
    description: 'Volume of the plot',
    nullable: true,
  })
  volume: number;

  @Field(() => String, {
    description: 'Unit of measurement (e.g., METERS, FEET, CENTIMETERS)',
    nullable: true,
  })
  unitMeasurement: UNIT_MEASUREMENT;

  @Field(() => String, {
    description: 'Category of unit measurement (METRIC or IMPERIAL)',
    nullable: true,
  })
  unitMeasurementCategory: UNIT_MEASUREMENT_CATEGORY;
}

/**
 * PlotResponseDto
 * Response DTO for plot data
 */
@ObjectType()
export class PlotResponseDto {
  @Field(() => String, {
    description: 'Unique identifier of the plot',
  })
  id: string;

  @Field(() => String, {
    description: 'Name of the plot',
  })
  name: string;

  @Field(() => String, {
    description: 'Optional description of the plot',
    nullable: true,
  })
  description?: string;

  @Field(() => PlotDimensionsResponseDto, {
    description: 'Dimensions of the plot',
    nullable: true,
  })
  dimensions: PlotDimensionsResponseDto;

  @Field(() => String, {
    description: 'Status of the plot',
    nullable: true,
  })
  status: string;

  @Field(() => String, {
    description: 'Type of soil in the plot',
    nullable: true,
  })
  soilType: PLOT_SOIL_TYPES;

  @Field(() => Number, {
    description: 'Soil pH level (0-14)',
    nullable: true,
  })
  soilPh: number;

  @Field(() => String, {
    description: 'ID of the farm this plot belongs to',
    nullable: true,
  })
  farmId: string;

  @Field(() => Date, {
    description: 'Date when the plot was created',
    nullable: true,
  })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Date when the plot was last updated',
    nullable: true,
  })
  updatedAt: Date;

  @Field(() => Date, {
    description: 'Date when the plot was deleted (soft delete)',
    nullable: true,
  })
  deletedAt?: Date;
}
