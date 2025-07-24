import { BaseDomainEventSchema } from 'src/shared/domain/events/base-domain-event.schema';

/**
 * Schema for CropVarietyUpdatedDomainEvent
 */
export class CropVarietyUpdatedDomainEventSchema
  implements BaseDomainEventSchema
{
  eventId: string;
  aggregateId: string;
  occurredAt: string;
  version: number;
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
}
