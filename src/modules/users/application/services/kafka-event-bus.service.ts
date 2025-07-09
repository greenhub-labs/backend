import { Injectable } from '@nestjs/common';
import { EventBus } from '../ports/event-bus.service';
import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';

/**
 * EventBus implementation for publishing domain events to Kafka
 * (Stub: logs the event, ready for real integration)
 */
@Injectable()
export class KafkaEventBusService implements EventBus {
  async publish(event: DomainEvent): Promise<void> {
    // TODO: Implement real Kafka publishing logic
    console.log('[KafkaEventBus] Publishing event to Kafka:', event);
  }
}
