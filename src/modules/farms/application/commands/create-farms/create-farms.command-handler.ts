import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateFarmsCommand } from './create-farms.command';

/**
 * Handler for CreateFarmsCommand.
 * Add your business logic in the execute method.
 */
@CommandHandler(CreateFarmsCommand)
export class CreateFarmsCommandHandler implements ICommandHandler<CreateFarmsCommand> {
  /**
   * Executes the create command.
   * @param command - The create command
   */
  async execute(command: CreateFarmsCommand): Promise<void> {
    // Implement your creation logic here
  }
} 