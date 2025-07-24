import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SEASON } from 'src/shared/domain/constants/season.constant';
import { CropVarietyEntity } from '../entities/crop-variety.entity';
import { CropVarietyIdValueObject } from '../value-objects/crop-variety-id/crop-variety-id.value-object';

/**
 * Factory class for creating Plot domain objects from primitive data
 */
@Injectable()
export class CropVarietyFactory {
  private readonly logger = new Logger(CropVarietyFactory.name);
  /**
   * Creates a new PlotEntity from primitive data (e.g., from a DTO)
   * @param data - Primitive data for the plot
   */
  create(data: {
    name: string;
    scientificName?: string;
    type: string;
    description?: string;
    averageYield?: number;
    daysToMaturity?: number;
    plantingDepth?: number;
    spacingBetween?: number;
    waterRequirements?: string;
    sunRequirements?: string;
    minIdealTemperature?: number;
    maxIdealTemperature?: number;
    minIdealPh?: number;
    maxIdealPh?: number;
    compatibleWith: string[];
    incompatibleWith: string[];
    plantingSeasons: string[];
    harvestSeasons: string[];
  }): CropVarietyEntity {
    this.logger.debug('Creating crop variety entity');
    this.logger.debug(JSON.stringify(data));
    return new CropVarietyEntity({
      id: new CropVarietyIdValueObject(randomUUID()),
      name: data.name,
      scientificName: data.scientificName,
      type: data.type,
      description: data.description,
      averageYield: data.averageYield,
      daysToMaturity: data.daysToMaturity,
      plantingDepth: data.plantingDepth,
      spacingBetween: data.spacingBetween,
      waterRequirements: data.waterRequirements,
      sunRequirements: data.sunRequirements,
      minIdealTemperature: data.minIdealTemperature,
      maxIdealTemperature: data.maxIdealTemperature,
      minIdealPh: data.minIdealPh,
      maxIdealPh: data.maxIdealPh,
      compatibleWith: data.compatibleWith,
      incompatibleWith: data.incompatibleWith,
      plantingSeasons: data.plantingSeasons as SEASON[],
      harvestSeasons: data.harvestSeasons as SEASON[],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
    });
  }

  /**
   * Reconstructs a CropVarietyEntity from its primitive representation (e.g., from persistence)
   * @param primitives - Primitive data from persistence
   */
  static fromPrimitives(primitives: {
    id: string;
    name: string;
    scientificName?: string;
    type: string;
    description?: string;
    averageYield?: number;
    daysToMaturity?: number;
    plantingDepth?: number;
    spacingBetween?: number;
    waterRequirements?: string;
    sunRequirements?: string;
    minIdealTemperature?: number;
    maxIdealTemperature?: number;
    minIdealPh?: number;
    maxIdealPh?: number;
    compatibleWith: string[];
    incompatibleWith: string[];
    plantingSeasons: string[];
    harvestSeasons: string[];
    createdAt: string | Date;
    updatedAt: string | Date;
    deletedAt?: string | Date;
  }): CropVarietyEntity {
    return new CropVarietyEntity({
      id: new CropVarietyIdValueObject(primitives.id),
      name: primitives.name,
      scientificName: primitives.scientificName,
      type: primitives.type,
      description: primitives.description,
      averageYield: primitives.averageYield,
      daysToMaturity: primitives.daysToMaturity,
      plantingDepth: primitives.plantingDepth,
      spacingBetween: primitives.spacingBetween,
      waterRequirements: primitives.waterRequirements,
      sunRequirements: primitives.sunRequirements,
      minIdealTemperature: primitives.minIdealTemperature,
      maxIdealTemperature: primitives.maxIdealTemperature,
      minIdealPh: primitives.minIdealPh,
      maxIdealPh: primitives.maxIdealPh,
      compatibleWith: primitives.compatibleWith,
      incompatibleWith: primitives.incompatibleWith,
      plantingSeasons: primitives.plantingSeasons as SEASON[],
      harvestSeasons: primitives.harvestSeasons as SEASON[],
      createdAt: new Date(primitives.createdAt),
      updatedAt: new Date(primitives.updatedAt),
      deletedAt: primitives.deletedAt
        ? new Date(primitives.deletedAt)
        : undefined,
      emitEvent: false,
    });
  }
}
