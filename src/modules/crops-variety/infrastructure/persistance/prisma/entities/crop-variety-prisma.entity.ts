import { CropType, Prisma, Season } from '@prisma/client';
import { CropVarietyEntity } from 'src/modules/crops-variety/domain/entities/crop-variety.entity';
import { CropVarietyIdValueObject } from 'src/modules/crops-variety/domain/value-objects/crop-variety-id/crop-variety-id.value-object';
import { SEASON } from 'src/shared/domain/constants/season.constant';

/**
 * CropVarietyPrismaEntity
 * Maps between Prisma model and domain CropVarietyEntity
 */
export class CropVarietyPrismaEntity {
  /**
   * Converts a Prisma model to a domain CropVarietyEntity
   * @param prismaData - The Prisma model data
   * @returns Domain CropVarietyEntity
   */
  static fromPrisma(prismaData: any): CropVarietyEntity {
    return new CropVarietyEntity({
      id: new CropVarietyIdValueObject(prismaData.id),
      name: prismaData.name,
      scientificName: prismaData.scientificName,
      type: prismaData.type as CropType,
      description: prismaData.description,
      averageYield: prismaData.averageYield,
      daysToMaturity: prismaData.daysToMaturity,
      plantingDepth: prismaData.plantingDepth,
      spacingBetween: prismaData.spacingBetween,
      waterRequirements: prismaData.waterRequirements,
      sunRequirements: prismaData.sunRequirements,
      minIdealTemperature: prismaData.minIdealTemperature,
      maxIdealTemperature: prismaData.maxIdealTemperature,
      minIdealPh: prismaData.minIdealPh,
      maxIdealPh: prismaData.maxIdealPh,
      compatibleWith: prismaData.compatibleWith,
      incompatibleWith: prismaData.incompatibleWith,
      plantingSeasons: prismaData.plantingSeasons as unknown as SEASON[],
      harvestSeasons: prismaData.harvestSeasons as unknown as SEASON[],
      createdAt: prismaData.createdAt,
      updatedAt: prismaData.updatedAt,
      deletedAt: prismaData.deletedAt ?? undefined,
    });
  }

  /**
   * Converts a domain CropVarietyEntity to a Prisma-compatible object for creation
   * @param entity - The domain CropVarietyEntity
   * @returns Prisma-compatible object for creation
   */
  static toPrismaCreate(
    entity: CropVarietyEntity,
  ): Prisma.CropVarietyCreateInput {
    return {
      id: entity.id.value,
      name: entity.name,
      scientificName: entity.scientificName,
      type: entity.type.value as CropType,
      description: entity.description,
      averageYield: entity.averageYield,
      daysToMaturity: entity.daysToMaturity,
      plantingDepth: entity.plantingDepth,
      spacingBetween: entity.spacingBetween,
      waterRequirements: entity.waterRequirements,
      sunRequirements: entity.sunRequirements,
      minIdealTemperature: entity.minIdealTemperature,
      maxIdealTemperature: entity.maxIdealTemperature,
      minIdealPh: entity.minIdealPh,
      maxIdealPh: entity.maxIdealPh,
      compatibleWith: entity.compatibleWith,
      incompatibleWith: entity.incompatibleWith,
      plantingSeasons: entity.plantingSeasons as unknown as Season[],
      harvestSeasons: entity.harvestSeasons as unknown as Season[],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt ?? null,
    };
  }

  /**
   * Converts a domain CropVarietyEntity to a Prisma-compatible object for updates
   * @param entity - The domain CropVarietyEntity
   * @returns Prisma-compatible object for updates
   */
  static toPrismaUpdate(
    entity: CropVarietyEntity,
  ): Prisma.CropVarietyUpdateInput {
    return {
      name: entity.name,
      scientificName: entity.scientificName ?? undefined,
      type: entity.type.value as CropType,
      description: entity.description,
      averageYield: entity.averageYield,
      daysToMaturity: entity.daysToMaturity,
      plantingDepth: entity.plantingDepth,
      spacingBetween: entity.spacingBetween,
      waterRequirements: entity.waterRequirements,
      sunRequirements: entity.sunRequirements,
      minIdealTemperature: entity.minIdealTemperature,
      maxIdealTemperature: entity.maxIdealTemperature,
      minIdealPh: entity.minIdealPh,
      maxIdealPh: entity.maxIdealPh,
      compatibleWith: entity.compatibleWith,
      incompatibleWith: entity.incompatibleWith,
      plantingSeasons: entity.plantingSeasons as unknown as Season[],
      harvestSeasons: entity.harvestSeasons as unknown as Season[],
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt ?? null,
    };
  }
}
