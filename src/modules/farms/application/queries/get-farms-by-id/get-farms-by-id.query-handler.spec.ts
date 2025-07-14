import { GetFarmsByIdQuery } from './get-farms-by-id.query';
import { GetFarmsByIdQueryHandler } from './get-farms-by-id.query-handler';

describe('GetFarmsByIdQueryHandler', () => {
  it('should be defined', () => {
    const handler = new GetFarmsByIdQueryHandler();
    expect(handler).toBeDefined();
  });

  it('should execute and return null by default', async () => {
    const handler = new GetFarmsByIdQueryHandler();
    const query = new GetFarmsByIdQuery('test-id');
    await expect(handler.execute(query)).resolves.toBeNull();
  });
}); 