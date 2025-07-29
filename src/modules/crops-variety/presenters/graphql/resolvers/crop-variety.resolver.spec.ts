import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCropVarietyCommand } from '../../../application/commands/create-crop-variety/create-crop-variety.command';
import { DeleteCropVarietyCommand } from '../../../application/commands/delete-crop-variety/delete-crop-variety.command';
import { UpdateCropVarietyCommand } from '../../../application/commands/update-crop-variety/update-crop-variety.command';
import { GetAllCropsVarietiesQuery } from '../../../application/queries/get-all-crops-varieties/get-all-crops-varieties.query';
import { GetCropVarietyByIdQuery } from '../../../application/queries/get-crop-variety-by-id/get-crop-variety-by-id.query';
import { GetCropVarietyByScientificNameQuery } from '../../../application/queries/get-crop-variety-by-scientific-name/get-crop-variety-by-scientific-name.query';
import { CropVarietyMapper } from '../mappers/crop-variety.mapper';
import { CropVarietyResolver } from './crop-variety.resolver';

// Explicación: Se mockean los buses y el mapper para aislar el resolver
jest.mock('../mappers/crop-variety.mapper');

describe('CropVarietyResolver', () => {
  let resolver: CropVarietyResolver;
  let queryBus: jest.Mocked<QueryBus>;
  let commandBus: jest.Mocked<CommandBus>;

  // Mocks de resultados de dominio y DTOs
  const mockDomainResult = { id: 'variety-1' };
  const mockDto = { id: 'variety-1', name: 'Test Variety' };

  beforeEach(() => {
    queryBus = { execute: jest.fn() } as any;
    commandBus = { execute: jest.fn() } as any;
    (CropVarietyMapper.fromDomain as jest.Mock).mockReturnValue(mockDto);
    resolver = new CropVarietyResolver(commandBus, queryBus);
    jest.clearAllMocks();
  });

  describe('getCropVarietyById', () => {
    it('should return a crop variety by id', async () => {
      queryBus.execute.mockResolvedValue(mockDomainResult);
      const result = await resolver.getCropVarietyById('variety-1');
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetCropVarietyByIdQuery('variety-1'),
      );
      expect(CropVarietyMapper.fromDomain).toHaveBeenCalledWith(
        mockDomainResult,
      );
      expect(result).toEqual(mockDto);
    });
  });

  describe('getCropVarietyByScientificName', () => {
    it('should return a crop variety by scientific name', async () => {
      queryBus.execute.mockResolvedValue(mockDomainResult);
      const input = { scientificName: 'Test' };
      const result = await resolver.getCropVarietyByScientificName(input);
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetCropVarietyByScientificNameQuery('Test'),
      );
      expect(CropVarietyMapper.fromDomain).toHaveBeenCalledWith(
        mockDomainResult,
      );
      expect(result).toEqual(mockDto);
    });
  });

  describe('getAllCropVarieties', () => {
    it('should return all crop varieties', async () => {
      queryBus.execute.mockResolvedValue([mockDomainResult]);
      const result = await resolver.getAllCropVarieties();
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetAllCropsVarietiesQuery(),
      );
      expect(CropVarietyMapper.fromDomain).toHaveBeenCalledWith(
        mockDomainResult,
        0,
        [mockDomainResult],
      );
      expect(result).toEqual([mockDto]);
    });
  });

  describe('createCropVariety', () => {
    it('should create a crop variety', async () => {
      commandBus.execute.mockResolvedValue(mockDomainResult);
      const input = { name: 'Test', scientificName: 'Test', type: 'VEGETABLE' };
      const result = await resolver.createCropVariety(input as any);
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateCropVarietyCommand),
      );
      expect(CropVarietyMapper.fromDomain).toHaveBeenCalledWith(
        mockDomainResult,
      );
      expect(result).toEqual(mockDto);
    });
  });

  describe('updateCropVariety', () => {
    it('should update a crop variety', async () => {
      commandBus.execute.mockResolvedValue(mockDomainResult);
      const input = {
        id: 'variety-1',
        name: 'Test',
        scientificName: 'Test',
        type: 'VEGETABLE',
      };
      const result = await resolver.updateCropVariety(input as any);
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(UpdateCropVarietyCommand),
      );
      expect(CropVarietyMapper.fromDomain).toHaveBeenCalledWith(
        mockDomainResult,
      );
      expect(result).toEqual(mockDto);
    });
  });

  describe('deleteCropVariety', () => {
    it('should delete a crop variety', async () => {
      commandBus.execute.mockResolvedValue(true);
      const input = { id: 'variety-1' };
      const result = await resolver.deleteCropVariety(input);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new DeleteCropVarietyCommand('variety-1'),
      );
      expect(result).toBe(true);
    });
  });
});
