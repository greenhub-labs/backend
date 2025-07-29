import { IQuery } from '@nestjs/cqrs';

/**
 * Query to get crops by farm ID.
 */
export class GetCropsByFarmIdQuery implements IQuery {
  /** Farm unique identifier */
  readonly farmId: string;

  /**
   * Creates a new GetCropsByFarmIdQuery
   * @param farmId - The unique identifier of the farm
   */
  constructor(farmId: string) {
    this.farmId = farmId;
  }
}
