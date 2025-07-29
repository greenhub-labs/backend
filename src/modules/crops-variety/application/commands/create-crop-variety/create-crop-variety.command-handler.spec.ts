import { CropVarietyEntity } from 'src/modules/crops-variety/domain/entities/crop-variety.entity';
import { CropVarietyFactory } from 'src/modules/crops-variety/domain/factories/crop-variety.factory';
import { CropVarietyCacheRepository } from '../../ports/crop-variety-cache.repository';
import { CropVarietyRepository } from '../../ports/crop-variety.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { CreateCropVarietyCommand } from './create-crop-variety.command';
import { CreateCropVarietyCommandHandler } from './create-crop-variety.command-handler';

describe('CreateCropVarietyCommandHandler', () => {
  let handler: CreateCropVarietyCommandHandler;
  let cropVarietyRepository: jest.Mocked<CropVarietyRepository>;
  let cropVarietyCacheRepository: jest.Mocked<CropVarietyCacheRepository>;
  let cropVarietyFactory: jest.Mocked<CropVarietyFactory>;
  let nestjsEventBus: jest.Mocked<NestjsEventBusService>;

  beforeEach(() => {
    cropVarietyRepository = { save: jest.fn() } as any;
    cropVarietyCacheRepository = { set: jest.fn() } as any;
    cropVarietyFactory = { create: jest.fn() } as any;
    nestjsEventBus = { publish: jest.fn() } as any;
    handler = new CreateCropVarietyCommandHandler(
      cropVarietyCacheRepository,
      cropVarietyRepository,
      cropVarietyFactory,
      nestjsEventBus,
    );
  });

  it('should create and save a crop variety', async () => {
    const mockCropVariety = {
      id: { value: 'variety-123' },
      name: { value: 'Tomato' },
      type: { value: 'VEGETABLE' },
      pullDomainEvents: jest.fn().mockReturnValue([]),
    } as any as CropVarietyEntity;

    cropVarietyFactory.create.mockReturnValue(mockCropVariety);
    cropVarietyRepository.save.mockResolvedValue(undefined);
    cropVarietyCacheRepository.set.mockResolvedValue(undefined);
    nestjsEventBus.publish.mockResolvedValue(undefined);

    const command = new CreateCropVarietyCommand({
      name: 'Tomato',
      type: 'VEGETABLE',
      compatibleWith: [],
      incompatibleWith: [],
      plantingSeasons: [],
      harvestSeasons: [],
    });

    const result = await handler.execute(command);

    expect(cropVarietyFactory.create).toHaveBeenCalledWith({
      name: 'Tomato',
      type: 'VEGETABLE',
      compatibleWith: [],
      incompatibleWith: [],
      plantingSeasons: [],
      harvestSeasons: [],
    });
    expect(cropVarietyRepository.save).toHaveBeenCalledWith(mockCropVariety);
    expect(cropVarietyCacheRepository.set).toHaveBeenCalledWith(
      'variety-123',
      mockCropVariety,
    );
    expect(result).toBe(mockCropVariety);
  });
});
