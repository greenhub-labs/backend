import { PlotEntity } from '../../../../domain/entities/plot.entity';
import { PlotIdValueObject } from '../../../../domain/value-objects/plot-id/plot-id.value-object';
import { PlotNameValueObject } from '../../../../domain/value-objects/plot-name/plot-name.value-object';
import { PlotDimensionValueObject } from '../../../../domain/value-objects/plot-dimension/plot-dimension.value-object';
import { PlotStatusValueObject } from '../../../../domain/value-objects/plot-status/plot-status.value-object';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';
import { PlotStatus, Prisma } from '@prisma/client';

/**
 * PlotPrismaEntity
 * Maps between Prisma model and domain PlotEntity
 */
export class PlotPrismaEntity {
  /**
   * Converts a Prisma model to a domain PlotEntity
   * @param prismaData - The Prisma model data
   * @returns Domain PlotEntity
   */
  static fromPrisma(prismaData: any): PlotEntity {
    return new PlotEntity({
      id: new PlotIdValueObject(prismaData.id),
      name: new PlotNameValueObject(prismaData.name),
      farmId: prismaData.farmId,
      status: new PlotStatusValueObject(prismaData.status),
      soilType: prismaData.soilType,
      soilPh: prismaData.soilPh,
      description: prismaData.description ?? undefined,
      dimensions: new PlotDimensionValueObject(
        prismaData.width,
        prismaData.length,
        prismaData.height,
        prismaData.unitMeasurement,
      ),
      createdAt: prismaData.createdAt,
      updatedAt: prismaData.updatedAt,
      deletedAt: prismaData.deletedAt ?? undefined,
      emitEvent: false,
    });
  }

  /**
   * Converts a domain PlotEntity to a Prisma-compatible object for creation
   * @param entity - The domain PlotEntity
   * @returns Prisma-compatible object for creation
   */
  static toPrismaCreate(entity: PlotEntity): Prisma.PlotCreateInput {
    return {
      id: entity.id.value,
      name: entity.name.value,
      description: entity.description,
      width: entity.dimensions.getWidth(),
      length: entity.dimensions.getLength(),
      height: entity.dimensions.getHeight(),
      unitMeasurement: entity.dimensions.getUnitMeasurement(),
      area: entity.dimensions.getArea(),
      perimeter: entity.dimensions.getPerimeter(),
      volume: entity.dimensions.getVolume(),
      soilType: entity.soilType,
      soilPh: entity.soilPh,
      farm: {
        connect: {
          id: entity.farmId,
        },
      },
      status: entity.status.value as PlotStatus,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt ?? null,
    };
  }

  /**
   * Converts a domain PlotEntity to a Prisma-compatible object for updates
   * @param entity - The domain PlotEntity
   * @returns Prisma-compatible object for updates
   */
  static toPrismaUpdate(entity: PlotEntity): Prisma.PlotUpdateInput {
    return {
      name: entity.name.value,
      description: entity.description,
      width: entity.dimensions.getWidth(),
      length: entity.dimensions.getLength(),
      height: entity.dimensions.getHeight(),
      unitMeasurement: entity.dimensions.getUnitMeasurement(),
      area: entity.dimensions.getArea(),
      perimeter: entity.dimensions.getPerimeter(),
      volume: entity.dimensions.getVolume(),
      soilType: entity.soilType,
      soilPh: entity.soilPh,
      status: entity.status.value as PlotStatus,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt ?? null,
    };
  }
}
