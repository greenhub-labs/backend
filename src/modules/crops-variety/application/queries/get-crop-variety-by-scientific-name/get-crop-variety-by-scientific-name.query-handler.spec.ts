import { Test, TestingModule } from '@nestjs/testing';
import { CropVarietyEntity } from 'src/modules/crops/domain/entities/crop-variety.entity';
import {
  CROP_VARIETY_CACHE_REPOSITORY_TOKEN,
  CropVarietyCacheRepository,
} from '../../ports/crop-variety-cache.repository';
import {
  CROP_VARIETY_REPOSITORY_TOKEN,
  CropVarietyRepository,
} from '../../ports/crop-variety.repository';
import { GetCropVarietyByScientificNameQuery } from './get-crop-variety-by-scientific-name.query';
import { GetCropVarietyByScientificNameQueryHandler } from './get-crop-variety-by-scientific-name.query-handler';

const mockRepository = () => ({
  findByScientificName: jest.fn(),
});

const mockCacheRepository = () => ({
  get: jest.fn(),
  set: jest.fn(),
});

describe('GetCropVarietyByScientificNameQueryHandler', () => {
  let handler: GetCropVarietyByScientificNameQueryHandler;
  let repository: CropVarietyRepository;
  let cacheRepository: CropVarietyCacheRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCropVarietyByScientificNameQueryHandler,
        { provide: CROP_VARIETY_REPOSITORY_TOKEN, useFactory: mockRepository },
        {
          provide: CROP_VARIETY_CACHE_REPOSITORY_TOKEN,
          useFactory: mockCacheRepository,
        },
      ],
    }).compile();

    handler = module.get(GetCropVarietyByScientificNameQueryHandler);
    repository = module.get(CROP_VARIETY_REPOSITORY_TOKEN);
    cacheRepository = module.get(CROP_VARIETY_CACHE_REPOSITORY_TOKEN);
  });

  it('should return a crop variety entity if found', async () => {
    const entity = {} as CropVarietyEntity;
    (cacheRepository.get as jest.Mock).mockResolvedValue(null);
    (repository.findByScientificName as jest.Mock).mockResolvedValue(entity);
    (cacheRepository.set as jest.Mock).mockResolvedValue(undefined);

    const result = await handler.execute(
      new GetCropVarietyByScientificNameQuery('Solanum lycopersicum'),
    );

    expect(result).toBe(entity);
    expect(cacheRepository.get).toHaveBeenCalledWith('Solanum lycopersicum');
    expect(repository.findByScientificName).toHaveBeenCalledWith(
      'Solanum lycopersicum',
    );
    expect(cacheRepository.set).toHaveBeenCalledWith(
      'Solanum lycopersicum',
      entity,
    );
  });

  it('should return cached crop variety if found in cache', async () => {
    const entity = {} as CropVarietyEntity;
    (cacheRepository.get as jest.Mock).mockResolvedValue(entity);

    const result = await handler.execute(
      new GetCropVarietyByScientificNameQuery('Solanum lycopersicum'),
    );

    expect(result).toBe(entity);
    expect(cacheRepository.get).toHaveBeenCalledWith('Solanum lycopersicum');
    expect(repository.findByScientificName).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException if not found', async () => {
    (cacheRepository.get as jest.Mock).mockResolvedValue(null);
    (repository.findByScientificName as jest.Mock).mockResolvedValue(null);
    (cacheRepository.set as jest.Mock).mockResolvedValue(undefined);

    await expect(
      handler.execute(new GetCropVarietyByScientificNameQuery('Unknown')),
    ).rejects.toThrow('Crop variety not found');

    expect(cacheRepository.get).toHaveBeenCalledWith('Unknown');
    expect(repository.findByScientificName).toHaveBeenCalledWith('Unknown');
    expect(cacheRepository.set).toHaveBeenCalledWith('Unknown', null);
  });
});
