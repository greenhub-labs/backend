import { SEASON } from 'src/shared/domain/constants/season.constant';
import { CropVarietyCreatedDomainEvent } from '../events/crop-variety-created/crop-variety-created.domain-event';
import { CropVarietyDeletedDomainEvent } from '../events/crop-variety-deleted/crop-variety-deleted.domain-event';
import { CropVarietyUpdatedDomainEvent } from '../events/crop-variety-updated/crop-variety-updated.domain-event';
import { CropVarietyIdValueObject } from '../value-objects/crop-variety-id/crop-variety-id.value-object';
import { CropVarietyEntity } from './crop-variety.entity';

describe('CropVarietyEntity', () => {
  const mockId = '123e4567-e89b-12d3-a456-426614174000';
  const mockName = 'Tomato Roma';
  const mockScientificName = 'Solanum lycopersicum';
  const mockType = 'VEGETABLE';
  const mockDescription = 'A popular variety of tomato';
  const mockAverageYield = 2.5;
  const mockDaysToMaturity = 75;
  const mockPlantingDepth = 1.5;
  const mockSpacingBetween = 60;
  const mockWaterRequirements = 'Regular watering needed';
  const mockSunRequirements = 'Full sun';
  const mockMinIdealTemperature = 18;
  const mockMaxIdealTemperature = 30;
  const mockMinIdealPh = 6.0;
  const mockMaxIdealPh = 7.0;
  const mockCompatibleWith = ['Basil', 'Marigold'];
  const mockIncompatibleWith = ['Potato', 'Corn'];
  const mockPlantingSeasons = [SEASON.SPRING, SEASON.SUMMER];
  const mockHarvestSeasons = [SEASON.SUMMER, SEASON.AUTUMN];

  let cropVarietyEntity: CropVarietyEntity;

  beforeEach(() => {
    cropVarietyEntity = new CropVarietyEntity({
      id: new CropVarietyIdValueObject(mockId),
      name: mockName,
      scientificName: mockScientificName,
      type: mockType,
      description: mockDescription,
      averageYield: mockAverageYield,
      daysToMaturity: mockDaysToMaturity,
      plantingDepth: mockPlantingDepth,
      spacingBetween: mockSpacingBetween,
      waterRequirements: mockWaterRequirements,
      sunRequirements: mockSunRequirements,
      minIdealTemperature: mockMinIdealTemperature,
      maxIdealTemperature: mockMaxIdealTemperature,
      minIdealPh: mockMinIdealPh,
      maxIdealPh: mockMaxIdealPh,
      compatibleWith: mockCompatibleWith,
      incompatibleWith: mockIncompatibleWith,
      plantingSeasons: mockPlantingSeasons,
      harvestSeasons: mockHarvestSeasons,
    });
  });

  describe('constructor', () => {
    it('should create a CropVarietyEntity with all properties', () => {
      expect(cropVarietyEntity).toBeInstanceOf(CropVarietyEntity);
      expect(cropVarietyEntity.id.value).toBe(mockId);
      expect(cropVarietyEntity.name).toBe(mockName);
      expect(cropVarietyEntity.scientificName).toBe(mockScientificName);
      expect(cropVarietyEntity.type.value).toBe(mockType);
      expect(cropVarietyEntity.description).toBe(mockDescription);
      expect(cropVarietyEntity.averageYield).toBe(mockAverageYield);
      expect(cropVarietyEntity.daysToMaturity).toBe(mockDaysToMaturity);
      expect(cropVarietyEntity.plantingDepth).toBe(mockPlantingDepth);
      expect(cropVarietyEntity.spacingBetween).toBe(mockSpacingBetween);
      expect(cropVarietyEntity.waterRequirements).toBe(mockWaterRequirements);
      expect(cropVarietyEntity.sunRequirements).toBe(mockSunRequirements);
      expect(cropVarietyEntity.minIdealTemperature).toBe(
        mockMinIdealTemperature,
      );
      expect(cropVarietyEntity.maxIdealTemperature).toBe(
        mockMaxIdealTemperature,
      );
      expect(cropVarietyEntity.minIdealPh).toBe(mockMinIdealPh);
      expect(cropVarietyEntity.maxIdealPh).toBe(mockMaxIdealPh);
      expect(cropVarietyEntity.compatibleWith).toEqual(mockCompatibleWith);
      expect(cropVarietyEntity.incompatibleWith).toEqual(mockIncompatibleWith);
      expect(cropVarietyEntity.plantingSeasons).toHaveLength(2);
      expect(cropVarietyEntity.harvestSeasons).toHaveLength(2);
      expect(cropVarietyEntity.createdAt).toBeInstanceOf(Date);
      expect(cropVarietyEntity.updatedAt).toBeInstanceOf(Date);
      expect(cropVarietyEntity.deletedAt).toBeUndefined();
    });

    it('should create a CropVarietyEntity with minimal required properties', () => {
      const minimalVariety = new CropVarietyEntity({
        id: new CropVarietyIdValueObject(mockId),
        name: mockName,
        type: mockType,
        compatibleWith: [],
        incompatibleWith: [],
        plantingSeasons: [],
        harvestSeasons: [],
      });

      expect(minimalVariety.scientificName).toBeUndefined();
      expect(minimalVariety.description).toBeUndefined();
      expect(minimalVariety.averageYield).toBeUndefined();
      expect(minimalVariety.daysToMaturity).toBeUndefined();
      expect(minimalVariety.plantingDepth).toBeUndefined();
      expect(minimalVariety.spacingBetween).toBeUndefined();
      expect(minimalVariety.waterRequirements).toBeUndefined();
      expect(minimalVariety.sunRequirements).toBeUndefined();
      expect(minimalVariety.minIdealTemperature).toBeUndefined();
      expect(minimalVariety.maxIdealTemperature).toBeUndefined();
      expect(minimalVariety.minIdealPh).toBeUndefined();
      expect(minimalVariety.maxIdealPh).toBeUndefined();
    });

    it('should emit CropVarietyCreatedDomainEvent when created', () => {
      const events = cropVarietyEntity.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CropVarietyCreatedDomainEvent);

      const createdEvent = events[0] as CropVarietyCreatedDomainEvent;
      expect(createdEvent.aggregateId).toBe(mockId);
      expect(createdEvent.name).toBe(mockName);
      expect(createdEvent.scientificName).toBe(mockScientificName);
      expect(createdEvent.type).toBe(mockType);
      expect(createdEvent.description).toBe(mockDescription);
      expect(createdEvent.averageYield).toBe(mockAverageYield);
      expect(createdEvent.daysToMaturity).toBe(mockDaysToMaturity);
      expect(createdEvent.plantingDepth).toBe(mockPlantingDepth);
      expect(createdEvent.spacingBetween).toBe(mockSpacingBetween);
      expect(createdEvent.waterRequirements).toBe(mockWaterRequirements);
      expect(createdEvent.sunRequirements).toBe(mockSunRequirements);
      expect(createdEvent.minIdealTemperature).toBe(mockMinIdealTemperature);
      expect(createdEvent.maxIdealTemperature).toBe(mockMaxIdealTemperature);
      expect(createdEvent.minIdealPh).toBe(mockMinIdealPh);
      expect(createdEvent.maxIdealPh).toBe(mockMaxIdealPh);
      expect(createdEvent.compatibleWith).toEqual(mockCompatibleWith);
      expect(createdEvent.incompatibleWith).toEqual(mockIncompatibleWith);
      expect(createdEvent.plantingSeasons).toEqual(mockPlantingSeasons);
      expect(createdEvent.harvestSeasons).toEqual(mockHarvestSeasons);
    });

    it('should not emit event when emitEvent is false', () => {
      const varietyWithoutEvent = new CropVarietyEntity({
        id: new CropVarietyIdValueObject(mockId),
        name: mockName,
        type: mockType,
        compatibleWith: [],
        incompatibleWith: [],
        plantingSeasons: [],
        harvestSeasons: [],
        emitEvent: false,
      });

      const events = varietyWithoutEvent.pullDomainEvents();
      expect(events).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update variety properties and emit CropVarietyUpdatedDomainEvent', () => {
      const updateData = {
        name: 'Updated Tomato Roma',
        scientificName: 'Solanum lycopersicum var. roma',
        description: 'Updated description',
        averageYield: 3.0,
        daysToMaturity: 80,
        waterRequirements: 'Increased watering needed',
        compatibleWith: ['Basil', 'Marigold', 'Oregano'],
      };

      const updatedVariety = cropVarietyEntity.update(updateData);

      expect(updatedVariety).toBeInstanceOf(CropVarietyEntity);
      expect(updatedVariety.id.value).toBe(mockId);
      expect(updatedVariety.name).toBe(updateData.name);
      expect(updatedVariety.scientificName).toBe(updateData.scientificName);
      expect(updatedVariety.description).toBe(updateData.description);
      expect(updatedVariety.averageYield).toBe(updateData.averageYield);
      expect(updatedVariety.daysToMaturity).toBe(updateData.daysToMaturity);
      expect(updatedVariety.waterRequirements).toBe(
        updateData.waterRequirements,
      );
      expect(updatedVariety.compatibleWith).toEqual(updateData.compatibleWith);
      expect(updatedVariety.updatedAt.getTime()).toBeGreaterThanOrEqual(
        cropVarietyEntity.updatedAt.getTime(),
      );

      const events = updatedVariety.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CropVarietyUpdatedDomainEvent);

      const updatedEvent = events[0] as CropVarietyUpdatedDomainEvent;
      expect(updatedEvent.aggregateId).toBe(mockId);
      expect(updatedEvent.name).toBe(updateData.name);
      expect(updatedEvent.scientificName).toBe(updateData.scientificName);
      expect(updatedEvent.description).toBe(updateData.description);
      expect(updatedEvent.averageYield).toBe(updateData.averageYield);
      expect(updatedEvent.daysToMaturity).toBe(updateData.daysToMaturity);
      expect(updatedEvent.waterRequirements).toBe(updateData.waterRequirements);
      expect(updatedEvent.compatibleWith).toEqual(updateData.compatibleWith);
    });

    it('should update only provided properties', () => {
      const originalType = cropVarietyEntity.type;
      const originalPlantingSeasons = cropVarietyEntity.plantingSeasons;
      const originalHarvestSeasons = cropVarietyEntity.harvestSeasons;

      const updatedVariety = cropVarietyEntity.update({
        name: 'Only name updated',
        description: 'Only description updated',
      });

      expect(updatedVariety.type).toEqual(originalType);
      expect(updatedVariety.plantingSeasons).toEqual(originalPlantingSeasons);
      expect(updatedVariety.harvestSeasons).toEqual(originalHarvestSeasons);
      expect(updatedVariety.name).toBe('Only name updated');
      expect(updatedVariety.description).toBe('Only description updated');
    });

    it('should update seasons correctly', () => {
      const newPlantingSeasons = [SEASON.SPRING];
      const newHarvestSeasons = [SEASON.SUMMER];

      const updatedVariety = cropVarietyEntity.update({
        plantingSeasons: newPlantingSeasons,
        harvestSeasons: newHarvestSeasons,
      });

      expect(updatedVariety.plantingSeasons).toHaveLength(1);
      expect(updatedVariety.plantingSeasons[0].value).toBe(SEASON.SPRING);
      expect(updatedVariety.harvestSeasons).toHaveLength(1);
      expect(updatedVariety.harvestSeasons[0].value).toBe(SEASON.SUMMER);
    });

    it('should update temperature and pH ranges correctly', () => {
      const newMinTemp = 15;
      const newMaxTemp = 35;
      const newMinPh = 5.5;
      const newMaxPh = 7.5;

      const updatedVariety = cropVarietyEntity.update({
        minIdealTemperature: newMinTemp,
        maxIdealTemperature: newMaxTemp,
        minIdealPh: newMinPh,
        maxIdealPh: newMaxPh,
      });

      expect(updatedVariety.minIdealTemperature).toBe(newMinTemp);
      expect(updatedVariety.maxIdealTemperature).toBe(newMaxTemp);
      expect(updatedVariety.minIdealPh).toBe(newMinPh);
      expect(updatedVariety.maxIdealPh).toBe(newMaxPh);
    });
  });

  describe('delete', () => {
    it('should mark variety as deleted and emit CropVarietyDeletedDomainEvent', () => {
      const deletedVariety = cropVarietyEntity.delete();

      expect(deletedVariety).toBeInstanceOf(CropVarietyEntity);
      expect(deletedVariety.id.value).toBe(mockId);
      expect(deletedVariety.deletedAt).toBeInstanceOf(Date);
      expect(deletedVariety.deletedAt!.getTime()).toBeGreaterThanOrEqual(
        cropVarietyEntity.updatedAt.getTime(),
      );

      const events = deletedVariety.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CropVarietyDeletedDomainEvent);

      const deletedEvent = events[0] as CropVarietyDeletedDomainEvent;
      expect(deletedEvent.aggregateId).toBe(mockId);
    });
  });

  describe('domain events', () => {
    it('should add domain events correctly', () => {
      const events = cropVarietyEntity.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CropVarietyCreatedDomainEvent);
    });

    it('should clear domain events', () => {
      cropVarietyEntity.clearDomainEvents();
      const events = cropVarietyEntity.pullDomainEvents();
      expect(events).toHaveLength(0);
    });

    it('should pull domain events and clear them', () => {
      const events = cropVarietyEntity.pullDomainEvents();
      expect(events).toHaveLength(1);

      const eventsAfterPull = cropVarietyEntity.pullDomainEvents();
      expect(eventsAfterPull).toHaveLength(0);
    });
  });

  describe('toPrimitives', () => {
    it('should convert entity to primitives', () => {
      const primitives = cropVarietyEntity.toPrimitives();

      expect(primitives).toEqual({
        id: mockId,
        name: mockName,
        scientificName: mockScientificName,
        type: mockType,
        description: mockDescription,
        averageYield: mockAverageYield,
        daysToMaturity: mockDaysToMaturity,
        plantingDepth: mockPlantingDepth,
        spacingBetween: mockSpacingBetween,
        waterRequirements: mockWaterRequirements,
        sunRequirements: mockSunRequirements,
        minIdealTemperature: mockMinIdealTemperature,
        maxIdealTemperature: mockMaxIdealTemperature,
        minIdealPh: mockMinIdealPh,
        maxIdealPh: mockMaxIdealPh,
        compatibleWith: mockCompatibleWith,
        incompatibleWith: mockIncompatibleWith,
        plantingSeasons: mockPlantingSeasons,
        harvestSeasons: mockHarvestSeasons,
        createdAt: cropVarietyEntity.createdAt.toISOString(),
        updatedAt: cropVarietyEntity.updatedAt.toISOString(),
        deletedAt: undefined,
      });
    });

    it('should include deletedAt when variety is deleted', () => {
      const deletedVariety = cropVarietyEntity.delete();
      const primitives = deletedVariety.toPrimitives();

      expect(primitives.deletedAt).toBeDefined();
      expect(primitives.deletedAt).toBe(
        deletedVariety.deletedAt!.toISOString(),
      );
    });
  });

  describe('getters', () => {
    it('should return correct values for all getters', () => {
      expect(cropVarietyEntity.id.value).toBe(mockId);
      expect(cropVarietyEntity.name).toBe(mockName);
      expect(cropVarietyEntity.scientificName).toBe(mockScientificName);
      expect(cropVarietyEntity.type.value).toBe(mockType);
      expect(cropVarietyEntity.description).toBe(mockDescription);
      expect(cropVarietyEntity.averageYield).toBe(mockAverageYield);
      expect(cropVarietyEntity.daysToMaturity).toBe(mockDaysToMaturity);
      expect(cropVarietyEntity.plantingDepth).toBe(mockPlantingDepth);
      expect(cropVarietyEntity.spacingBetween).toBe(mockSpacingBetween);
      expect(cropVarietyEntity.waterRequirements).toBe(mockWaterRequirements);
      expect(cropVarietyEntity.sunRequirements).toBe(mockSunRequirements);
      expect(cropVarietyEntity.minIdealTemperature).toBe(
        mockMinIdealTemperature,
      );
      expect(cropVarietyEntity.maxIdealTemperature).toBe(
        mockMaxIdealTemperature,
      );
      expect(cropVarietyEntity.minIdealPh).toBe(mockMinIdealPh);
      expect(cropVarietyEntity.maxIdealPh).toBe(mockMaxIdealPh);
      expect(cropVarietyEntity.compatibleWith).toEqual(mockCompatibleWith);
      expect(cropVarietyEntity.incompatibleWith).toEqual(mockIncompatibleWith);
      expect(cropVarietyEntity.plantingSeasons).toHaveLength(2);
      expect(cropVarietyEntity.harvestSeasons).toHaveLength(2);
      expect(cropVarietyEntity.createdAt).toBeInstanceOf(Date);
      expect(cropVarietyEntity.updatedAt).toBeInstanceOf(Date);
      expect(cropVarietyEntity.deletedAt).toBeUndefined();
    });
  });
});
