import { GetAllFarmsQueryHandler } from './get-all-farms.query-handler';
import { GetAllFarmsQuery } from './get-all-farms.query';
import { FarmsRepository } from '../../ports/farms.repository';
import { FarmEntity } from '../../../domain/entities/farm.entity';
import { FarmIdValueObject } from '../../../domain/value-objects/farm-id/farm-id.value-object';
import { FarmNameValueObject } from '../../../domain/value-objects/farm-name/farm-name.value-object';
import { FarmAddressValueObject } from '../../../domain/value-objects/farm-address/farm-address.value-object';
import { FarmCoordinatesValueObject } from '../../../domain/value-objects/farm-coordinates/farm-coordinates.value-object';
import { FarmsCacheRepository } from '../../ports/farms-cache.repository';

describe('GetAllFarmsQueryHandler', () => {
  let handler: GetAllFarmsQueryHandler;
  let farmsRepository: jest.Mocked<FarmsRepository>;
  let farmsCacheRepository: jest.Mocked<FarmsCacheRepository>;
  beforeEach(() => {
    farmsRepository = {
      findAll: jest.fn(),
    } as any;
    farmsCacheRepository = {
      get: jest.fn(),
    } as any;
    handler = new GetAllFarmsQueryHandler(
      farmsRepository,
      farmsCacheRepository,
    );
  });

  it('should return an array of farms', async () => {
    const farm = new FarmEntity({
      id: new FarmIdValueObject('farm-123'),
      name: new FarmNameValueObject('Test Farm'),
      address: new FarmAddressValueObject({
        country: 'ES',
        state: 'Madrid',
        city: 'Madrid',
        postalCode: '28001',
        street: 'Calle Falsa 123',
      }),
      coordinates: new FarmCoordinatesValueObject({
        latitude: 1,
        longitude: 2,
      }),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    farmsRepository.findAll.mockResolvedValue([farm]);
    const result = await handler.execute(new GetAllFarmsQuery());
    expect(result).toEqual([farm]);
    expect(farmsRepository.findAll).toHaveBeenCalled();
  });

  it('should return an empty array if no farms exist', async () => {
    farmsRepository.findAll.mockResolvedValue([]);
    const result = await handler.execute(new GetAllFarmsQuery());
    expect(result).toEqual([]);
    expect(farmsRepository.findAll).toHaveBeenCalled();
  });
});
