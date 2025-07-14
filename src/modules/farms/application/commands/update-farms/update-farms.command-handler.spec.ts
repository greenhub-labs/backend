import { UpdateFarmsCommand } from './update-farms.command';
import { UpdateFarmsCommandHandler } from './update-farms.command-handler';

describe('UpdateFarmsCommandHandler', () => {
  it('should be defined', () => {
    const handler = new UpdateFarmsCommandHandler();
    expect(handler).toBeDefined();
  });

  it('should execute without errors', async () => {
    const handler = new UpdateFarmsCommandHandler();
    const command = new UpdateFarmsCommand();
    await expect(handler.execute(command)).resolves.toBeUndefined();
  });
}); 