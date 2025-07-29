import { BaseDomainEventSchema } from 'src/shared/domain/events/base-domain-event.schema';

/**
 * Schema for CropVarietyDeletedDomainEvent
 */
export class CropVarietyDeletedDomainEventSchema
  implements BaseDomainEventSchema
{
  eventId: string;
  aggregateId: string;
  occurredAt: string;
  version: number;
}
