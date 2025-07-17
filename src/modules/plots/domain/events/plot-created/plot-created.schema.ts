import { BaseDomainEventSchema } from 'src/shared/domain/events/base-domain-event.schema';

/**
 * Schema for PlotCreatedDomainEvent
 */
export class PlotCreatedDomainEventSchema implements BaseDomainEventSchema {
  eventId: string;
  aggregateId: string;
  occurredAt: string;
  version: number;
  name: string;
  description?: string;
  width?: number;
  length?: number;
  area?: number;
  perimeter?: number;
  status?: string;
  soilType?: string;
  soilPh?: number;
  farmId?: string;
}
