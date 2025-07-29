import { ICommand } from '@nestjs/cqrs';

/**
 * Command to delete a crop by its ID.
 * @remarks
 * This command triggers the deletion of a crop aggregate.
 */
export class DeleteCropCommand implements ICommand {
  /** Crop unique identifier */
  readonly cropId: string;

  /**
   * Creates a new DeleteCropCommand
   * @param cropId - The unique identifier of the crop to delete
   */
  constructor(cropId: string) {
    this.cropId = cropId;
  }
}
