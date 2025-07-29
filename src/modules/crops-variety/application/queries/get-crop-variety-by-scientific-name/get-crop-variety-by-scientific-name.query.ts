import { IQuery } from '@nestjs/cqrs';

/**
 * Query to get a crop variety by its scientific name.
 */
export class GetCropVarietyByScientificNameQuery implements IQuery {
  /**
   * Creates a new GetCropVarietyByScientificNameQuery
   * @param scientificName - The scientific name to search for
   */
  constructor(public readonly scientificName: string) {}
}
