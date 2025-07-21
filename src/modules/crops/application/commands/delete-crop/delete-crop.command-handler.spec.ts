import { CropEntity } from '../../../domain/entities/crop.entity';
import { CropNotFoundException } from '../../../domain/exceptions/crop-not-found/crop-not-found.exception';
import { CropsCacheRepository } from '../../ports/crops-cache.repository';
import { CropsRepository } from '../../ports/crops.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { DeleteCropCommand } from './delete-crop.command';
import { DeleteCropCommandHandler } from './delete-crop.command-handler';

describe('DeleteCropCommandHandler', () => {
  let handler: DeleteCropCommandHandler;
  let cropsRepository: jest.Mocked<CropsRepository>;
  let cropsCacheRepository: jest.Mocked<CropsCacheRepository>;
  let nestjsEventBus: jest.Mocked<NestjsEventBusService>;

  beforeEach(() => {
    cropsRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    } as any;
    cropsCacheRepository = {
      remove: jest.fn(),
    } as any;
    nestjsEventBus = {
      publish: jest.fn(),
    } as any;
    handler = new DeleteCropCommandHandler(
      cropsRepository,
      cropsCacheRepository,
      nestjsEventBus,
    );
  });

  it('should delete a crop and publish event', async () => {
    const cropId = 'crop-123';
    const crop = {
      id: { value: cropId },
      delete: jest.fn().mockReturnValue({
        id: { value: cropId },
        pullDomainEvents: jest.fn().mockReturnValue(['event']),
      }),
    } as any as CropEntity;
    cropsRepository.findById.mockResolvedValue(crop);
    cropsRepository.update.mockResolvedValue(undefined);
    cropsCacheRepository.remove.mockResolvedValue(undefined);
    nestjsEventBus.publish.mockResolvedValue(undefined);

    await handler.execute(new DeleteCropCommand(cropId));

    expect(cropsRepository.findById).toHaveBeenCalledWith(cropId);
    expect(cropsRepository.update).toHaveBeenCalled();
    expect(cropsCacheRepository.remove).toHaveBeenCalledWith(cropId);
    expect(nestjsEventBus.publish).toHaveBeenCalled();
  });

  it('should throw CropNotFoundException if crop does not exist', async () => {
    cropsRepository.findById.mockResolvedValue(null);
    await expect(
      handler.execute(new DeleteCropCommand('not-found')),
    ).rejects.toBeInstanceOf(CropNotFoundException);
  });
});
