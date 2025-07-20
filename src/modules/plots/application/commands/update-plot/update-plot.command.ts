/**
 * Command to update an existing Farm
 */
import { PLOT_SOIL_TYPES } from 'src/modules/plots/domain/constants/plot-soil-types.constant';
import { PLOT_STATUS } from 'src/modules/plots/domain/constants/plot-status.constant';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';

export class UpdatePlotCommand {
  /** Unique identifier for the plot */
  readonly id: string;
  /** Name of the plot */
  readonly name?: string;
  /** Optional description */
  readonly description?: string;
  /** Status */
  readonly status?: PLOT_STATUS;
  /** Soil type */
  readonly soilType?: PLOT_SOIL_TYPES;
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

  /**
   * Creates a new UpdatePlotCommand
   * @param params - Command properties
   */
  constructor(params: {
    id: string;
    name?: string;
    description?: string;
    status?: PLOT_STATUS;
    soilType?: PLOT_SOIL_TYPES;
    soilPh?: number;
    width?: number;
    length?: number;
    height?: number;
    unitMeasurement?: UNIT_MEASUREMENT;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.status = params.status;
    this.soilType = params.soilType;
    this.soilPh = params.soilPh;
    this.width = params.width;
    this.length = params.length;
    this.height = params.height;
    this.unitMeasurement = params.unitMeasurement;
  }
}
