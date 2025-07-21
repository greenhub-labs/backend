import { IQuery } from '@nestjs/cqrs';

/**
 * Query to get all crops.
 */
export class GetAllCropsQuery implements IQuery {
  /**
   * Creates a new GetAllCropsQuery
   */
  constructor() {}
}
