import { BaseDomainEventSchema } from 'src/shared/domain/events/base-domain-event.schema';

/**
 * Schema for FarmDeletedDomainEvent
 */
export class FarmDeletedDomainEventSchema implements BaseDomainEventSchema {
  eventId: string;
  aggregateId: string;
  occurredAt: string;
  version: number;
  name: string;
  description?: string;
}
