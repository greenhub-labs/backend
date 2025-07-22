import { CropStatus, PlantingMethod, Prisma } from '@prisma/client';
import { CropEntity } from '../../../../domain/entities/crop.entity';
import { CropIdValueObject } from '../../../../domain/value-objects/crop-id/crop-id.value-object';
import { CropPlantingMethodValueObject } from '../../../../domain/value-objects/crop-planting-method/crop-planting-method.value-object';
import { CropStatusValueObject } from '../../../../domain/value-objects/crop-status/crop-status.value-object';

/**
 * PlotPrismaEntity
 * Maps between Prisma model and domain PlotEntity
 */
export class CropPrismaEntity {
  /**
   * Converts a Prisma model to a domain PlotEntity
   * @param prismaData - The Prisma model data
   * @returns Domain PlotEntity
   */
  static fromPrisma(prismaData: any): CropEntity {
    return new CropEntity({
      id: new CropIdValueObject(prismaData.id),
      plotId: prismaData.plotId,
      varietyId: prismaData.varietyId,
      plantingDate: prismaData.plantingDate,
      expectedHarvest: prismaData.expectedHarvest,
      actualHarvest: prismaData.actualHarvest,
      quantity: prismaData.quantity,
      status: new CropStatusValueObject(prismaData.status),
      plantingMethod: prismaData.plantingMethod
        ? new CropPlantingMethodValueObject(prismaData.plantingMethod)
        : undefined,
      notes: prismaData.notes,
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
  static toPrismaCreate(entity: CropEntity): Prisma.CropCreateInput {
    return {
      id: entity.id.value,
      plot: {
        connect: {
          id: entity.plotId,
        },
      },
      variety: {
        connect: {
          id: entity.varietyId,
        },
      },
      plantingDate: entity.plantingDate.toISOString(),
      expectedHarvest: entity.expectedHarvest.toISOString(),
      actualHarvest: entity.actualHarvest.toISOString(),
      quantity: entity.quantity,
      status: entity.status.value as CropStatus,
      plantingMethod: entity.plantingMethod?.value as PlantingMethod,
      notes: entity.notes,
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
  static toPrismaUpdate(entity: CropEntity): Prisma.CropUpdateInput {
    return {
      plot: {
        connect: {
          id: entity.plotId,
        },
      },
      variety: {
        connect: {
          id: entity.varietyId,
        },
      },
      plantingDate: entity.plantingDate.toISOString(),
      expectedHarvest: entity.expectedHarvest.toISOString(),
      actualHarvest: entity.actualHarvest.toISOString(),
      quantity: entity.quantity,
      status: entity.status.value as CropStatus,
      plantingMethod: entity.plantingMethod?.value as PlantingMethod,
      notes: entity.notes,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt ?? null,
    };
  }
}
