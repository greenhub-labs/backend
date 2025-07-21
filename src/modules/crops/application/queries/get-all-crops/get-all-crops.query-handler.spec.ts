import { CropEntity } from '../../../domain/entities/crop.entity';
import { CropsRepository } from '../../ports/crops.repository';
import { GetAllCropsQuery } from './get-all-crops.query';
import { GetAllCropsQueryHandler } from './get-all-crops.query-handler';

describe('GetAllCropsQueryHandler', () => {
  let handler: GetAllCropsQueryHandler;
  let cropsRepository: jest.Mocked<CropsRepository>;
  beforeEach(() => {
    cropsRepository = {
      findAll: jest.fn(),
    } as any;
    handler = new GetAllCropsQueryHandler(cropsRepository);
  });

  it('should return an array of crops', async () => {
    const crop = { id: { value: 'crop-123' } } as any as CropEntity;
    cropsRepository.findAll.mockResolvedValue([crop]);
    const result = await handler.execute(new GetAllCropsQuery());
    expect(result).toEqual([{ crop }]);
    expect(cropsRepository.findAll).toHaveBeenCalled();
  });

  it('should return an empty array if no crops exist', async () => {
    cropsRepository.findAll.mockResolvedValue([]);
    const result = await handler.execute(new GetAllCropsQuery());
    expect(result).toEqual([]);
    expect(cropsRepository.findAll).toHaveBeenCalled();
  });
});
