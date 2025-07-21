import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CROP_PLANTING_METHODS } from '../constants/crop-planting-methods.constant';
import { CROP_STATUS } from '../constants/crop-status.constant';
import { CropEntity } from '../entities/crop.entity';
import { CropIdValueObject } from '../value-objects/crop-id/crop-id.value-object';
import { CropPlantingMethodValueObject } from '../value-objects/crop-planting-method/crop-planting-method.value-object';
import { CropStatusValueObject } from '../value-objects/crop-status/crop-status.value-object';

/**
 * Factory class for creating Plot domain objects from primitive data
 */
@Injectable()
export class CropFactory {
  private readonly logger = new Logger(CropFactory.name);
  /**
   * Creates a new PlotEntity from primitive data (e.g., from a DTO)
   * @param data - Primitive data for the plot
   */
  create(data: {
    plotId: string;
    varietyId: string;
    plantingDate: Date;
    expectedHarvest: Date;
    actualHarvest: Date;
    quantity: number;
    status: string;
    plantingMethod: string;
    notes: string;
  }): CropEntity {
    this.logger.debug('Creating crop entity');
    this.logger.debug(JSON.stringify(data));
    return new CropEntity({
      id: new CropIdValueObject(randomUUID()),
      plotId: data.plotId,
      varietyId: data.varietyId,
      plantingDate: data.plantingDate,
      expectedHarvest: data.expectedHarvest,
      actualHarvest: data.actualHarvest,
      quantity: data.quantity,
      status: data.status
        ? new CropStatusValueObject(data.status)
        : new CropStatusValueObject(CROP_STATUS.PLANNED),
      plantingMethod: data.plantingMethod
        ? new CropPlantingMethodValueObject(data.plantingMethod)
        : new CropPlantingMethodValueObject(CROP_PLANTING_METHODS.DIRECT_SEED),
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
    });
  }

  /**
   * Reconstructs a PlotEntity from its primitive representation (e.g., from persistence)
   * @param primitives - Primitive data from persistence
   */
  static fromPrimitives(primitives: {
    id: string;
    plotId: string;
    varietyId: string;
    plantingDate: string;
    expectedHarvest: string;
    actualHarvest: string;
    quantity: number;
    status: string;
    plantingMethod: string;
    notes: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    deletedAt?: string | Date;
  }): CropEntity {
    return new CropEntity({
      id: new CropIdValueObject(primitives.id),
      plotId: primitives.plotId,
      varietyId: primitives.varietyId,
      plantingDate: new Date(primitives.plantingDate),
      expectedHarvest: new Date(primitives.expectedHarvest),
      actualHarvest: new Date(primitives.actualHarvest),
      quantity: primitives.quantity,
      status: new CropStatusValueObject(primitives.status),
      plantingMethod: new CropPlantingMethodValueObject(
        primitives.plantingMethod,
      ),
      notes: primitives.notes,
      createdAt: new Date(primitives.createdAt),
      updatedAt: new Date(primitives.updatedAt),
      deletedAt: primitives.deletedAt
        ? new Date(primitives.deletedAt)
        : undefined,
      emitEvent: false,
    });
  }
}
