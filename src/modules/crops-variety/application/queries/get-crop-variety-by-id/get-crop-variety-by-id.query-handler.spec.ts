import { Test, TestingModule } from '@nestjs/testing';
import { CropVarietyEntity } from '../../../domain/entities/crop-variety.entity';
import { CropNotFoundException } from '../../../domain/exceptions/crop-not-found/crop-not-found.exception';
import {
  CROP_VARIETY_CACHE_REPOSITORY_TOKEN,
  CropVarietyCacheRepository,
} from '../../ports/crop-variety-cache.repository';
import {
  CROP_VARIETY_REPOSITORY_TOKEN,
  CropVarietyRepository,
} from '../../ports/crop-variety.repository';
import { GetCropVarietyByIdQuery } from './get-crop-variety-by-id.query';
import { GetCropVarietyByIdQueryHandler } from './get-crop-variety-by-id.query-handler';

describe('GetCropVarietyByIdQueryHandler', () => {
  let handler: GetCropVarietyByIdQueryHandler;
  let cropVarietyRepository: jest.Mocked<CropVarietyRepository>;
  let cropVarietyCacheRepository: jest.Mocked<CropVarietyCacheRepository>;

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

  const mockQuery = new GetCropVarietyByIdQuery('variety-456');

  beforeEach(async () => {
    const mockCropVarietyRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockCropVarietyCacheRepository = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCropVarietyByIdQueryHandler,
        {
          provide: CROP_VARIETY_REPOSITORY_TOKEN,
          useValue: mockCropVarietyRepository,
        },
        {
          provide: CROP_VARIETY_CACHE_REPOSITORY_TOKEN,
          useValue: mockCropVarietyCacheRepository,
        },
      ],
    }).compile();

    handler = module.get<GetCropVarietyByIdQueryHandler>(
      GetCropVarietyByIdQueryHandler,
    );
    cropVarietyRepository = module.get(CROP_VARIETY_REPOSITORY_TOKEN);
    cropVarietyCacheRepository = module.get(
      CROP_VARIETY_CACHE_REPOSITORY_TOKEN,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return crop variety when found in cache', async () => {
      // Arrange
      cropVarietyCacheRepository.get.mockResolvedValue(mockCropVariety);

      // Act
      const result = await handler.execute(mockQuery);

      // Assert
      expect(cropVarietyCacheRepository.get).toHaveBeenCalledWith(
        mockQuery.cropVarietyId,
      );
      expect(cropVarietyRepository.findById).not.toHaveBeenCalled();
      expect(cropVarietyCacheRepository.set).not.toHaveBeenCalled();
      expect(result).toEqual(mockCropVariety);
    });

    it('should fetch from repository and cache when not found in cache', async () => {
      // Arrange
      cropVarietyCacheRepository.get.mockResolvedValue(null);
      cropVarietyRepository.findById.mockResolvedValue(mockCropVariety);

      // Act
      const result = await handler.execute(mockQuery);

      // Assert
      expect(cropVarietyCacheRepository.get).toHaveBeenCalledWith(
        mockQuery.cropVarietyId,
      );
      expect(cropVarietyRepository.findById).toHaveBeenCalledWith(
        mockQuery.cropVarietyId,
      );
      expect(cropVarietyCacheRepository.set).toHaveBeenCalledWith(
        mockQuery.cropVarietyId,
        mockCropVariety,
      );
      expect(result).toEqual(mockCropVariety);
    });

    it('should throw CropNotFoundException when crop variety not found', async () => {
      // Arrange
      cropVarietyCacheRepository.get.mockResolvedValue(null);
      cropVarietyRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(handler.execute(mockQuery)).rejects.toThrow(
        CropNotFoundException,
      );
      expect(cropVarietyCacheRepository.get).toHaveBeenCalledWith(
        mockQuery.cropVarietyId,
      );
      expect(cropVarietyRepository.findById).toHaveBeenCalledWith(
        mockQuery.cropVarietyId,
      );
      expect(cropVarietyCacheRepository.set).not.toHaveBeenCalled();
    });

    it('should handle cache get errors gracefully', async () => {
      // Arrange
      const error = new Error('Cache error');
      cropVarietyCacheRepository.get.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(mockQuery)).rejects.toThrow(error);
      expect(cropVarietyCacheRepository.get).toHaveBeenCalledWith(
        mockQuery.cropVarietyId,
      );
      expect(cropVarietyRepository.findById).not.toHaveBeenCalled();
    });

    it('should handle repository findById errors gracefully', async () => {
      // Arrange
      cropVarietyCacheRepository.get.mockResolvedValue(null);
      const error = new Error('Database error');
      cropVarietyRepository.findById.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(mockQuery)).rejects.toThrow(error);
      expect(cropVarietyCacheRepository.get).toHaveBeenCalledWith(
        mockQuery.cropVarietyId,
      );
      expect(cropVarietyRepository.findById).toHaveBeenCalledWith(
        mockQuery.cropVarietyId,
      );
    });

    it('should handle cache set errors gracefully', async () => {
      // Arrange
      cropVarietyCacheRepository.get.mockResolvedValue(null);
      cropVarietyRepository.findById.mockResolvedValue(mockCropVariety);
      const error = new Error('Cache set error');
      cropVarietyCacheRepository.set.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(mockQuery)).rejects.toThrow(error);
      expect(cropVarietyCacheRepository.get).toHaveBeenCalledWith(
        mockQuery.cropVarietyId,
      );
      expect(cropVarietyRepository.findById).toHaveBeenCalledWith(
        mockQuery.cropVarietyId,
      );
      expect(cropVarietyCacheRepository.set).toHaveBeenCalledWith(
        mockQuery.cropVarietyId,
        mockCropVariety,
      );
    });

    it('should handle different crop variety IDs', async () => {
      // Arrange
      const differentQuery = new GetCropVarietyByIdQuery('variety-789');
      const differentCropVariety = {
        ...mockCropVariety,
        id: { value: 'variety-789' },
        name: 'Different Variety',
      } as unknown as CropVarietyEntity;

      cropVarietyCacheRepository.get.mockResolvedValue(differentCropVariety);

      // Act
      const result = await handler.execute(differentQuery);

      // Assert
      expect(cropVarietyCacheRepository.get).toHaveBeenCalledWith(
        'variety-789',
      );
      expect(result).toEqual(differentCropVariety);
    });
  });
});
