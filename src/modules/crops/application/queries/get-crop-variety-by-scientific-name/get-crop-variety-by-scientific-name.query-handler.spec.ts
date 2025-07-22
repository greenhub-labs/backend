import { Test, TestingModule } from '@nestjs/testing';
import { CropVarietyEntity } from 'src/modules/crops/domain/entities/crop-variety.entity';
import { CropVarietyRepository } from '../../ports/crop-variety.repository';
import { GetCropVarietyByScientificNameQuery } from './get-crop-variety-by-scientific-name.query';
import { GetCropVarietyByScientificNameQueryHandler } from './get-crop-variety-by-scientific-name.query-handler';

const mockRepository = () => ({
  findByScientificName: jest.fn(),
});

describe('GetCropVarietyByScientificNameQueryHandler', () => {
  let handler: GetCropVarietyByScientificNameQueryHandler;
  let repository: CropVarietyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCropVarietyByScientificNameQueryHandler,
        { provide: 'CropVarietyRepository', useFactory: mockRepository },
      ],
    }).compile();

    handler = module.get(GetCropVarietyByScientificNameQueryHandler);
    repository = module.get('CropVarietyRepository');
  });

  it('should return a crop variety entity if found', async () => {
    const entity = {} as CropVarietyEntity;
    (repository.findByScientificName as jest.Mock).mockResolvedValue(entity);
    const result = await handler.execute(
      new GetCropVarietyByScientificNameQuery('Solanum lycopersicum'),
    );
    expect(result).toBe(entity);
    expect(repository.findByScientificName).toHaveBeenCalledWith(
      'Solanum lycopersicum',
    );
  });

  it('should return null if not found', async () => {
    (repository.findByScientificName as jest.Mock).mockResolvedValue(null);
    const result = await handler.execute(
      new GetCropVarietyByScientificNameQuery('Unknown'),
    );
    expect(result).toBeNull();
  });
});
