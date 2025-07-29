import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { GetPlotsByFarmIdQuery } from 'src/modules/plots/application/queries/get-plots-by-farm-id/get-plots-by-farm-id.query';
import { GetCropsByFarmIdQuery } from './get-crops-by-farm-id.query';
import { GetCropsByFarmIdQueryHandler } from './get-crops-by-farm-id.query-handler';

describe('GetCropsByFarmIdQueryHandler', () => {
  let handler: GetCropsByFarmIdQueryHandler;
  let queryBus: jest.Mocked<QueryBus>;

  const mockFarmId = 'farm-123';
  const mockPlotId = 'plot-456';
  const mockCropId = 'crop-789';
  const mockCropVarietyId = 'variety-101';

  const mockCropDetailsResult = {
    crop: {
      id: { value: mockCropId },
      plotId: mockPlotId,
      varietyId: mockCropVarietyId,
      status: { value: 'PLANTED' },
    },
    cropVariety: {
      id: { value: mockCropVarietyId },
      name: { value: 'Test Variety' },
      scientificName: { value: 'Test Scientific Name' },
      type: { value: 'VEGETABLE' },
      description: { value: 'Test Description' },
    },
  } as any;

  const mockPlotDetailsResult = {
    plot: {
      id: { value: mockPlotId },
      farmId: mockFarmId,
    },
    crops: [mockCropDetailsResult],
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCropsByFarmIdQueryHandler,
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetCropsByFarmIdQueryHandler>(
      GetCropsByFarmIdQueryHandler,
    );
    queryBus = module.get(QueryBus);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('execute', () => {
    it('should return all crops for a farm from plot details', async () => {
      // Arrange
      const query = new GetCropsByFarmIdQuery(mockFarmId);

      queryBus.execute.mockResolvedValue([mockPlotDetailsResult]);

      // Act
      const result = await handler.execute(query);

      // Assert
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetPlotsByFarmIdQuery(mockFarmId),
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(mockCropDetailsResult);
    });

    it('should return empty array when farm has no plots', async () => {
      // Arrange
      const query = new GetCropsByFarmIdQuery(mockFarmId);

      queryBus.execute.mockResolvedValue([]);

      // Act
      const result = await handler.execute(query);

      // Assert
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetPlotsByFarmIdQuery(mockFarmId),
      );
      expect(result).toEqual([]);
    });

    it('should return empty array when plots have no crops', async () => {
      // Arrange
      const query = new GetCropsByFarmIdQuery(mockFarmId);
      const plotDetailsWithoutCrops = {
        plot: {
          id: { value: mockPlotId },
          farmId: mockFarmId,
        },
        crops: [],
      } as any;

      queryBus.execute.mockResolvedValue([plotDetailsWithoutCrops]);

      // Act
      const result = await handler.execute(query);

      // Assert
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetPlotsByFarmIdQuery(mockFarmId),
      );
      expect(result).toEqual([]);
    });

    it('should handle multiple plots with multiple crops', async () => {
      // Arrange
      const query = new GetCropsByFarmIdQuery(mockFarmId);

      const mockCropDetailsResult2 = {
        crop: {
          id: { value: 'crop-999' },
          plotId: 'plot-789',
          varietyId: 'variety-202',
          status: { value: 'HARVESTED' },
        },
        cropVariety: {
          id: { value: 'variety-202' },
          name: { value: 'Test Variety 2' },
          scientificName: { value: 'Test Scientific Name 2' },
          type: { value: 'FRUIT' },
          description: { value: 'Test Description 2' },
        },
      } as any;

      const mockPlotDetailsResult2 = {
        plot: {
          id: { value: 'plot-789' },
          farmId: mockFarmId,
        },
        crops: [mockCropDetailsResult2],
      } as any;

      queryBus.execute.mockResolvedValue([
        mockPlotDetailsResult,
        mockPlotDetailsResult2,
      ]);

      // Act
      const result = await handler.execute(query);

      // Assert
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetPlotsByFarmIdQuery(mockFarmId),
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toBe(mockCropDetailsResult);
      expect(result[1]).toBe(mockCropDetailsResult2);
    });

    it('should handle plots with mixed crops (some with crops, some without)', async () => {
      // Arrange
      const query = new GetCropsByFarmIdQuery(mockFarmId);

      const plotDetailsWithoutCrops = {
        plot: {
          id: { value: 'plot-empty' },
          farmId: mockFarmId,
        },
        crops: [],
      } as any;

      queryBus.execute.mockResolvedValue([
        mockPlotDetailsResult,
        plotDetailsWithoutCrops,
      ]);

      // Act
      const result = await handler.execute(query);

      // Assert
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetPlotsByFarmIdQuery(mockFarmId),
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(mockCropDetailsResult);
    });
  });
});
