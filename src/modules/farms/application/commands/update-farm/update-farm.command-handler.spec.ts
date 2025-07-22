import { UpdateFarmCommand } from './update-farm.command';
import { UpdateFarmCommandHandler } from './update-farm.command-handler';
import { FarmsRepository } from '../../ports/farms.repository';
import { FarmsCacheRepository } from '../../ports/farms-cache.repository';
import { FarmEntity } from '../../../domain/entities/farm.entity';
import { FarmNotFoundException } from '../../../domain/exceptions/farm-not-found/farm-not-found.exception';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';

describe('UpdateFarmCommandHandler', () => {
  let handler: UpdateFarmCommandHandler;
  let farmsRepository: jest.Mocked<FarmsRepository>;
  let farmsCacheRepository: jest.Mocked<FarmsCacheRepository>;
  let nestjsEventBus: jest.Mocked<NestjsEventBusService>;

  beforeEach(() => {
    farmsRepository = { findById: jest.fn(), update: jest.fn() } as any;
    farmsCacheRepository = { set: jest.fn() } as any;
    nestjsEventBus = { publish: jest.fn() } as any;
    handler = new UpdateFarmCommandHandler(
      farmsRepository,
      farmsCacheRepository,
      nestjsEventBus,
    );
  });

  it('should update, save, cache, and publish events for a farm', async () => {
    const command = new UpdateFarmCommand({ id: 'id', name: 'Updated' });
    const updatedFarm = {
      pullDomainEvents: jest.fn().mockReturnValue(['event']),
      id: { value: 'id' },
    } as any as FarmEntity;
    const farm = {
      update: jest.fn().mockReturnValue(updatedFarm),
    } as any as FarmEntity;
    farmsRepository.findById.mockResolvedValue(farm);
    await handler.execute(command);
    expect(farmsRepository.findById).toHaveBeenCalledWith('id');
    expect(farm.update).toHaveBeenCalledWith({
      name: 'Updated',
      description: undefined,
      country: undefined,
      state: undefined,
      city: undefined,
      postalCode: undefined,
      street: undefined,
      latitude: undefined,
      longitude: undefined,
      isActive: undefined,
    });
    expect(farmsRepository.update).toHaveBeenCalledWith(updatedFarm);
    expect(farmsCacheRepository.set).toHaveBeenCalledWith('id', updatedFarm);
    expect(nestjsEventBus.publish).toHaveBeenCalledWith('event');
  });

  it('should throw if farm does not exist', async () => {
    farmsRepository.findById.mockResolvedValue(null);
    const command = new UpdateFarmCommand({ id: 'id', name: 'Updated' });
    await expect(handler.execute(command)).rejects.toBeInstanceOf(
      FarmNotFoundException,
    );
  });
});
