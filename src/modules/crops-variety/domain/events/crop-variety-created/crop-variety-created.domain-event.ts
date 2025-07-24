import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';

/**
 * Domain event emitted when a Crop Variety is created.
 */
export class CropVarietyCreatedDomainEvent implements DomainEvent {
  /** Unique event identifier */
  readonly eventId: string;
  /** Aggregate (Crop Variety) identifier */
  readonly aggregateId: string;
  /** Date and time when the event occurred */
  readonly occurredAt: string;
  /** Event version */
  readonly version: number = 1;

  /** Name */
  readonly name: string;
  /** Scientific name */
  readonly scientificName?: string;
  /** Type */
  readonly type: string;
  /** Description */
  readonly description?: string;
  /** Average yield */
  readonly averageYield?: number;
  /** Days to maturity */
  readonly daysToMaturity?: number;
  /** Planting depth */
  readonly plantingDepth?: number;
  /** Spacing between */
  readonly spacingBetween?: number;
  /** Water requirements */
  readonly waterRequirements?: string;
  /** Sun requirements */
  readonly sunRequirements?: string;
  /** Ideal temperature (min) */
  readonly minIdealTemperature?: number;
  /** Ideal temperature (max) */
  readonly maxIdealTemperature?: number;
  /** Ideal pH (min) */
  readonly minIdealPh?: number;
  /** Ideal pH (max) */
  readonly maxIdealPh?: number;
  /** Compatible with */
  readonly compatibleWith?: string[];
  /** Incompatible with */
  readonly incompatibleWith?: string[];
  /** Planting seasons */
  readonly plantingSeasons?: string[];
  /** Harvest seasons */
  readonly harvestSeasons?: string[];

  /**
   * Creates a new PlotCreatedDomainEvent
   * @param params - Event properties
   */
  constructor(params: {
    eventId: string;
    aggregateId: string;
    occurredAt: string;
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
    plantingSeasons?: string[];
    harvestSeasons?: string[];
  }) {
    this.eventId = params.eventId;
    this.aggregateId = params.aggregateId;
    this.occurredAt = params.occurredAt;
    this.name = params.name;
    this.scientificName = params.scientificName;
    this.type = params.type;
    this.description = params.description;
    this.averageYield = params.averageYield;
    this.daysToMaturity = params.daysToMaturity;
    this.plantingDepth = params.plantingDepth;
    this.spacingBetween = params.spacingBetween;
    this.waterRequirements = params.waterRequirements;
    this.sunRequirements = params.sunRequirements;
    this.minIdealTemperature = params.minIdealTemperature;
    this.maxIdealTemperature = params.maxIdealTemperature;
    this.minIdealPh = params.minIdealPh;
    this.maxIdealPh = params.maxIdealPh;
    this.compatibleWith = params.compatibleWith;
    this.incompatibleWith = params.incompatibleWith;
    this.plantingSeasons = params.plantingSeasons;
    this.harvestSeasons = params.harvestSeasons;
  }
}
