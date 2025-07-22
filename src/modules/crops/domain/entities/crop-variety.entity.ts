import { SEASON } from 'src/shared/domain/constants/season.constant';
import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';
import { CropVarietyCreatedDomainEvent } from '../events/crop-variety-created/crop-variety-created.domain-event';
import { CropVarietyDeletedDomainEvent } from '../events/crop-variety-deleted/crop-variety-deleted.domain-event';
import { CropVarietyUpdatedDomainEvent } from '../events/crop-variety-updated/crop-variety-updated.domain-event';
import { CropVarietyPrimitive } from '../primitives/crop-variety.primitive';
import { CropVarietyIdValueObject } from '../value-objects/crop-variety-id/crop-variety-id.value-object';
import { CropVarietySeasonValueObject } from '../value-objects/crop-variety-season/crop-variety-season.value-object';
import { CropVarietyTypeValueObject } from '../value-objects/crop-variety-type/crop-variety-type.value-object';

/**
 * Entity representing a Crop Variety in the domain.
 */
export class CropVarietyEntity {
  /** Unique identifier of the crop variety */
  private readonly _id: CropVarietyIdValueObject;
  /** Common name */
  private readonly _name: string;
  /** Scientific name */
  private readonly _scientificName?: string;
  /** Crop type */
  private readonly _type: CropVarietyTypeValueObject;
  /** Description */
  private readonly _description?: string;
  /** Average yield (kg/m²) */
  private readonly _averageYield?: number;
  /** Days to maturity */
  private readonly _daysToMaturity?: number;
  /** Planting depth (cm) */
  private readonly _plantingDepth?: number;
  /** Spacing between plants (cm) */
  private readonly _spacingBetween?: number;
  /** Water requirements */
  private readonly _waterRequirements?: string;
  /** Sun requirements */
  private readonly _sunRequirements?: string;
  /** Ideal temperature (min) */
  private readonly _minIdealTemperature?: number;
  /** Ideal temperature (max) */
  private readonly _maxIdealTemperature?: number;
  /** Ideal pH (min) */
  private readonly _minIdealPh?: number;
  /** Ideal pH (max) */
  private readonly _maxIdealPh?: number;
  /** Compatible plants */
  private readonly _compatibleWith: string[];
  /** Incompatible plants */
  private readonly _incompatibleWith: string[];
  /** Planting seasons */
  private readonly _plantingSeasons: CropVarietySeasonValueObject[];
  /** Harvest seasons */
  private readonly _harvestSeasons: CropVarietySeasonValueObject[];
  /** Creation date */
  private readonly _createdAt: Date;
  /** Last update date */
  private readonly _updatedAt: Date;
  /** Soft delete date */
  private readonly _deletedAt?: Date;
  private readonly domainEvents: DomainEvent[] = [];

  /**
   * Creates a new CropVarietyEntity and emits CropVarietyCreatedDomainEvent
   * @param params - Crop variety properties
   */
  constructor(params: {
    id: CropVarietyIdValueObject;
    name: string;
    scientificName?: string;
    type: string;
    description?: string;
    averageYield?: number;
    daysToMaturity?: number;
    plantingDepth?: number;
    spacingBetween?: number;
    waterRequirements?: string;
    sunRequirements?: string;
    minIdealTemperature?: number;
    maxIdealTemperature?: number;
    minIdealPh?: number;
    maxIdealPh?: number;
    compatibleWith: string[];
    incompatibleWith: string[];
    plantingSeasons: SEASON[];
    harvestSeasons: SEASON[];
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    emitEvent?: boolean;
  }) {
    this._id = params.id;
    this._name = params.name;
    this._scientificName = params.scientificName;
    this._type = new CropVarietyTypeValueObject(params.type);
    this._description = params.description;
    this._averageYield = params.averageYield;
    this._daysToMaturity = params.daysToMaturity;
    this._plantingDepth = params.plantingDepth;
    this._spacingBetween = params.spacingBetween;
    this._waterRequirements = params.waterRequirements;
    this._sunRequirements = params.sunRequirements;
    this._minIdealTemperature = params.minIdealTemperature;
    this._maxIdealTemperature = params.maxIdealTemperature;
    this._minIdealPh = params.minIdealPh;
    this._maxIdealPh = params.maxIdealPh;
    this._compatibleWith = params.compatibleWith ?? [];
    this._incompatibleWith = params.incompatibleWith ?? [];
    this._plantingSeasons = (params.plantingSeasons ?? []).map(
      (season) => new CropVarietySeasonValueObject(season),
    );
    this._harvestSeasons = (params.harvestSeasons ?? []).map(
      (season) => new CropVarietySeasonValueObject(season),
    );
    this._createdAt = params.createdAt ?? new Date();
    this._updatedAt = params.updatedAt ?? new Date();
    this._deletedAt = params.deletedAt;
    // Emit event only if not restoring from persistence
    if (params.emitEvent !== false) {
      this.addDomainEvent(
        new CropVarietyCreatedDomainEvent({
          eventId: crypto.randomUUID(),
          aggregateId: this._id.value,
          occurredAt: this._createdAt.toISOString(),
          name: this._name,
          type: this._type.value,
        }),
      );
    }
  }

