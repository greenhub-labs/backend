import { IQuery } from '@nestjs/cqrs';

/**
 * Query to get all plots.
 */
export class GetAllPlotsQuery implements IQuery {
  /**
   * Creates a new GetAllPlotsQuery
   */
  constructor() {}
}
