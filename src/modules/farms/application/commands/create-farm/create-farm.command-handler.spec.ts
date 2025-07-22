import { CreateFarmCommand } from './create-farm.command';
import { CreateFarmCommandHandler } from './create-farm.command-handler';
import { FarmsRepository } from '../../ports/farms.repository';
import { FarmFactory } from '../../../domain/factories/farm.factory';
import { FarmEntity } from '../../../domain/entities/farm.entity';
import { FarmsCacheRepository } from '../../ports/farms-cache.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';

describe('CreateFarmCommandHandler', () => {
  let handler: CreateFarmCommandHandler;
  let farmsRepository: jest.Mocked<FarmsRepository>;
  let farmsCacheRepository: jest.Mocked<FarmsCacheRepository>;
  let nestjsEventBus: jest.Mocked<NestjsEventBusService>;
  let farmFactory: jest.Mocked<FarmFactory>;

  beforeEach(() => {
    farmsRepository = { save: jest.fn() } as any;
    farmsCacheRepository = { set: jest.fn() } as any;
    nestjsEventBus = { publish: jest.fn() } as any;
    farmFactory = { create: jest.fn() } as any;
    handler = new CreateFarmCommandHandler(
      farmsRepository,
      farmsCacheRepository,
      nestjsEventBus,
      farmFactory,
    );
  });

  it('should create, save, and publish events for a farm', async () => {
    const command = new CreateFarmCommand({ name: 'Farm' });
    const farm = {
      pullDomainEvents: jest.fn().mockReturnValue(['event']),
    } as any as FarmEntity;
    farmFactory.create.mockReturnValue(farm);
    await handler.execute(command);
    expect(farmFactory.create).toHaveBeenCalledWith({
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
    expect(nestjsEventBus.publish).toHaveBeenCalledWith('event');
  });
});
