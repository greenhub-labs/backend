import { BaseDomainEventSchema } from 'src/shared/domain/events/base-domain-event.schema';

/**
 * Schema for FarmCreatedDomainEvent
 */
export class FarmCreatedDomainEventSchema implements BaseDomainEventSchema {
  eventId: string;
  aggregateId: string;
  occurredAt: string;
  version: number;
  name: string;
  description?: string;
}
