import { FarmFactory } from './farm.factory';
import { FarmEntity } from '../entities/farm.entity';
import { FarmIdValueObject } from '../value-objects/farm-id/farm-id.value-object';
import { FarmNameValueObject } from '../value-objects/farm-name/farm-name.value-object';
import { FarmAddressValueObject } from '../value-objects/farm-address/farm-address.value-object';
import { FarmCoordinatesValueObject } from '../value-objects/farm-coordinates/farm-coordinates.value-object';

const uuid = '123e4567-e89b-12d3-a456-426614174000';
const now = new Date();

describe('FarmsFactory', () => {
  let factory: FarmFactory;

  beforeEach(() => {
    factory = new FarmFactory();
  });

  it('should create a FarmEntity with minimal data', () => {
    const entity = factory.create({
      name: 'Test Farm',
    });
    expect(entity).toBeInstanceOf(FarmEntity);
    expect(entity.id).toBeInstanceOf(FarmIdValueObject);
    expect(entity.name).toBeInstanceOf(FarmNameValueObject);
    expect(entity.address).toBeInstanceOf(FarmAddressValueObject);
    expect(entity.coordinates).toBeInstanceOf(FarmCoordinatesValueObject);
    expect(entity.id.value).toBe(uuid);
    expect(entity.name.value).toBe('Test Farm');
    expect(entity.isActive).toBe(true);
  });

  it('should create a FarmEntity with all fields', () => {
    const entity = factory.create({
      name: 'Full Farm',
      description: 'A complete farm',
      country: 'Spain',
      state: 'Andalusia',
      city: 'Seville',
      postalCode: '41001',
      street: 'Calle Real 1',
      latitude: 37.3886,
      longitude: -5.9823,
      isActive: false,
    });
    expect(entity.id.value).toBe(uuid);
    expect(entity.name.value).toBe('Full Farm');
    expect(entity.description).toBe('A complete farm');
    expect(entity.address.country).toBe('Spain');
    expect(entity.address.state).toBe('Andalusia');
    expect(entity.address.city).toBe('Seville');
    expect(entity.address.postalCode).toBe('41001');
    expect(entity.address.street).toBe('Calle Real 1');
    expect(entity.coordinates.latitude).toBe(37.3886);
    expect(entity.coordinates.longitude).toBe(-5.9823);
    expect(entity.isActive).toBe(false);
  });

  it('should reconstruct a FarmEntity from primitives', () => {
    const entity = FarmFactory.fromPrimitives({
      id: uuid,
      name: 'Restored Farm',
      description: 'Restored',
      country: 'Spain',
      state: 'Madrid',
      city: 'Madrid',
      postalCode: '28001',
      street: 'Gran Via 1',
      latitude: 40.4168,
      longitude: -3.7038,
      isActive: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      deletedAt: undefined,
    });
    expect(entity).toBeInstanceOf(FarmEntity);
    expect(entity.id.value).toBe(uuid);
    expect(entity.name.value).toBe('Restored Farm');
    expect(entity.address.city).toBe('Madrid');
    expect(entity.coordinates.latitude).toBe(40.4168);
    expect(entity.isActive).toBe(true);
    expect(entity.createdAt.toISOString()).toBe(now.toISOString());
    expect(entity.updatedAt.toISOString()).toBe(now.toISOString());
    expect(entity.deletedAt).toBeUndefined();
  });
});