  /**
   * Updates the crop variety with the given data (immutable) and emits CropVarietyUpdatedDomainEvent
   * @param data - The data to update the crop variety with
   * @returns A new CropVarietyEntity instance with the updated data
   */
  update(
    data: Partial<{
      name: string;
      scientificName?: string;
      type: string;
      description?: string;
      averageYield?: number;
      daysToMaturity?: number;
      plantingDepth?: number;
      spacingBetween?: number;
      waterRequirements?: string;
      sunRequirements?: string;
      minIdealTemperature?: number;
      maxIdealTemperature?: number;
      minIdealPh?: number;
      maxIdealPh?: number;
      compatibleWith?: string[];
      incompatibleWith?: string[];
      plantingSeasons?: SEASON[];
      harvestSeasons?: SEASON[];
    }>,
  ): CropVarietyEntity {
    const updated = new CropVarietyEntity({
      id: this._id,
      name: data.name ?? this._name,
      scientificName: data.scientificName ?? this._scientificName,
      type: data.type ?? this._type.value,
      description: data.description ?? this._description,
      averageYield: data.averageYield ?? this._averageYield,
      daysToMaturity: data.daysToMaturity ?? this._daysToMaturity,
      plantingDepth: data.plantingDepth ?? this._plantingDepth,
      spacingBetween: data.spacingBetween ?? this._spacingBetween,
      waterRequirements: data.waterRequirements ?? this._waterRequirements,
      sunRequirements: data.sunRequirements ?? this._sunRequirements,
      minIdealTemperature:
        data.minIdealTemperature ?? this._minIdealTemperature,
      maxIdealTemperature:
        data.maxIdealTemperature ?? this._maxIdealTemperature,
      minIdealPh: data.minIdealPh ?? this._minIdealPh,
      maxIdealPh: data.maxIdealPh ?? this._maxIdealPh,
      compatibleWith: data.compatibleWith ?? this._compatibleWith,
      incompatibleWith: data.incompatibleWith ?? this._incompatibleWith,
      plantingSeasons:
        data.plantingSeasons ??
        (this._plantingSeasons.map((s) => s.value) as SEASON[]),
      harvestSeasons:
        data.harvestSeasons ??
        (this._harvestSeasons.map((s) => s.value) as SEASON[]),
      createdAt: this._createdAt,
      updatedAt: new Date(),
      deletedAt: this._deletedAt,
      emitEvent: false,
    });
    updated.addDomainEvent(
      new CropVarietyUpdatedDomainEvent({
        eventId: crypto.randomUUID(),
        aggregateId: updated._id.value,
        occurredAt: updated._updatedAt.toISOString(),
        name: updated._name,
        type: updated._type.value,
      }),
    );
    return updated;
  }

