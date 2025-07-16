import { IQuery } from '@nestjs/cqrs';

/**
 * Query to get all farms.
 */
export class GetAllFarmsQuery implements IQuery {
  /**
   * Creates a new GetAllFarmsQuery
   */
  constructor() {}
}
