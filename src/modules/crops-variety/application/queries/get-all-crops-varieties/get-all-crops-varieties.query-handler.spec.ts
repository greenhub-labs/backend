import { CropVarietyEntity } from 'src/modules/crops-variety/domain/entities/crop-variety.entity';
import { CropVarietyRepository } from '../../ports/crop-variety.repository';
import { GetAllCropsVarietiesQuery } from './get-all-crops-varieties.query';
import { GetAllCropsVarietiesQueryHandler } from './get-all-crops-varieties.query-handler';

describe('GetAllCropsQueryHandler', () => {
  let handler: GetAllCropsVarietiesQueryHandler;
  let cropVarietyRepository: jest.Mocked<CropVarietyRepository>;
  beforeEach(() => {
    cropVarietyRepository = {
      findAll: jest.fn(),
    } as any;
    handler = new GetAllCropsVarietiesQueryHandler(cropVarietyRepository);
  });

  it('should return an array of crops', async () => {
    const cropVariety = {
      id: { value: 'crop-variety-123' },
    } as any as CropVarietyEntity;
    cropVarietyRepository.findAll.mockResolvedValue([cropVariety]);
    const result = await handler.execute(new GetAllCropsVarietiesQuery());
    expect(result).toEqual([cropVariety]);
    expect(cropVarietyRepository.findAll).toHaveBeenCalled();
  });

  it('should return an empty array if no crops exist', async () => {
    cropVarietyRepository.findAll.mockResolvedValue([]);
    const result = await handler.execute(new GetAllCropsVarietiesQuery());
    expect(result).toEqual([]);
    expect(cropVarietyRepository.findAll).toHaveBeenCalled();
  });
});
