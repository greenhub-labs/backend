import { IQuery } from '@nestjs/cqrs';

/**
 * Query to get a crop variety by its ID.
 */
export class GetCropVarietyByIdQuery implements IQuery {
  /** Crop variety unique identifier */
  readonly cropVarietyId: string;

  /**
   * Creates a new GetCropVarietyByIdQuery
   * @param cropVarietyId - The unique identifier of the crop variety
   */
  constructor(cropVarietyId: string) {
    this.cropVarietyId = cropVarietyId;
  }
}
