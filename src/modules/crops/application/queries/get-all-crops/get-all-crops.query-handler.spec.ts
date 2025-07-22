import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CropVarietyEntity } from '../../../domain/entities/crop-variety.entity';
import { CropEntity } from '../../../domain/entities/crop.entity';
import { CropDetailsResult } from '../../dtos/crop-details.result';
import {
  CROPS_REPOSITORY_TOKEN,
  CropsRepository,
} from '../../ports/crops.repository';
import { GetCropVarietyByIdQuery } from '../get-crop-variety-by-id/get-crop-variety-by-id.query';
import { GetAllCropsQuery } from './get-all-crops.query';
import { GetAllCropsQueryHandler } from './get-all-crops.query-handler';

describe('GetAllCropsQueryHandler', () => {
  let handler: GetAllCropsQueryHandler;
  let cropsRepository: jest.Mocked<CropsRepository>;
  let queryBus: jest.Mocked<QueryBus>;

  const mockCropEntity1 = {
    id: { value: 'crop-123' },
    plotId: 'plot-123',
    varietyId: 'variety-456',
    plantingDate: { value: new Date('2024-01-15') },
    expectedHarvest: { value: new Date('2024-06-15') },
    actualHarvest: { value: new Date('2024-06-10') },
    quantity: 100,
    status: { value: 'PLANTED' },
    plantingMethod: { value: 'DIRECT_SEED' },
    notes: 'Test crop 1',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  } as unknown as CropEntity;

  const mockCropEntity2 = {
    id: { value: 'crop-456' },
    plotId: 'plot-456',
    varietyId: 'variety-789',
    plantingDate: { value: new Date('2024-02-15') },
    expectedHarvest: { value: new Date('2024-07-15') },
    actualHarvest: { value: new Date('2024-07-10') },
    quantity: 200,
    status: { value: 'FINISHED' },
    plantingMethod: { value: 'TRANSPLANT' },
    notes: 'Test crop 2',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  } as unknown as CropEntity;

  const mockCropVariety1 = {
    id: { value: 'variety-456' },
    name: 'Test Variety 1',
    scientificName: 'Test Scientific Name 1',
    type: { value: 'VEGETABLE' },
    description: 'Test variety description 1',
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
      name: 'Test Variety 1',
      scientificName: 'Test Scientific Name 1',
      type: 'VEGETABLE',
      description: 'Test variety description 1',
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

  const mockCropVariety2 = {
    id: { value: 'variety-789' },
    name: 'Test Variety 2',
    scientificName: 'Test Scientific Name 2',
    type: { value: 'FRUIT' },
    description: 'Test variety description 2',
    averageYield: 15.0,
    daysToMaturity: 120,
    plantingDepth: 3.0,
    spacingBetween: 45,
    waterRequirements: 'High',
    sunRequirements: 'Partial sun',
    minIdealTemperature: 20,
    maxIdealTemperature: 30,
    minIdealPh: 5.5,
    maxIdealPh: 6.5,
    compatibleWith: ['apple', 'pear'],
    incompatibleWith: ['cherry'],
    plantingSeasons: [{ value: 'FALL' }, { value: 'WINTER' }],
    harvestSeasons: [{ value: 'SPRING' }, { value: 'SUMMER' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
    toPrimitives: jest.fn().mockReturnValue({
      id: 'variety-789',
      name: 'Test Variety 2',
      scientificName: 'Test Scientific Name 2',
      type: 'FRUIT',
      description: 'Test variety description 2',
      averageYield: 15.0,
      daysToMaturity: 120,
      plantingDepth: 3.0,
      spacingBetween: 45,
      waterRequirements: 'High',
      sunRequirements: 'Partial sun',
      minIdealTemperature: 20,
      maxIdealTemperature: 30,
      minIdealPh: 5.5,
      maxIdealPh: 6.5,
      compatibleWith: ['apple', 'pear'],
      incompatibleWith: ['cherry'],
      plantingSeasons: ['FALL', 'WINTER'],
      harvestSeasons: ['SPRING', 'SUMMER'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: undefined,
    }),
  } as unknown as CropVarietyEntity;

  const mockQuery = new GetAllCropsQuery();

  beforeEach(async () => {
    const mockCropsRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findAllByPlotId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockQueryBus = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllCropsQueryHandler,
        {
          provide: CROPS_REPOSITORY_TOKEN,
          useValue: mockCropsRepository,
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
      ],
    }).compile();

    handler = module.get<GetAllCropsQueryHandler>(GetAllCropsQueryHandler);
    cropsRepository = module.get(CROPS_REPOSITORY_TOKEN);
    queryBus = module.get(QueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return all crops with their varieties', async () => {
      // Arrange
      const mockCrops = [mockCropEntity1, mockCropEntity2];
      cropsRepository.findAll.mockResolvedValue(mockCrops);
      queryBus.execute
        .mockResolvedValueOnce(mockCropVariety1)
        .mockResolvedValueOnce(mockCropVariety2);

      const expectedResult = [
        new CropDetailsResult(mockCropEntity1, mockCropVariety1),
        new CropDetailsResult(mockCropEntity2, mockCropVariety2),
      ];

      // Act
      const result = await handler.execute(mockQuery);

      // Assert
      expect(cropsRepository.findAll).toHaveBeenCalled();
      expect(queryBus.execute).toHaveBeenCalledTimes(2);
      expect(queryBus.execute).toHaveBeenNthCalledWith(
        1,
        new GetCropVarietyByIdQuery(mockCropEntity1.varietyId),
      );
      expect(queryBus.execute).toHaveBeenNthCalledWith(
        2,
        new GetCropVarietyByIdQuery(mockCropEntity2.varietyId),
      );
      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when no crops exist', async () => {
      // Arrange
      cropsRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await handler.execute(mockQuery);

      // Assert
      expect(cropsRepository.findAll).toHaveBeenCalled();
      expect(queryBus.execute).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle repository findAll errors', async () => {
      // Arrange
      const error = new Error('Database error');
      cropsRepository.findAll.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(mockQuery)).rejects.toThrow(error);
      expect(cropsRepository.findAll).toHaveBeenCalled();
      expect(queryBus.execute).not.toHaveBeenCalled();
    });

    it('should handle query bus errors for first crop variety', async () => {
      // Arrange
      const mockCrops = [mockCropEntity1, mockCropEntity2];
      cropsRepository.findAll.mockResolvedValue(mockCrops);
      const error = new Error('Query bus error');
      queryBus.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(mockQuery)).rejects.toThrow(error);
      expect(cropsRepository.findAll).toHaveBeenCalled();
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetCropVarietyByIdQuery(mockCropEntity1.varietyId),
      );
    });

    it('should handle query bus errors for second crop variety', async () => {
      // Arrange
      const mockCrops = [mockCropEntity1, mockCropEntity2];
      cropsRepository.findAll.mockResolvedValue(mockCrops);
      queryBus.execute
        .mockResolvedValueOnce(mockCropVariety1)
        .mockRejectedValueOnce(new Error('Query bus error'));

      // Act & Assert
      await expect(handler.execute(mockQuery)).rejects.toThrow(
        'Query bus error',
      );
      expect(cropsRepository.findAll).toHaveBeenCalled();
      expect(queryBus.execute).toHaveBeenCalledTimes(2);
      expect(queryBus.execute).toHaveBeenNthCalledWith(
        1,
        new GetCropVarietyByIdQuery(mockCropEntity1.varietyId),
      );
      expect(queryBus.execute).toHaveBeenNthCalledWith(
        2,
        new GetCropVarietyByIdQuery(mockCropEntity2.varietyId),
      );
    });

    it('should handle single crop successfully', async () => {
      // Arrange
      const mockCrops = [mockCropEntity1];
      cropsRepository.findAll.mockResolvedValue(mockCrops);
      queryBus.execute.mockResolvedValue(mockCropVariety1);

      const expectedResult = [
        new CropDetailsResult(mockCropEntity1, mockCropVariety1),
      ];

      // Act
      const result = await handler.execute(mockQuery);

      // Assert
      expect(cropsRepository.findAll).toHaveBeenCalled();
      expect(queryBus.execute).toHaveBeenCalledTimes(1);
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetCropVarietyByIdQuery(mockCropEntity1.varietyId),
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
