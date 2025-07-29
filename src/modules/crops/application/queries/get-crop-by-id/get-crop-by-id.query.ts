import { IQuery } from '@nestjs/cqrs';

/**
 * Query to get a crop by its ID.
 */
export class GetCropByIdQuery implements IQuery {
  /** Crop unique identifier */
  readonly cropId: string;

  /**
   * Creates a new GetCropByIdQuery
   * @param cropId - The unique identifier of the crop
   */
  constructor(cropId: string) {
    this.cropId = cropId;
  }
}
