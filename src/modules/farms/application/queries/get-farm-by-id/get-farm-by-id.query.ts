import { IQuery } from '@nestjs/cqrs';

/**
 * Query to get a farm by its ID.
 */
export class GetFarmByIdQuery implements IQuery {
  /** Farm unique identifier */
  readonly farmId: string;

  /**
   * Creates a new GetFarmByIdQuery
   * @param farmId - The unique identifier of the farm
   */
  constructor(farmId: string) {
    this.farmId = farmId;
  }
}
