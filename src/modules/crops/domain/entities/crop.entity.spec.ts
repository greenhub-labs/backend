import { CropCreatedDomainEvent } from '../events/crop-created/crop-created.domain-event';
import { CropDeletedDomainEvent } from '../events/crop-deleted/crop-deleted.domain-event';
import { CropUpdatedDomainEvent } from '../events/crop-updated/crop-updated.domain-event';
import { CropActualHarvestDateValueObject } from '../value-objects/crop-actual-harvest-date/crop-actual-harvest-date.value-object';
import { CropExpectedHarvestDateValueObject } from '../value-objects/crop-expected-harvest-date/crop-expected-harvest-date.value-object';
import { CropIdValueObject } from '../value-objects/crop-id/crop-id.value-object';
import { CropPlantingDateValueObject } from '../value-objects/crop-planting-date/crop-planting-date.value-object';
import { CropPlantingMethodValueObject } from '../value-objects/crop-planting-method/crop-planting-method.value-object';
import { CropStatusValueObject } from '../value-objects/crop-status/crop-status.value-object';
import { CropEntity } from './crop.entity';

describe('CropEntity', () => {
  const mockId = '123e4567-e89b-12d3-a456-426614174000';
  const mockPlotId = 'plot-123';
  const mockVarietyId = 'variety-456';
  const mockPlantingDate = new Date('2024-01-15');
  const mockExpectedHarvest = new Date('2024-06-15');
  const mockActualHarvest = new Date('2024-06-10');
  const mockQuantity = 100;
  const mockStatus = 'PLANTED';
  const mockPlantingMethod = 'DIRECT_SEEDING';
  const mockNotes = 'Test crop notes';

  let cropEntity: CropEntity;

  beforeEach(() => {
    cropEntity = new CropEntity({
      id: new CropIdValueObject(mockId),
      plotId: mockPlotId,
      varietyId: mockVarietyId,
      plantingDate: new CropPlantingDateValueObject(mockPlantingDate),
      expectedHarvest: new CropExpectedHarvestDateValueObject(
        mockExpectedHarvest,
      ),
      actualHarvest: new CropActualHarvestDateValueObject(mockActualHarvest),
      quantity: mockQuantity,
      status: new CropStatusValueObject(mockStatus),
      plantingMethod: new CropPlantingMethodValueObject(mockPlantingMethod),
      notes: mockNotes,
    });
  });

  describe('constructor', () => {
    it('should create a CropEntity with all required properties', () => {
      expect(cropEntity).toBeInstanceOf(CropEntity);
      expect(cropEntity.id.value).toBe(mockId);
      expect(cropEntity.plotId).toBe(mockPlotId);
      expect(cropEntity.varietyId).toBe(mockVarietyId);
      expect(cropEntity.plantingDate.value).toEqual(mockPlantingDate);
      expect(cropEntity.expectedHarvest.value).toEqual(mockExpectedHarvest);
      expect(cropEntity.actualHarvest.value).toEqual(mockActualHarvest);
      expect(cropEntity.quantity).toBe(mockQuantity);
      expect(cropEntity.status.value).toBe(mockStatus);
      expect(cropEntity.plantingMethod?.value).toBe(mockPlantingMethod);
      expect(cropEntity.notes).toBe(mockNotes);
      expect(cropEntity.createdAt).toBeInstanceOf(Date);
      expect(cropEntity.updatedAt).toBeInstanceOf(Date);
      expect(cropEntity.deletedAt).toBeUndefined();
      expect(cropEntity.isDeleted).toBe(false);
    });

    it('should create a CropEntity without optional properties', () => {
      const cropWithoutOptional = new CropEntity({
        id: new CropIdValueObject(mockId),
        plotId: mockPlotId,
        varietyId: mockVarietyId,
        plantingDate: new CropPlantingDateValueObject(mockPlantingDate),
        expectedHarvest: new CropExpectedHarvestDateValueObject(
          mockExpectedHarvest,
        ),
        actualHarvest: new CropActualHarvestDateValueObject(mockActualHarvest),
        quantity: mockQuantity,
        status: new CropStatusValueObject(mockStatus),
        notes: mockNotes,
      });

      expect(cropWithoutOptional.plantingMethod).toBeUndefined();
    });

    it('should emit CropCreatedDomainEvent when created', () => {
      const events = cropEntity.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CropCreatedDomainEvent);

      const createdEvent = events[0] as CropCreatedDomainEvent;
      expect(createdEvent.aggregateId).toBe(mockId);
      expect(createdEvent.plotId).toBe(mockPlotId);
      expect(createdEvent.varietyId).toBe(mockVarietyId);
      expect(createdEvent.quantity).toBe(mockQuantity);
      expect(createdEvent.status).toBe(mockStatus);
      expect(createdEvent.plantingMethod).toBe(mockPlantingMethod);
      expect(createdEvent.notes).toBe(mockNotes);
    });

    it('should not emit event when emitEvent is false', () => {
      const cropWithoutEvent = new CropEntity({
        id: new CropIdValueObject(mockId),
        plotId: mockPlotId,
        varietyId: mockVarietyId,
        plantingDate: new CropPlantingDateValueObject(mockPlantingDate),
        expectedHarvest: new CropExpectedHarvestDateValueObject(
          mockExpectedHarvest,
        ),
        actualHarvest: new CropActualHarvestDateValueObject(mockActualHarvest),
        quantity: mockQuantity,
        status: new CropStatusValueObject(mockStatus),
        notes: mockNotes,
        emitEvent: false,
      });

      const events = cropWithoutEvent.pullDomainEvents();
      expect(events).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update crop properties and emit CropUpdatedDomainEvent', () => {
      const updateData = {
        plotId: 'new-plot-123',
        varietyId: 'new-variety-456',
        quantity: 150,
        status: 'FINISHED',
        notes: 'Updated notes',
      };

      const updatedCrop = cropEntity.update(updateData);

      expect(updatedCrop).toBeInstanceOf(CropEntity);
      expect(updatedCrop.id.value).toBe(mockId);
      expect(updatedCrop.plotId).toBe(updateData.plotId);
      expect(updatedCrop.varietyId).toBe(updateData.varietyId);
      expect(updatedCrop.quantity).toBe(updateData.quantity);
      expect(updatedCrop.status.value).toBe(updateData.status);
      expect(updatedCrop.notes).toBe(updateData.notes);
      expect(updatedCrop.updatedAt.getTime()).toBeGreaterThan(
        cropEntity.updatedAt.getTime(),
      );

      const events = updatedCrop.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CropUpdatedDomainEvent);

      const updatedEvent = events[0] as CropUpdatedDomainEvent;
      expect(updatedEvent.aggregateId).toBe(mockId);
      expect(updatedEvent.plotId).toBe(updateData.plotId);
      expect(updatedEvent.varietyId).toBe(updateData.varietyId);
      expect(updatedEvent.quantity).toBe(updateData.quantity);
      expect(updatedEvent.status).toBe(updateData.status);
      expect(updatedEvent.notes).toBe(updateData.notes);
    });

    it('should update only provided properties', () => {
      const originalPlantingDate = cropEntity.plantingDate;
      const originalExpectedHarvest = cropEntity.expectedHarvest;
      const originalActualHarvest = cropEntity.actualHarvest;
      const originalPlantingMethod = cropEntity.plantingMethod;

      const updatedCrop = cropEntity.update({
        quantity: 200,
        notes: 'Only quantity and notes updated',
      });

      expect(updatedCrop.plantingDate).toEqual(originalPlantingDate);
      expect(updatedCrop.expectedHarvest).toEqual(originalExpectedHarvest);
      expect(updatedCrop.actualHarvest).toEqual(originalActualHarvest);
      expect(updatedCrop.plantingMethod).toEqual(originalPlantingMethod);
      expect(updatedCrop.quantity).toBe(200);
      expect(updatedCrop.notes).toBe('Only quantity and notes updated');
    });

    it('should update dates correctly', () => {
      const newPlantingDate = new Date('2024-02-15');
      const newExpectedHarvest = new Date('2024-07-15');
      const newActualHarvest = new Date('2024-07-10');

      const updatedCrop = cropEntity.update({
        plantingDate: newPlantingDate,
        expectedHarvest: newExpectedHarvest,
        actualHarvest: newActualHarvest,
      });

      expect(updatedCrop.plantingDate.value).toEqual(newPlantingDate);
      expect(updatedCrop.expectedHarvest.value).toEqual(newExpectedHarvest);
      expect(updatedCrop.actualHarvest.value).toEqual(newActualHarvest);
    });
  });

  describe('delete', () => {
    it('should mark crop as deleted and emit CropDeletedDomainEvent', () => {
      const deletedCrop = cropEntity.delete();

      expect(deletedCrop).toBeInstanceOf(CropEntity);
      expect(deletedCrop.id.value).toBe(mockId);
      expect(deletedCrop.isDeleted).toBe(true);
      expect(deletedCrop.deletedAt).toBeInstanceOf(Date);
      expect(deletedCrop.deletedAt!.getTime()).toBeGreaterThan(
        cropEntity.updatedAt.getTime(),
      );

      const events = deletedCrop.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CropDeletedDomainEvent);

      const deletedEvent = events[0] as CropDeletedDomainEvent;
      expect(deletedEvent.aggregateId).toBe(mockId);
    });
  });

  describe('domain events', () => {
    it('should add domain events correctly', () => {
      const events = cropEntity.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CropCreatedDomainEvent);
    });

    it('should clear domain events', () => {
      cropEntity.clearDomainEvents();
      const events = cropEntity.pullDomainEvents();
      expect(events).toHaveLength(0);
    });

    it('should pull domain events and clear them', () => {
      const events = cropEntity.pullDomainEvents();
      expect(events).toHaveLength(1);

      const eventsAfterPull = cropEntity.pullDomainEvents();
      expect(eventsAfterPull).toHaveLength(0);
    });
  });

  describe('toPrimitives', () => {
    it('should convert entity to primitives', () => {
      const primitives = cropEntity.toPrimitives();

      expect(primitives).toEqual({
        id: mockId,
        plotId: mockPlotId,
        varietyId: mockVarietyId,
        plantingDate: mockPlantingDate.toISOString(),
        expectedHarvest: mockExpectedHarvest.toISOString(),
        actualHarvest: mockActualHarvest.toISOString(),
        quantity: mockQuantity,
        status: mockStatus,
        plantingMethod: mockPlantingMethod,
        notes: mockNotes,
        createdAt: cropEntity.createdAt.toISOString(),
        updatedAt: cropEntity.updatedAt.toISOString(),
        deletedAt: undefined,
      });
    });

    it('should include deletedAt when crop is deleted', () => {
      const deletedCrop = cropEntity.delete();
      const primitives = deletedCrop.toPrimitives();

      expect(primitives.deletedAt).toBeDefined();
      expect(primitives.deletedAt).toBe(deletedCrop.deletedAt!.toISOString());
    });
  });

  describe('getters', () => {
    it('should return correct values for all getters', () => {
      expect(cropEntity.id.value).toBe(mockId);
      expect(cropEntity.plotId).toBe(mockPlotId);
      expect(cropEntity.varietyId).toBe(mockVarietyId);
      expect(cropEntity.plantingDate.value).toEqual(mockPlantingDate);
      expect(cropEntity.expectedHarvest.value).toEqual(mockExpectedHarvest);
      expect(cropEntity.actualHarvest.value).toEqual(mockActualHarvest);
      expect(cropEntity.quantity).toBe(mockQuantity);
      expect(cropEntity.status.value).toBe(mockStatus);
      expect(cropEntity.plantingMethod?.value).toBe(mockPlantingMethod);
      expect(cropEntity.notes).toBe(mockNotes);
      expect(cropEntity.createdAt).toBeInstanceOf(Date);
      expect(cropEntity.updatedAt).toBeInstanceOf(Date);
      expect(cropEntity.deletedAt).toBeUndefined();
      expect(cropEntity.isDeleted).toBe(false);
    });
  });
});
