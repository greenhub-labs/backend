import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteFarmsCommand } from './delete-farms.command';

/**
 * Handler for DeleteFarmsCommand.
 * Add your business logic in the execute method.
 */
@CommandHandler(DeleteFarmsCommand)
export class DeleteFarmsCommandHandler implements ICommandHandler<DeleteFarmsCommand> {
  /**
   * Executes the delete command.
   * @param command - The delete command
   */
  async execute(command: DeleteFarmsCommand): Promise<void> {
    // Implement your delete logic here
  }
} 