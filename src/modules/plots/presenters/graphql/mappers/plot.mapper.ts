import { Logger } from '@nestjs/common';
import { PlotEntity } from 'src/modules/plots/domain/entities/plot.entity';
import {
  PlotResponseDto,
  PlotDimensionsResponseDto,
} from '../dtos/responses/plot.response.dto';

/**
 * PlotMapper
 * Maps between domain entities and GraphQL DTOs
 */
export class PlotMapper {
  /**
   * Converts a domain PlotEntity to a GraphQL response DTO
   * @param plot - The domain PlotEntity
   * @returns GraphQL response DTO
   */
  static fromDomain(plot: PlotEntity): PlotResponseDto {
    return {
      id: plot.id.value,
      name: plot.name.value,
      description: plot.description,
      dimensions: {
        width: plot.dimensions.getWidth(),
        length: plot.dimensions.getLength(),
        height: plot.dimensions.getHeight(),
        area: plot.dimensions.getArea(),
        perimeter: plot.dimensions.getPerimeter(),
        volume: plot.dimensions.getVolume(),
        unitMeasurement: plot.dimensions.getUnitMeasurement(),
        unitMeasurementCategory: plot.dimensions.getUnitMeasurementCategory(),
      },
      status: plot.status.value as any,
      soilType: plot.soilType,
      soilPh: plot.soilPh,
      farmId: plot.farmId,
      createdAt: plot.createdAt,
      updatedAt: plot.updatedAt,
      deletedAt: plot.deletedAt,
    };
  }
}
