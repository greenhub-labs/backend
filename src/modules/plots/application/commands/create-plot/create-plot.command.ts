/**
 * Command to create a new Plot
 */

import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';
import { PLOT_STATUS } from 'src/modules/plots/domain/constants/plot-status.constant';

export class CreatePlotCommand {
  /** Name of the farm */
  readonly name: string;
  /** Optional description */
  readonly description?: string;
  /** Status */
  readonly status?: PLOT_STATUS;
  /** Soil type */
  readonly soilType?: string;
  /** Soil pH */
  readonly soilPh?: number;
  /** Width */
  readonly width?: number;
  /** Length */
  readonly length?: number;
  /** Height */
  readonly height?: number;
  /** Unit measurement */
  readonly unitMeasurement?: UNIT_MEASUREMENT;
  /** Farm identifier */
  readonly farmId: string;

  /**
   * Creates a new CreateFarmCommand
   * @param params - Command properties
   */
  constructor(params: {
    name: string;
    description?: string;
    status?: PLOT_STATUS;
    soilType?: string;
    soilPh?: number;
    width?: number;
    length?: number;
    height?: number;
    unitMeasurement?: UNIT_MEASUREMENT;
    farmId: string;
  }) {
    this.name = params.name;
    this.description = params.description;
    this.status = params.status;
    this.soilType = params.soilType;
    this.soilPh = params.soilPh;
    this.width = params.width;
    this.length = params.length;
    this.height = params.height;
    this.unitMeasurement = params.unitMeasurement;
    this.farmId = params.farmId;
  }
}
