import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateFarmsCommand } from './update-farms.command';

/**
 * Handler for UpdateFarmsCommand.
 * Add your business logic in the execute method.
 */
@CommandHandler(UpdateFarmsCommand)
export class UpdateFarmsCommandHandler implements ICommandHandler<UpdateFarmsCommand> {
  /**
   * Executes the update command.
   * @param command - The update command
   */
  async execute(command: UpdateFarmsCommand): Promise<void> {
    // Implement your update logic here
  }
} 