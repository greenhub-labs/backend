import { GetFarmByIdQueryHandler } from './get-farm-by-id.query-handler';
import { GetFarmByIdQuery } from './get-farm-by-id.query';
import { FarmsRepository } from '../../ports/farms.repository';
import { FarmNotFoundException } from '../../../domain/exceptions/farm-not-found/farm-not-found.exception';
import { FarmEntity } from '../../../domain/entities/farm.entity';
import { FarmIdValueObject } from '../../../domain/value-objects/farm-id/farm-id.value-object';
import { FarmNameValueObject } from '../../../domain/value-objects/farm-name/farm-name.value-object';
import { FarmAddressValueObject } from '../../../domain/value-objects/farm-address/farm-address.value-object';
import { FarmCoordinatesValueObject } from '../../../domain/value-objects/farm-coordinates/farm-coordinates.value-object';
import { FarmsCacheRepository } from '../../ports/farms-cache.repository';

describe('GetFarmByIdQueryHandler', () => {
  let handler: GetFarmByIdQueryHandler;
  let farmsRepository: jest.Mocked<FarmsRepository>;
  let farmsCacheRepository: jest.Mocked<FarmsCacheRepository>;
  beforeEach(() => {
    farmsRepository = {
      findById: jest.fn(),
    } as any;
    farmsCacheRepository = {
      get: jest.fn(),
    } as any;
    handler = new GetFarmByIdQueryHandler(
      farmsRepository,
      farmsCacheRepository,
    );
  });

  it('should return a farm if found', async () => {
    const farmId = 'farm-123';
    const farm = new FarmEntity({
      id: new FarmIdValueObject(farmId),
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
    farmsRepository.findById.mockResolvedValue(farm);
    const result = await handler.execute(new GetFarmByIdQuery(farmId));
    expect(result).toBe(farm);
    expect(farmsRepository.findById).toHaveBeenCalledWith(farmId);
  });

  it('should throw FarmNotFoundException if not found', async () => {
    farmsRepository.findById.mockResolvedValue(null);
    await expect(
      handler.execute(new GetFarmByIdQuery('not-found')),
    ).rejects.toBeInstanceOf(FarmNotFoundException);
  });
});
