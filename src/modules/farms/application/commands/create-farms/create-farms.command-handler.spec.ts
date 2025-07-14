import { CreateFarmsCommand } from './create-farms.command';
import { CreateFarmsCommandHandler } from './create-farms.command-handler';

describe('CreateFarmsCommandHandler', () => {
  it('should be defined', () => {
    const handler = new CreateFarmsCommandHandler();
    expect(handler).toBeDefined();
  });

  it('should execute without errors', async () => {
    const handler = new CreateFarmsCommandHandler();
    const command = new CreateFarmsCommand();
    await expect(handler.execute(command)).resolves.toBeUndefined();
  });
}); 