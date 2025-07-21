import { BaseDomainEventSchema } from 'src/shared/domain/events/base-domain-event.schema';

/**
 * Schema for CropUpdatedDomainEvent
 */
export class CropUpdatedDomainEventSchema implements BaseDomainEventSchema {
  eventId: string;
  aggregateId: string;
  occurredAt: string;
  version: number;
  plotId: string;
  varietyId: string;
  plantingDate?: string;
  expectedHarvest?: string;
  actualHarvest?: string;
  quantity?: number;
  status?: string;
  plantingMethod?: string;
  notes?: string;
}
