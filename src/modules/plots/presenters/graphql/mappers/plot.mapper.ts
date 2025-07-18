import { PlotEntity } from 'src/modules/plots/domain/entities/plot.entity';
import { PlotResponseDto } from '../dtos/responses/plot.response.dto';

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
        width: plot.dimensions.width,
        length: plot.dimensions.length,
        height: plot.dimensions.height,
        area: plot.dimensions.area,
        perimeter: plot.dimensions.perimeter,
        volume: plot.dimensions.volume,
        unitMeasurement: plot.dimensions.unitMeasurement,
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
