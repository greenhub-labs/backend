import { IQuery } from '@nestjs/cqrs';

/**
 * Query to get plots by farm ID.
 */
export class GetPlotsByFarmIdQuery implements IQuery {
  /** Farm unique identifier */
  readonly farmId: string;

  /**
   * Creates a new GetPlotsByFarmIdQuery
   * @param farmId - The unique identifier of the farm
   */
  constructor(farmId: string) {
    this.farmId = farmId;
  }
}
