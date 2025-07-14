import { DeleteFarmsCommand } from './delete-farms.command';
import { DeleteFarmsCommandHandler } from './delete-farms.command-handler';

describe('DeleteFarmsCommandHandler', () => {
  it('should be defined', () => {
    const handler = new DeleteFarmsCommandHandler();
    expect(handler).toBeDefined();
  });

  it('should execute without errors', async () => {
    const handler = new DeleteFarmsCommandHandler();
    const command = new DeleteFarmsCommand();
    await expect(handler.execute(command)).resolves.toBeUndefined();
  });
}); 