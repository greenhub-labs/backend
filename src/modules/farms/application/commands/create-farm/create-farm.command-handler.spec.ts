import { CreateFarmCommand } from './create-farm.command';
import { CreateFarmCommandHandler } from './create-farm.command-handler';
import { FarmsRepository } from '../../ports/farms.repository';
import { EventBusServicePort } from '../../ports/event-bus.service';
import { FarmsFactory } from '../../../domain/factories/farm.factory';
import { FarmEntity } from '../../../domain/entities/farm.entity';
import { FarmsCacheRepository } from '../../ports/farms-cache.repository';

describe('CreateFarmCommandHandler', () => {
  let handler: CreateFarmCommandHandler;
  let farmsRepository: jest.Mocked<FarmsRepository>;
  let farmsCacheRepository: jest.Mocked<FarmsCacheRepository>;
  let eventBus: jest.Mocked<EventBusServicePort>;
  let farmsFactory: jest.Mocked<FarmsFactory>;

  beforeEach(() => {
    farmsRepository = { save: jest.fn() } as any;
    farmsCacheRepository = { set: jest.fn() } as any;
    eventBus = { publish: jest.fn() } as any;
    farmsFactory = { create: jest.fn() } as any;
    handler = new CreateFarmCommandHandler(
      farmsRepository,
      farmsCacheRepository,
      eventBus,
      farmsFactory,
    );
  });

  it('should create, save, and publish events for a farm', async () => {
    const command = new CreateFarmCommand({ name: 'Farm' });
    const farm = {
      pullDomainEvents: jest.fn().mockReturnValue(['event']),
    } as any as FarmEntity;
    farmsFactory.create.mockReturnValue(farm);
    await handler.execute(command);
    expect(farmsFactory.create).toHaveBeenCalledWith({
      name: 'Farm',
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
    expect(farmsRepository.save).toHaveBeenCalledWith(farm);
    expect(eventBus.publish).toHaveBeenCalledWith('event');
  });
});
