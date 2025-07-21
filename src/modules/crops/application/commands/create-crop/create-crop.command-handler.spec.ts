import { CropEntity } from '../../../domain/entities/crop.entity';
import { CropFactory } from '../../../domain/factories/crop.factory';
import { CropVarietyCacheRepository } from '../../ports/crop-variety-cache.repository';
import { CropVarietyRepository } from '../../ports/crop-variety.repository';
import { CropsCacheRepository } from '../../ports/crops-cache.repository';
import { CropsRepository } from '../../ports/crops.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { CreateCropCommand } from './create-crop.command';
import { CreateCropCommandHandler } from './create-crop.command-handler';

describe('CreateCropCommandHandler', () => {
  let handler: CreateCropCommandHandler;
  let cropsRepository: jest.Mocked<CropsRepository>;
  let cropsCacheRepository: jest.Mocked<CropsCacheRepository>;
  let nestjsEventBus: jest.Mocked<NestjsEventBusService>;
  let cropFactory: jest.Mocked<CropFactory>;
  let cropVarietyRepository: jest.Mocked<CropVarietyRepository>;
  let cropVarietyCacheRepository: jest.Mocked<CropVarietyCacheRepository>;
  beforeEach(() => {
    cropsRepository = { save: jest.fn() } as any;
    cropsCacheRepository = { set: jest.fn() } as any;
    nestjsEventBus = { publish: jest.fn() } as any;
    cropFactory = { create: jest.fn() } as any;
    cropVarietyRepository = { findById: jest.fn() } as any;
    cropVarietyCacheRepository = { get: jest.fn() } as any;
    handler = new CreateCropCommandHandler(
      cropsRepository,
      cropsCacheRepository,
      nestjsEventBus,
      cropFactory,
      cropVarietyRepository,
    );
  });

  it('should create, save, and publish events for a crop', async () => {
    const command = new CreateCropCommand({
      plotId: 'plotId',
      varietyId: 'varietyId',
      plantingDate: new Date(),
      expectedHarvest: new Date(),
      actualHarvest: new Date(),
      quantity: 10,
      status: 'PLANNED',
      plantingMethod: 'DIRECT_SEED',
      notes: 'Test crop',
    });
    const crop = {
      id: { value: 'cropId' },
      pullDomainEvents: jest.fn().mockReturnValue(['event']),
    } as any as CropEntity;
    cropFactory.create.mockReturnValue(crop);
    await handler.execute(command);
    expect(cropFactory.create).toHaveBeenCalledWith({
      plotId: 'plotId',
      varietyId: 'varietyId',
      plantingDate: command.plantingDate,
      expectedHarvest: command.expectedHarvest,
      actualHarvest: command.actualHarvest,
      quantity: 10,
      status: 'PLANNED',
      plantingMethod: 'DIRECT_SEED',
      notes: 'Test crop',
    });
    expect(cropsRepository.save).toHaveBeenCalledWith(crop);
    expect(nestjsEventBus.publish).toHaveBeenCalledWith('event');
  });
});
