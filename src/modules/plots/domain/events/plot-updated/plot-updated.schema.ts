import { BaseDomainEventSchema } from 'src/shared/domain/events/base-domain-event.schema';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';

/**
 * Schema for FarmUpdatedDomainEvent
 */
export class PlotUpdatedDomainEventSchema implements BaseDomainEventSchema {
  eventId: string;
  aggregateId: string;
  occurredAt: string;
  version: number;
  name: string;
  description?: string;
  width?: number;
  length?: number;
  height?: number;
  area?: number;
  perimeter?: number;
  volume?: number;
  unitMeasurement?: UNIT_MEASUREMENT;
  status?: string;
  soilType?: string;
  soilPh?: number;
  farmId?: string;
}
