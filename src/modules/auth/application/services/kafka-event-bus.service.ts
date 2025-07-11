import { Injectable } from '@nestjs/common';
import { EventBus } from '../ports/event-bus.service';
import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';

/**
 * KafkaEventBusService
 *
 * EventBus implementation for publishing authentication domain events to Kafka.
 * This service handles the distribution of auth-related events to other bounded contexts
 * and external systems for analytics, monitoring, and business process automation.
 *
 * Currently implements a logging stub - ready for real Kafka integration when needed.
 */
@Injectable()
export class KafkaEventBusService implements EventBus {
  /**
   * Publishes a domain event to Kafka
   *
   * @param event - The domain event to publish
   * @throws {Error} When Kafka publishing fails
   */
  async publish(event: DomainEvent): Promise<void> {
    try {
      // TODO: Implement real Kafka publishing logic
      // Example implementation:
      // const topic = this.getTopicForEvent(event);
      // await this.kafkaClient.send({
      //   topic,
      //   messages: [{
      //     key: event.aggregateId,
      //     value: JSON.stringify(event),
      //     headers: {
      //       eventType: event.constructor.name,
      //       version: event.version.toString(),
      //       occurredAt: event.occurredAt
      //     }
      //   }]
      // });

      console.log('[AuthKafkaEventBus] Publishing auth event to Kafka:', {
        eventType: event.constructor.name,
        eventId: event.eventId,
        aggregateId: event.aggregateId,
        occurredAt: event.occurredAt,
        version: event.version,
      });
    } catch (error) {
      console.error(
        '[AuthKafkaEventBus] Failed to publish event to Kafka:',
        error,
      );
      throw error;
    }
  }

  /**
   * Determines the appropriate Kafka topic for an event
   *
   * @param event - The domain event
   * @returns The Kafka topic name
   */
  private getTopicForEvent(event: DomainEvent): string {
    const eventName = event.constructor.name.replace('DomainEvent', '');
    return `auth.${eventName.toLowerCase()}`;
  }
}
