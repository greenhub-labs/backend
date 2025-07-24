import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { GetCropVarietyByIdQuery } from 'src/modules/crops-variety/application/queries/get-crop-variety-by-id/get-crop-variety-by-id.query';
import { CropVarietyEntity } from 'src/modules/crops-variety/domain/entities/crop-variety.entity';
import { CropEntity } from 'src/modules/crops/domain/entities/crop.entity';
import { CropNotFoundException } from 'src/modules/crops/domain/exceptions/crop-not-found/crop-not-found.exception';
import { CropDetailsResult } from '../../dtos/crop-details.result';
import {
  CROPS_CACHE_REPOSITORY_TOKEN,
  CropsCacheRepository,
} from '../../ports/crops-cache.repository';
import {
  CROPS_REPOSITORY_TOKEN,
  CropsRepository,
} from '../../ports/crops.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { UpdateCropCommand } from './update-crop.command';
import { UpdateCropCommandHandler } from './update-crop.command-handler';

describe('UpdateCropCommandHandler', () => {
  let handler: UpdateCropCommandHandler;
  let cropsRepository: jest.Mocked<CropsRepository>;
  let cropsCacheRepository: jest.Mocked<CropsCacheRepository>;
  let nestjsEventBus: jest.Mocked<NestjsEventBusService>;
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
    update: jest.fn(),
    pullDomainEvents: jest.fn().mockReturnValue([]),
  } as unknown as CropEntity;

  const mockUpdatedCropEntity = {
    id: { value: 'crop-123' },
    plotId: 'plot-123',
    varietyId: 'variety-456',
    plantingDate: { value: new Date('2024-02-15') },
    expectedHarvest: { value: new Date('2024-07-15') },
    actualHarvest: { value: new Date('2024-07-10') },
    quantity: 150,
    status: { value: 'FINISHED' },
    plantingMethod: { value: 'TRANSPLANT' },
    notes: 'Updated test crop',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    pullDomainEvents: jest.fn().mockReturnValue([]),
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

  const mockCommand = new UpdateCropCommand({
    id: 'crop-123',
    plantingDate: new Date('2024-02-15'),
    expectedHarvest: new Date('2024-07-15'),
    actualHarvest: new Date('2024-07-10'),
    quantity: 150,
    status: 'FINISHED',
    plantingMethod: 'TRANSPLANT',
    notes: 'Updated test crop',
  });

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

    const mockNestjsEventBus = {
      publish: jest.fn(),
    };

    const mockQueryBus = {
      execute: jest.fn().mockResolvedValue(mockCropVariety),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCropCommandHandler,
        {
          provide: CROPS_REPOSITORY_TOKEN,
          useValue: mockCropsRepository,
        },
        {
          provide: CROPS_CACHE_REPOSITORY_TOKEN,
          useValue: mockCropsCacheRepository,
        },
        {
          provide: NestjsEventBusService,
          useValue: mockNestjsEventBus,
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
      ],
    }).compile();

    handler = module.get<UpdateCropCommandHandler>(UpdateCropCommandHandler);
    cropsRepository = module.get(CROPS_REPOSITORY_TOKEN);
    cropsCacheRepository = module.get(CROPS_CACHE_REPOSITORY_TOKEN);
    nestjsEventBus = module.get(NestjsEventBusService);
    queryBus = module.get(QueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update a crop successfully', async () => {
      // Arrange
      cropsRepository.findById.mockResolvedValue(mockCropEntity);
      (mockCropEntity.update as jest.Mock).mockReturnValue(
        mockUpdatedCropEntity,
      );
      const expectedResult = new CropDetailsResult(
        mockUpdatedCropEntity,
        mockCropVariety,
      );

      // Act
      const result = await handler.execute(mockCommand);

      // Assert
      expect(cropsRepository.findById).toHaveBeenCalledWith(mockCommand.id);
      expect(mockCropEntity.update).toHaveBeenCalledWith({
        plantingDate: mockCommand.plantingDate,
        expectedHarvest: mockCommand.expectedHarvest,
        actualHarvest: mockCommand.actualHarvest,
        quantity: mockCommand.quantity,
        status: mockCommand.status,
        plantingMethod: mockCommand.plantingMethod,
        notes: mockCommand.notes,
      });
      expect(cropsRepository.update).toHaveBeenCalledWith(
        mockUpdatedCropEntity,
      );
      expect(cropsCacheRepository.set).toHaveBeenCalledWith(
        mockUpdatedCropEntity.id.value,
        mockUpdatedCropEntity,
      );
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetCropVarietyByIdQuery(mockUpdatedCropEntity.varietyId),
      );
      expect(result).toEqual(expectedResult);
    });

    it('should throw CropNotFoundException when crop not found', async () => {
      // Arrange
      cropsRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(handler.execute(mockCommand)).rejects.toThrow(
        CropNotFoundException,
      );
      expect(cropsRepository.findById).toHaveBeenCalledWith(mockCommand.id);
      expect(mockCropEntity.update).not.toHaveBeenCalled();
      expect(cropsRepository.update).not.toHaveBeenCalled();
    });

    it('should publish domain events when crop has events', async () => {
      // Arrange
      const mockEvents = [
        { eventId: 'event-1', aggregateId: 'crop-123' },
        { eventId: 'event-2', aggregateId: 'crop-123' },
      ];
      cropsRepository.findById.mockResolvedValue(mockCropEntity);
      (mockCropEntity.update as jest.Mock).mockReturnValue(
        mockUpdatedCropEntity,
      );
      mockUpdatedCropEntity.pullDomainEvents = jest
        .fn()
        .mockReturnValue(mockEvents);

      // Act
      await handler.execute(mockCommand);

      // Assert
      expect(mockUpdatedCropEntity.pullDomainEvents).toHaveBeenCalled();
      expect(nestjsEventBus.publish).toHaveBeenCalledTimes(2);
      expect(nestjsEventBus.publish).toHaveBeenCalledWith(mockEvents[0]);
      expect(nestjsEventBus.publish).toHaveBeenCalledWith(mockEvents[1]);
    });

    it('should not publish events when crop has no events', async () => {
      // Arrange
      cropsRepository.findById.mockResolvedValue(mockCropEntity);
      (mockCropEntity.update as jest.Mock).mockReturnValue(
        mockUpdatedCropEntity,
      );
      mockUpdatedCropEntity.pullDomainEvents = jest.fn().mockReturnValue([]);

      // Act
      await handler.execute(mockCommand);

      // Assert
      expect(mockUpdatedCropEntity.pullDomainEvents).toHaveBeenCalled();
      expect(nestjsEventBus.publish).not.toHaveBeenCalled();
    });

    it('should handle repository findById errors', async () => {
      // Arrange
      const error = new Error('Database error');
      cropsRepository.findById.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(mockCommand)).rejects.toThrow(error);
      expect(cropsRepository.findById).toHaveBeenCalledWith(mockCommand.id);
    });

    it('should handle repository update errors', async () => {
      // Arrange
      cropsRepository.findById.mockResolvedValue(mockCropEntity);
      (mockCropEntity.update as jest.Mock).mockReturnValue(
        mockUpdatedCropEntity,
      );
      const error = new Error('Update error');
      cropsRepository.update.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(mockCommand)).rejects.toThrow(error);
      expect(cropsRepository.update).toHaveBeenCalledWith(
        mockUpdatedCropEntity,
      );
    });

    it('should handle cache set errors', async () => {
      // Arrange
      cropsRepository.findById.mockResolvedValue(mockCropEntity);
      (mockCropEntity.update as jest.Mock).mockReturnValue(
        mockUpdatedCropEntity,
      );
      const error = new Error('Cache error');
      cropsCacheRepository.set.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(mockCommand)).rejects.toThrow(error);
      expect(cropsCacheRepository.set).toHaveBeenCalledWith(
        mockUpdatedCropEntity.id.value,
        mockUpdatedCropEntity,
      );
    });

    it('should handle query bus errors', async () => {
      // Arrange
      cropsRepository.findById.mockResolvedValue(mockCropEntity);
      (mockCropEntity.update as jest.Mock).mockReturnValue(
        mockUpdatedCropEntity,
      );
      const error = new Error('Query bus error');
      queryBus.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(mockCommand)).rejects.toThrow(error);
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetCropVarietyByIdQuery(mockUpdatedCropEntity.varietyId),
      );
    });

    it('should handle event bus publish errors', async () => {
      // Arrange
      const mockEvents = [{ eventId: 'event-1', aggregateId: 'crop-123' }];
      cropsRepository.findById.mockResolvedValue(mockCropEntity);
      (mockCropEntity.update as jest.Mock).mockReturnValue(
        mockUpdatedCropEntity,
      );
      mockUpdatedCropEntity.pullDomainEvents = jest
        .fn()
        .mockReturnValue(mockEvents);
      const error = new Error('Event bus error');
      nestjsEventBus.publish.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(mockCommand)).rejects.toThrow(error);
      expect(nestjsEventBus.publish).toHaveBeenCalledWith(mockEvents[0]);
    });
  });
});
