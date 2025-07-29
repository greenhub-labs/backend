import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCropCommand } from '../../../application/commands/create-crop/create-crop.command';
import { DeleteCropCommand } from '../../../application/commands/delete-crop/delete-crop.command';
import { UpdateCropCommand } from '../../../application/commands/update-crop/update-crop.command';
import { GetAllCropsQuery } from '../../../application/queries/get-all-crops/get-all-crops.query';
import { GetCropByIdQuery } from '../../../application/queries/get-crop-by-id/get-crop-by-id.query';
import { GetCropsByFarmIdQuery } from '../../../application/queries/get-crops-by-farm-id/get-crops-by-farm-id.query';
import { GetCropsByPlotIdQuery } from '../../../application/queries/get-crops-by-plot-id/get-crops-by-plot-id.query';
import { CropMapper } from '../mappers/crop.mapper';
import { CropResolver } from './crop.resolver';

// Explicación: Se mockean los buses y el mapper para aislar el resolver
jest.mock('../mappers/crop.mapper');

describe('CropResolver', () => {
  let resolver: CropResolver;
  let queryBus: jest.Mocked<QueryBus>;
  let commandBus: jest.Mocked<CommandBus>;

  // Mocks de resultados de dominio y DTOs
  const mockDomainResult = { id: 'crop-1' };
  const mockDto = { id: 'crop-1', name: 'Test Crop' };

  beforeEach(() => {
    queryBus = { execute: jest.fn() } as any;
    commandBus = { execute: jest.fn() } as any;
    (CropMapper.fromDomain as jest.Mock).mockReturnValue(mockDto);
    resolver = new CropResolver(queryBus, commandBus);
    jest.clearAllMocks();
  });

  describe('getCropById', () => {
    it('should return a crop by id', async () => {
      queryBus.execute.mockResolvedValue(mockDomainResult);
      const input = { cropId: 'crop-1' };
      const result = await resolver.getCropById(input);
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetCropByIdQuery('crop-1'),
      );
      expect(CropMapper.fromDomain).toHaveBeenCalledWith(mockDomainResult);
      expect(result).toEqual(mockDto);
    });
  });

  describe('getAllCrops', () => {
    it('should return all crops', async () => {
      queryBus.execute.mockResolvedValue([mockDomainResult]);
      const result = await resolver.getAllCrops();
      expect(queryBus.execute).toHaveBeenCalledWith(new GetAllCropsQuery());
      expect(CropMapper.fromDomain).toHaveBeenCalledWith(mockDomainResult);
      expect(result).toEqual([mockDto]);
    });
  });

  describe('getCropsByPlotId', () => {
    it('should return crops by plot id', async () => {
      queryBus.execute.mockResolvedValue([mockDomainResult]);
      const result = await resolver.getCropsByPlotId('plot-1');
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetCropsByPlotIdQuery('plot-1'),
      );
      expect(CropMapper.fromDomain).toHaveBeenCalledWith(mockDomainResult);
      expect(result).toEqual([mockDto]);
    });
  });

  describe('getCropsByFarmId', () => {
    it('should return crops by farm id', async () => {
      queryBus.execute.mockResolvedValue([mockDomainResult]);
      const input = { farmId: 'farm-1' };
      const result = await resolver.getCropsByFarmId(input);
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetCropsByFarmIdQuery('farm-1'),
      );
      expect(CropMapper.fromDomain).toHaveBeenCalledWith(mockDomainResult);
      expect(result).toEqual([mockDto]);
    });

    it('should return empty array when farm has no crops', async () => {
      queryBus.execute.mockResolvedValue([]);
      const input = { farmId: 'farm-1' };
      const result = await resolver.getCropsByFarmId(input);
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetCropsByFarmIdQuery('farm-1'),
      );
      expect(CropMapper.fromDomain).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('createCrop', () => {
    it('should create a crop', async () => {
      commandBus.execute.mockResolvedValue(mockDomainResult);
      const input = {
        plotId: 'plot-1',
        varietyId: 'variety-1',
        plantingDate: '2024-01-01',
        expectedHarvest: '2024-06-01',
        actualHarvest: '2024-06-10',
        quantity: 10,
        status: 'PLANTED',
        plantingMethod: 'DIRECT_SEED',
        notes: 'Test',
      };
      const result = await resolver.createCrop(input as any);
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateCropCommand),
      );
      expect(CropMapper.fromDomain).toHaveBeenCalledWith(mockDomainResult);
      expect(result).toEqual(mockDto);
    });
  });

  describe('updateCrop', () => {
    it('should update a crop', async () => {
      commandBus.execute.mockResolvedValue(mockDomainResult);
      const input = {
        id: 'crop-1',
        plantingDate: '2024-01-01',
        expectedHarvest: '2024-06-01',
        actualHarvest: '2024-06-10',
        quantity: 10,
        status: 'PLANTED',
        plantingMethod: 'DIRECT_SEED',
        notes: 'Test',
      };
      const result = await resolver.updateCrop(input as any);
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(UpdateCropCommand),
      );
      expect(CropMapper.fromDomain).toHaveBeenCalledWith(mockDomainResult);
      expect(result).toEqual(mockDto);
    });
  });

  describe('deleteCrop', () => {
    it('should delete a crop', async () => {
      commandBus.execute.mockResolvedValue(undefined);
      const input = { cropId: 'crop-1' };
      const result = await resolver.deleteCrop(input);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new DeleteCropCommand('crop-1'),
      );
      expect(result).toBe(true);
    });
  });
});
