import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';
import { PLOT_SOIL_TYPES } from '../constants/plot-soil-types.constant';
import { PLOT_STATUS } from '../constants/plot-status.constant';
import { PlotEntity } from '../entities/plot.entity';
import { PlotDimensionValueObject } from '../value-objects/plot-dimension/plot-dimension.value-object';
import { PlotIdValueObject } from '../value-objects/plot-id/plot-id.value-object';
import { PlotNameValueObject } from '../value-objects/plot-name/plot-name.value-object';
import { PlotSoilTypeValueObject } from '../value-objects/plot-soil-type/plot-soil-type.value-object';
import { PlotStatusValueObject } from '../value-objects/plot-status/plot-status.value-object';

/**
 * Factory class for creating Farm domain objects from primitive data
 */
@Injectable()
export class PlotFactory {
  private readonly logger = new Logger(PlotFactory.name);
  /**
   * Creates a new FarmEntity from primitive data (e.g., from a DTO)
   * @param data - Primitive data for the farm
   */
  create(data: {
    name: string;
    description?: string;
    width?: number;
    length?: number;
    height?: number;
    unitMeasurement?: UNIT_MEASUREMENT;
    status?: PLOT_STATUS;
    soilType?: PLOT_SOIL_TYPES;
    soilPh?: number;
    farmId?: string;
  }): PlotEntity {
    this.logger.debug('Creating plot entity');
    this.logger.debug(JSON.stringify(data));
    return new PlotEntity({
      id: new PlotIdValueObject(randomUUID()),
      name: new PlotNameValueObject(data.name),
      description: data.description,
      dimensions: new PlotDimensionValueObject(
        data.width,
        data.length,
        data.height,
        data.unitMeasurement,
      ),
      status: new PlotStatusValueObject(data.status ?? PLOT_STATUS.PREPARING),
      soilType: data.soilType
        ? new PlotSoilTypeValueObject(data.soilType)
        : undefined,
      soilPh: data.soilPh,
      farmId: data.farmId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
    });
  }

  /**
   * Reconstructs a FarmEntity from its primitive representation (e.g., from persistence)
   * @param primitives - Primitive data from persistence
   */
  static fromPrimitives(primitives: {
    id: string;
    name: string;
    description?: string;
    width?: number;
    length?: number;
    height?: number;
    area?: number;
    perimeter?: number;
    volume?: number;
    unitMeasurement?: string;
    status?: string;
    soilType?: string;
    soilPh?: number;
    farmId?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    deletedAt?: string | Date;
  }): PlotEntity {
    return new PlotEntity({
      id: new PlotIdValueObject(primitives.id),
      name: new PlotNameValueObject(primitives.name),
      description: primitives.description,
      dimensions: new PlotDimensionValueObject(
        primitives.width,
        primitives.length,
        primitives.height,
        primitives.unitMeasurement as UNIT_MEASUREMENT,
      ),
      status: new PlotStatusValueObject(primitives.status),
      soilType: primitives.soilType
        ? new PlotSoilTypeValueObject(primitives.soilType)
        : undefined,
      soilPh: primitives.soilPh,
      farmId: primitives.farmId,
      createdAt: new Date(primitives.createdAt),
      updatedAt: new Date(primitives.updatedAt),
      deletedAt: primitives.deletedAt
        ? new Date(primitives.deletedAt)
        : undefined,
      emitEvent: false,
    });
  }
}
