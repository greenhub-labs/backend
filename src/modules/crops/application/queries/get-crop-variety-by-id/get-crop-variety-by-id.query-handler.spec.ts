import { CropVarietyEntity } from 'src/modules/crops/domain/entities/crop-variety.entity';
import { CropNotFoundException } from '../../../domain/exceptions/crop-not-found/crop-not-found.exception';
import { CropVarietyCacheRepository } from '../../ports/crop-variety-cache.repository';
import { CropVarietyRepository } from '../../ports/crop-variety.repository';
import { GetCropVarietyByIdQuery } from './get-crop-variety-by-id.query';
import { GetCropVarietyByIdQueryHandler } from './get-crop-variety-by-id.query-handler';

describe('GetCropVarietyByIdQueryHandler', () => {
  let handler: GetCropVarietyByIdQueryHandler;
  let cropVarietyRepository: jest.Mocked<CropVarietyRepository>;
  let cropVarietyCacheRepository: jest.Mocked<CropVarietyCacheRepository>;
  beforeEach(() => {
    cropVarietyRepository = {
      findById: jest.fn(),
    } as any;
    cropVarietyCacheRepository = {
      get: jest.fn(),
      set: jest.fn(),
    } as any;
    handler = new GetCropVarietyByIdQueryHandler(
      cropVarietyRepository,
      cropVarietyCacheRepository,
    );
  });

  it('should return a crop if found in cache', async () => {
    const cropVarietyId = 'crop-variety-123';
    const cropVariety = {
      id: { value: cropVarietyId },
    } as any as CropVarietyEntity;
    cropVarietyCacheRepository.get.mockResolvedValue(cropVariety);
    const result = await handler.execute(
      new GetCropVarietyByIdQuery(cropVarietyId),
    );
    expect(result).toBe(cropVariety);
    expect(cropVarietyCacheRepository.get).toHaveBeenCalledWith(cropVarietyId);
    expect(cropVarietyRepository.findById).not.toHaveBeenCalled();
  });

  it('should return a crop if found in repository and set cache', async () => {
    const cropVarietyId = 'crop-variety-123';
    const cropVariety = {
      id: { value: cropVarietyId },
    } as any as CropVarietyEntity;
    cropVarietyCacheRepository.get.mockResolvedValue(null);
    cropVarietyRepository.findById.mockResolvedValue(cropVariety);
    const result = await handler.execute(
      new GetCropVarietyByIdQuery(cropVarietyId),
    );
    expect(result).toBe(cropVariety);
    expect(cropVarietyRepository.findById).toHaveBeenCalledWith(cropVarietyId);
    expect(cropVarietyCacheRepository.set).toHaveBeenCalledWith(
      cropVarietyId,
      cropVariety,
    );
  });

  it('should throw CropNotFoundException if not found', async () => {
    cropVarietyCacheRepository.get.mockResolvedValue(null);
    cropVarietyRepository.findById.mockResolvedValue(null);
    await expect(
      handler.execute(new GetCropVarietyByIdQuery('not-found')),
    ).rejects.toBeInstanceOf(CropNotFoundException);
  });
});
