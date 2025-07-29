import { Test, TestingModule } from '@nestjs/testing';
import { CropEntity } from '../../../domain/entities/crop.entity';
import { CropNotFoundException } from '../../../domain/exceptions/crop-not-found/crop-not-found.exception';
import {
  CROPS_CACHE_REPOSITORY_TOKEN,
  CropsCacheRepository,
} from '../../ports/crops-cache.repository';
import {
  CROPS_REPOSITORY_TOKEN,
  CropsRepository,
} from '../../ports/crops.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { DeleteCropCommand } from './delete-crop.command';
import { DeleteCropCommandHandler } from './delete-crop.command-handler';

describe('DeleteCropCommandHandler', () => {
  let handler: DeleteCropCommandHandler;
  let cropsRepository: jest.Mocked<CropsRepository>;
  let cropsCacheRepository: jest.Mocked<CropsCacheRepository>;
  let nestjsEventBus: jest.Mocked<NestjsEventBusService>;

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
    delete: jest.fn(),
    pullDomainEvents: jest.fn().mockReturnValue([]),
  } as unknown as CropEntity;

  const mockDeletedCropEntity = {
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
    deletedAt: new Date(),
    isDeleted: true,
    pullDomainEvents: jest.fn().mockReturnValue([]),
  } as unknown as CropEntity;

  const mockCommand = new DeleteCropCommand('crop-123');

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
      remove: jest.fn(),
    };

    const mockNestjsEventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCropCommandHandler,
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
      ],
    }).compile();

    handler = module.get<DeleteCropCommandHandler>(DeleteCropCommandHandler);
    cropsRepository = module.get(CROPS_REPOSITORY_TOKEN);
    cropsCacheRepository = module.get(CROPS_CACHE_REPOSITORY_TOKEN);
    nestjsEventBus = module.get(NestjsEventBusService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete a crop successfully', async () => {
      // Arrange
      cropsRepository.findById.mockResolvedValue(mockCropEntity);
      (mockCropEntity.delete as jest.Mock).mockReturnValue(
        mockDeletedCropEntity,
      );

      // Act
      const result = await handler.execute(mockCommand);

      // Assert
      expect(cropsRepository.findById).toHaveBeenCalledWith(mockCommand.cropId);
      expect(mockCropEntity.delete).toHaveBeenCalled();
      expect(cropsRepository.update).toHaveBeenCalledWith(
        mockDeletedCropEntity,
      );
      expect(cropsCacheRepository.remove).toHaveBeenCalledWith(
        mockDeletedCropEntity.id.value,
      );
      expect(result).toBe(true);
    });

    it('should throw CropNotFoundException when crop not found', async () => {
      // Arrange
      cropsRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(handler.execute(mockCommand)).rejects.toThrow(
        CropNotFoundException,
      );
      expect(cropsRepository.findById).toHaveBeenCalledWith(mockCommand.cropId);
      expect(mockCropEntity.delete).not.toHaveBeenCalled();
      expect(cropsRepository.update).not.toHaveBeenCalled();
      expect(cropsCacheRepository.remove).not.toHaveBeenCalled();
    });

    it('should publish domain events when crop has events', async () => {
      // Arrange
      const mockEvents = [
        { eventId: 'event-1', aggregateId: 'crop-123' },
        { eventId: 'event-2', aggregateId: 'crop-123' },
      ];
      cropsRepository.findById.mockResolvedValue(mockCropEntity);
      (mockCropEntity.delete as jest.Mock).mockReturnValue(
        mockDeletedCropEntity,
      );
      mockDeletedCropEntity.pullDomainEvents = jest
        .fn()
        .mockReturnValue(mockEvents);

      // Act
      await handler.execute(mockCommand);

      // Assert
      expect(mockDeletedCropEntity.pullDomainEvents).toHaveBeenCalled();
      expect(nestjsEventBus.publish).toHaveBeenCalledTimes(2);
      expect(nestjsEventBus.publish).toHaveBeenCalledWith(mockEvents[0]);
      expect(nestjsEventBus.publish).toHaveBeenCalledWith(mockEvents[1]);
    });

    it('should not publish events when crop has no events', async () => {
      // Arrange
      cropsRepository.findById.mockResolvedValue(mockCropEntity);
      (mockCropEntity.delete as jest.Mock).mockReturnValue(
        mockDeletedCropEntity,
      );
      mockDeletedCropEntity.pullDomainEvents = jest.fn().mockReturnValue([]);

      // Act
      await handler.execute(mockCommand);

      // Assert
      expect(mockDeletedCropEntity.pullDomainEvents).toHaveBeenCalled();
      expect(nestjsEventBus.publish).not.toHaveBeenCalled();
    });

    it('should handle repository findById errors', async () => {
      // Arrange
      const error = new Error('Database error');
      cropsRepository.findById.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(mockCommand)).rejects.toThrow(error);
      expect(cropsRepository.findById).toHaveBeenCalledWith(mockCommand.cropId);
    });

    it('should handle repository update errors', async () => {
      // Arrange
      cropsRepository.findById.mockResolvedValue(mockCropEntity);
      (mockCropEntity.delete as jest.Mock).mockReturnValue(
        mockDeletedCropEntity,
      );
      const error = new Error('Update error');
      cropsRepository.update.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(mockCommand)).rejects.toThrow(error);
      expect(cropsRepository.update).toHaveBeenCalledWith(
        mockDeletedCropEntity,
      );
    });

    it('should handle cache remove errors', async () => {
      // Arrange
      cropsRepository.findById.mockResolvedValue(mockCropEntity);
      (mockCropEntity.delete as jest.Mock).mockReturnValue(
        mockDeletedCropEntity,
      );
      const error = new Error('Cache error');
      cropsCacheRepository.remove.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(mockCommand)).rejects.toThrow(error);
      expect(cropsCacheRepository.remove).toHaveBeenCalledWith(
        mockDeletedCropEntity.id.value,
      );
    });

    it('should handle event bus publish errors', async () => {
      // Arrange
      const mockEvents = [{ eventId: 'event-1', aggregateId: 'crop-123' }];
      cropsRepository.findById.mockResolvedValue(mockCropEntity);
      (mockCropEntity.delete as jest.Mock).mockReturnValue(
        mockDeletedCropEntity,
      );
      mockDeletedCropEntity.pullDomainEvents = jest
        .fn()
        .mockReturnValue(mockEvents);
      const error = new Error('Event bus error');
      nestjsEventBus.publish.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(mockCommand)).rejects.toThrow(error);
      expect(nestjsEventBus.publish).toHaveBeenCalledWith(mockEvents[0]);
    });

    it('should handle crop delete method errors', async () => {
      // Arrange
      cropsRepository.findById.mockResolvedValue(mockCropEntity);
      const error = new Error('Delete method error');
      (mockCropEntity.delete as jest.Mock).mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      await expect(handler.execute(mockCommand)).rejects.toThrow(error);
      expect(mockCropEntity.delete).toHaveBeenCalled();
    });
  });
});