  /**
   * Marks the crop variety as deleted (soft delete) and emits CropVarietyDeletedDomainEvent
   * @returns A new CropVarietyEntity instance marked as deleted
   */
  delete(): CropVarietyEntity {
    const deleted = new CropVarietyEntity({
      id: this._id,
      name: this._name,
      scientificName: this._scientificName,
      type: this._type.value,
      description: this._description,
      averageYield: this._averageYield,
      daysToMaturity: this._daysToMaturity,
      plantingDepth: this._plantingDepth,
      spacingBetween: this._spacingBetween,
      waterRequirements: this._waterRequirements,
      sunRequirements: this._sunRequirements,
      minIdealTemperature: this._minIdealTemperature,
      maxIdealTemperature: this._maxIdealTemperature,
      minIdealPh: this._minIdealPh,
      maxIdealPh: this._maxIdealPh,
      compatibleWith: this._compatibleWith,
      incompatibleWith: this._incompatibleWith,
      plantingSeasons: this._plantingSeasons.map((s) => s.value) as SEASON[],
      harvestSeasons: this._harvestSeasons.map((s) => s.value) as SEASON[],
      createdAt: this._createdAt,
      updatedAt: new Date(),
      deletedAt: new Date(),
      emitEvent: false,
    });
    deleted.addDomainEvent(
      new CropVarietyDeletedDomainEvent({
        eventId: crypto.randomUUID(),
        aggregateId: deleted._id.value,
        occurredAt: deleted._updatedAt.toISOString(),
      }),
    );
    return deleted;
  }

  /**
   * Adds a domain event to the internal collection
   * @param event - The domain event to add
   */
  protected addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  /**
   * Returns and clears all accumulated domain events
   * @returns The list of domain events
   */
  public pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.clearDomainEvents();
    return events;
  }

  /**
   * Clears all accumulated domain events
   */
  public clearDomainEvents(): void {
    (this.domainEvents as DomainEvent[]).length = 0;
  }

  /**
   * Converts the CropVarietyEntity to its primitive representation
   */
  toPrimitives(): CropVarietyPrimitive {
    return {
      id: this._id.value,
      name: this._name,
      scientificName: this._scientificName,
      type: this._type.value,
      description: this._description,
      averageYield: this._averageYield,
      daysToMaturity: this._daysToMaturity,
      plantingDepth: this._plantingDepth,
      spacingBetween: this._spacingBetween,
      waterRequirements: this._waterRequirements,
      sunRequirements: this._sunRequirements,
      minIdealTemperature: this._minIdealTemperature,
      maxIdealTemperature: this._maxIdealTemperature,
      minIdealPh: this._minIdealPh,
      maxIdealPh: this._maxIdealPh,
      compatibleWith: this._compatibleWith,
      incompatibleWith: this._incompatibleWith,
      plantingSeasons: this._plantingSeasons.map(
        (season) => season.value,
      ) as SEASON[],
      harvestSeasons: this._harvestSeasons.map(
        (season) => season.value,
      ) as SEASON[],
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
      deletedAt: this._deletedAt?.toISOString(),
    };
  }

  get id(): CropVarietyIdValueObject {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get scientificName(): string | undefined {
    return this._scientificName;
  }

  get type(): CropVarietyTypeValueObject {
    return this._type;
  }

  get description(): string | undefined {
    return this._description;
  }

  get averageYield(): number | undefined {
    return this._averageYield;
  }

  get daysToMaturity(): number | undefined {
    return this._daysToMaturity;
  }

  get plantingDepth(): number | undefined {
    return this._plantingDepth;
  }

  get spacingBetween(): number | undefined {
    return this._spacingBetween;
  }

  get waterRequirements(): string | undefined {
    return this._waterRequirements;
  }

  get sunRequirements(): string | undefined {
    return this._sunRequirements;
  }

  get minIdealTemperature(): number | undefined {
    return this._minIdealTemperature;
  }

  get maxIdealTemperature(): number | undefined {
    return this._maxIdealTemperature;
  }

  get minIdealPh(): number | undefined {
    return this._minIdealPh;
  }

  get maxIdealPh(): number | undefined {
    return this._maxIdealPh;
  }

  get compatibleWith(): string[] {
    return this._compatibleWith;
  }

  get incompatibleWith(): string[] {
    return this._incompatibleWith;
  }

  get plantingSeasons(): CropVarietySeasonValueObject[] {
    return this._plantingSeasons;
  }

  get harvestSeasons(): CropVarietySeasonValueObject[] {
    return this._harvestSeasons;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }
}
