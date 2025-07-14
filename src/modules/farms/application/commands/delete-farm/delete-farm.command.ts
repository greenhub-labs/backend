import { ICommand } from '@nestjs/cqrs';

/**
 * Command to delete a farm by its ID.
 * @remarks
 * This command triggers the deletion of a farm aggregate.
 */
export class DeleteFarmCommand implements ICommand {
  /** Farm unique identifier */
  readonly farmId: string;

  /**
   * Creates a new DeleteFarmCommand
   * @param farmId - The unique identifier of the farm to delete
   */
  constructor(farmId: string) {
    this.farmId = farmId;
  }
}
