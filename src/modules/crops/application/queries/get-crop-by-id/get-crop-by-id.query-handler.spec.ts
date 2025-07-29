import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { GetCropVarietyByIdQuery } from 'src/modules/crops-variety/application/queries/get-crop-variety-by-id/get-crop-variety-by-id.query';
import { CropVarietyEntity } from 'src/modules/crops-variety/domain/entities/crop-variety.entity';
import { CropEntity } from 'src/modules/crops/domain/entities/crop.entity';
import { CropNotFoundException } from '../../../domain/exceptions/crop-not-found/crop-not-found.exception';
import { CropDetailsResult } from '../../dtos/crop-details.result';
import {
  CROPS_CACHE_REPOSITORY_TOKEN,
  CropsCacheRepository,
} from '../../ports/crops-cache.repository';
import {
  CROPS_REPOSITORY_TOKEN,
  CropsRepository,
} from '../../ports/crops.repository';
import { GetCropByIdQuery } from './get-crop-by-id.query';
import { GetCropByIdQueryHandler } from './get-crop-by-id.query-handler';

describe('GetCropByIdQueryHandler', () => {
  let handler: GetCropByIdQueryHandler;
  let cropsRepository: jest.Mocked<CropsRepository>;
  let cropsCacheRepository: jest.Mocked<CropsCacheRepository>;
  let queryBus: jest.Mocked<QueryBus>;

  const mockCropEntity = {
    id: { value: 'crop-123' },
    plotId: 'plot-123',
    varietyId: 'variety-456',
    plantingDate: { value: new Date('2024-01-15') },
    expectedHarvest: { value: new Date('2024-06-15') },
    actualHarvest: { value: new Date('2024-06-10') },
    quantity: 100,
    status: { value: 'PLANTED' },
    plantingMethod: { value: 'DIRECT_SEED' },
    notes: 'Test crop',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  } as unknown as CropEntity;

  const mockCropVariety = {
    id: { value: 'variety-456' },
    name: 'Test Variety',
    scientificName: 'Test Scientific Name',
    type: { value: 'VEGETABLE' },
    description: 'Test variety description',
    averageYield: 10.5,
    daysToMaturity: 90,
    plantingDepth: 2.5,
    spacingBetween: 30,
    waterRequirements: 'Moderate',
    sunRequirements: 'Full sun',
    minIdealTemperature: 15,
    maxIdealTemperature: 25,
    minIdealPh: 6.0,
    maxIdealPh: 7.0,
    compatibleWith: ['tomato', 'basil'],
    incompatibleWith: ['potato'],
    plantingSeasons: [{ value: 'SPRING' }, { value: 'SUMMER' }],
    harvestSeasons: [{ value: 'SUMMER' }, { value: 'FALL' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
    toPrimitives: jest.fn().mockReturnValue({
      id: 'variety-456',
      name: 'Test Variety',
      scientificName: 'Test Scientific Name',
      type: 'VEGETABLE',
      description: 'Test variety description',
      averageYield: 10.5,
      daysToMaturity: 90,
      plantingDepth: 2.5,
      spacingBetween: 30,
      waterRequirements: 'Moderate',
      sunRequirements: 'Full sun',
      minIdealTemperature: 15,
      maxIdealTemperature: 25,
      minIdealPh: 6.0,
      maxIdealPh: 7.0,
      compatibleWith: ['tomato', 'basil'],
      incompatibleWith: ['potato'],
      plantingSeasons: ['SPRING', 'SUMMER'],
      harvestSeasons: ['SUMMER', 'FALL'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: undefined,
    }),
  } as unknown as CropVarietyEntity;

  const mockQuery = new GetCropByIdQuery('crop-123');

  beforeEach(async () => {
    const mockCropsRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findAllByPlotId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockCropsCacheRepository = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    };

    const mockQueryBus = {
      execute: jest.fn().mockResolvedValue(mockCropVariety),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCropByIdQueryHandler,
        {
          provide: CROPS_REPOSITORY_TOKEN,
          useValue: mockCropsRepository,
        },
        {
          provide: CROPS_CACHE_REPOSITORY_TOKEN,
          useValue: mockCropsCacheRepository,
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
      ],
    }).compile();

    handler = module.get<GetCropByIdQueryHandler>(GetCropByIdQueryHandler);
    cropsRepository = module.get(CROPS_REPOSITORY_TOKEN);
    cropsCacheRepository = module.get(CROPS_CACHE_REPOSITORY_TOKEN);
    queryBus = module.get(QueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return crop details when found in cache', async () => {
      // Arrange
      cropsCacheRepository.get.mockResolvedValue(mockCropEntity);
      const expectedResult = new CropDetailsResult(
        mockCropEntity,
        mockCropVariety,
      );

      // Act
      const result = await handler.execute(mockQuery);

      // Assert
      expect(cropsCacheRepository.get).toHaveBeenCalledWith(mockQuery.cropId);
      expect(cropsRepository.findById).not.toHaveBeenCalled();
      expect(cropsCacheRepository.set).not.toHaveBeenCalled();
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetCropVarietyByIdQuery(mockCropEntity.varietyId),
      );
      expect(result).toEqual(expectedResult);
    });

    it('should fetch from repository and cache when not found in cache', async () => {
      // Arrange
      cropsCacheRepository.get.mockResolvedValue(null);
      cropsRepository.findById.mockResolvedValue(mockCropEntity);
      const expectedResult = new CropDetailsResult(
        mockCropEntity,
        mockCropVariety,
      );

      // Act
      const result = await handler.execute(mockQuery);

      // Assert
      expect(cropsCacheRepository.get).toHaveBeenCalledWith(mockQuery.cropId);
      expect(cropsRepository.findById).toHaveBeenCalledWith(mockQuery.cropId);
      expect(cropsCacheRepository.set).toHaveBeenCalledWith(
        mockQuery.cropId,
        mockCropEntity,
      );
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetCropVarietyByIdQuery(mockCropEntity.varietyId),
      );
      expect(result).toEqual(expectedResult);
    });

    it('should throw CropNotFoundException when crop not found', async () => {
      // Arrange
      cropsCacheRepository.get.mockResolvedValue(null);
      cropsRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(handler.execute(mockQuery)).rejects.toThrow(
        CropNotFoundException,
      );
      expect(cropsCacheRepository.get).toHaveBeenCalledWith(mockQuery.cropId);
      expect(cropsRepository.findById).toHaveBeenCalledWith(mockQuery.cropId);
      expect(cropsCacheRepository.set).not.toHaveBeenCalled();
      expect(queryBus.execute).not.toHaveBeenCalled();
    });

    it('should handle cache get errors gracefully', async () => {
      // Arrange
      const error = new Error('Cache error');
      cropsCacheRepository.get.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(mockQuery)).rejects.toThrow(error);
      expect(cropsCacheRepository.get).toHaveBeenCalledWith(mockQuery.cropId);
      expect(cropsRepository.findById).not.toHaveBeenCalled();
    });

    it('should handle repository findById errors gracefully', async () => {
      // Arrange
      cropsCacheRepository.get.mockResolvedValue(null);
      const error = new Error('Database error');
      cropsRepository.findById.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(mockQuery)).rejects.toThrow(error);
      expect(cropsCacheRepository.get).toHaveBeenCalledWith(mockQuery.cropId);
      expect(cropsRepository.findById).toHaveBeenCalledWith(mockQuery.cropId);
    });

    it('should handle cache set errors gracefully', async () => {
      // Arrange
      cropsCacheRepository.get.mockResolvedValue(null);
      cropsRepository.findById.mockResolvedValue(mockCropEntity);
      const error = new Error('Cache set error');
      cropsCacheRepository.set.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(mockQuery)).rejects.toThrow(error);
      expect(cropsCacheRepository.get).toHaveBeenCalledWith(mockQuery.cropId);
      expect(cropsRepository.findById).toHaveBeenCalledWith(mockQuery.cropId);
      expect(cropsCacheRepository.set).toHaveBeenCalledWith(
        mockQuery.cropId,
        mockCropEntity,
      );
    });

    it('should handle query bus errors gracefully', async () => {
      // Arrange
      cropsCacheRepository.get.mockResolvedValue(mockCropEntity);
      const error = new Error('Query bus error');
      queryBus.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(mockQuery)).rejects.toThrow(error);
      expect(cropsCacheRepository.get).toHaveBeenCalledWith(mockQuery.cropId);
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetCropVarietyByIdQuery(mockCropEntity.varietyId),
      );
    });
  });
});
