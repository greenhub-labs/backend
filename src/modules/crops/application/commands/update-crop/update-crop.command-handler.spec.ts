import { CropEntity } from '../../../domain/entities/crop.entity';
import { CropNotFoundException } from '../../../domain/exceptions/crop-not-found/crop-not-found.exception';
import { CropsCacheRepository } from '../../ports/crops-cache.repository';
import { CropsRepository } from '../../ports/crops.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { UpdateCropCommand } from './update-crop.command';
import { UpdateCropCommandHandler } from './update-crop.command-handler';

describe('UpdateCropCommandHandler', () => {
  let handler: UpdateCropCommandHandler;
  let cropsRepository: jest.Mocked<CropsRepository>;
  let cropsCacheRepository: jest.Mocked<CropsCacheRepository>;
  let nestjsEventBus: jest.Mocked<NestjsEventBusService>;

  beforeEach(() => {
    cropsRepository = { findById: jest.fn(), update: jest.fn() } as any;
    cropsCacheRepository = { set: jest.fn() } as any;
    nestjsEventBus = { publish: jest.fn() } as any;
    handler = new UpdateCropCommandHandler(
      cropsRepository,
      cropsCacheRepository,
      nestjsEventBus,
    );
  });

  it('should update, save, cache, and publish events for a crop', async () => {
    const command = new UpdateCropCommand({
      id: 'id',
      plotId: 'plotId',
      varietyId: 'varietyId',
    });
    const updatedCrop = {
      pullDomainEvents: jest.fn().mockReturnValue(['event']),
      id: { value: 'id' },
    } as any as CropEntity;
    const crop = {
      update: jest.fn().mockReturnValue(updatedCrop),
    } as any as CropEntity;
    cropsRepository.findById.mockResolvedValue(crop);
    await handler.execute(command);
    expect(cropsRepository.findById).toHaveBeenCalledWith('id');
    expect(crop.update).toHaveBeenCalledWith({
      plotId: 'plotId',
      varietyId: 'varietyId',
      plantingDate: undefined,
      expectedHarvest: undefined,
      actualHarvest: undefined,
      quantity: undefined,
      status: undefined,
      plantingMethod: undefined,
      notes: undefined,
    });
    expect(cropsRepository.update).toHaveBeenCalledWith(updatedCrop);
    expect(cropsCacheRepository.set).toHaveBeenCalledWith('id', updatedCrop);
    expect(nestjsEventBus.publish).toHaveBeenCalledWith('event');
  });

  it('should throw if crop does not exist', async () => {
    cropsRepository.findById.mockResolvedValue(null);
    const command = new UpdateCropCommand({ id: 'id', plotId: 'plotId' });
    await expect(handler.execute(command)).rejects.toBeInstanceOf(
      CropNotFoundException,
    );
  });
});
