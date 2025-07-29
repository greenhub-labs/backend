/**
 * Command to create a new Crop
 */

/**
 * Command to create a new Crop
 * @param plotId - Plot where the crop is planted
 * @param varietyId - Crop variety
 * @param plantingDate - Actual planting date
 * @param expectedHarvest - Expected harvest date
 * @param actualHarvest - Actual harvest date
 * @param quantity - Number of plants/units
 * @param status - Crop status
 * @param plantingMethod - Planting method
 * @param notes - Additional notes
 */
export class CreateCropCommand {
  /** Plot where the crop is planted */
  readonly plotId: string;
  /** Crop variety */
  readonly varietyId: string;
  /** Actual planting date */
  readonly plantingDate?: Date;
  /** Expected harvest date */
  readonly expectedHarvest?: Date;
  /** Actual harvest date */
  readonly actualHarvest?: Date;
  /** Number of plants/units */
  readonly quantity?: number;
  /** Crop status */
  readonly status?: string;
  /** Planting method */
  readonly plantingMethod: string;
  /** Additional notes */
  readonly notes?: string;

  constructor(params: {
    plotId: string;
    varietyId: string;
    plantingDate?: Date;
    expectedHarvest?: Date;
    actualHarvest?: Date;
    quantity?: number;
    status?: string;
    plantingMethod: string;
    notes?: string;
  }) {
    this.plotId = params.plotId;
    this.varietyId = params.varietyId;
    this.plantingDate = params.plantingDate;
    this.expectedHarvest = params.expectedHarvest;
    this.actualHarvest = params.actualHarvest;
    this.quantity = params.quantity;
    this.status = params.status;
    this.plantingMethod = params.plantingMethod;
    this.notes = params.notes;
  }
}
