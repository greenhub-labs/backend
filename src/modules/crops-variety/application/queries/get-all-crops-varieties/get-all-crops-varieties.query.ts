import { IQuery } from '@nestjs/cqrs';

/**
 * Query to get all crops varieties.
 */
export class GetAllCropsVarietiesQuery implements IQuery {
  /**
   * Creates a new GetAllCropsVarietiesQuery
   */
  constructor() {}
}
