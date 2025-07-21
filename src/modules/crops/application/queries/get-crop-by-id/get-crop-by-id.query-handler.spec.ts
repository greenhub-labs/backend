import { CropEntity } from '../../../domain/entities/crop.entity';
import { CropNotFoundException } from '../../../domain/exceptions/crop-not-found/crop-not-found.exception';
import { CropsCacheRepository } from '../../ports/crops-cache.repository';
import { CropsRepository } from '../../ports/crops.repository';
import { GetCropByIdQuery } from './get-crop-by-id.query';
import { GetCropByIdQueryHandler } from './get-crop-by-id.query-handler';

describe('GetCropByIdQueryHandler', () => {
  let handler: GetCropByIdQueryHandler;
  let cropsRepository: jest.Mocked<CropsRepository>;
  let cropsCacheRepository: jest.Mocked<CropsCacheRepository>;
  beforeEach(() => {
    cropsRepository = {
      findById: jest.fn(),
    } as any;
    cropsCacheRepository = {
      get: jest.fn(),
      set: jest.fn(),
    } as any;
    handler = new GetCropByIdQueryHandler(
      cropsRepository,
      cropsCacheRepository,
    );
  });

  it('should return a crop if found in cache', async () => {
    const cropId = 'crop-123';
    const crop = { id: { value: cropId } } as any as CropEntity;
    cropsCacheRepository.get.mockResolvedValue(crop);
    const result = await handler.execute(new GetCropByIdQuery(cropId));
    expect(result.crop).toBe(crop);
    expect(cropsCacheRepository.get).toHaveBeenCalledWith(cropId);
    expect(cropsRepository.findById).not.toHaveBeenCalled();
  });

  it('should return a crop if found in repository and set cache', async () => {
    const cropId = 'crop-123';
    const crop = { id: { value: cropId } } as any as CropEntity;
    cropsCacheRepository.get.mockResolvedValue(null);
    cropsRepository.findById.mockResolvedValue(crop);
    const result = await handler.execute(new GetCropByIdQuery(cropId));
    expect(result.crop).toBe(crop);
    expect(cropsRepository.findById).toHaveBeenCalledWith(cropId);
    expect(cropsCacheRepository.set).toHaveBeenCalledWith(cropId, crop);
  });

  it('should throw CropNotFoundException if not found', async () => {
    cropsCacheRepository.get.mockResolvedValue(null);
    cropsRepository.findById.mockResolvedValue(null);
    await expect(
      handler.execute(new GetCropByIdQuery('not-found')),
    ).rejects.toBeInstanceOf(CropNotFoundException);
  });
});
