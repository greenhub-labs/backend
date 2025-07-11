import { Injectable, Inject } from '@nestjs/common';
import { EventBus } from '../ports/event-bus.service';
import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';
import { KAFKA_CLIENT } from 'src/shared/infrastructure/providers/kafka/kafka.provider';
import { Kafka } from 'kafkajs';

/**
 * KafkaEventBusService
 *
 * EventBus implementation for publishing authentication domain events to Kafka.
 * This service handles the distribution of auth-related events to other bounded contexts
 * and external systems for analytics, monitoring, and business process automation.
 */
@Injectable()
export class KafkaEventBusService implements EventBus {
  constructor(@Inject(KAFKA_CLIENT) private readonly kafka: Kafka) {}

  /**
   * Publishes a domain event to Kafka
   *
   * @param event - The domain event to publish
   * @throws {Error} When Kafka publishing fails
   */
  async publish(event: DomainEvent): Promise<void> {
    try {
      const producer = this.kafka.producer();
      await producer.connect();
      const topic = this.getTopicForEvent(event);
      await producer.send({
        topic,
        messages: [
          {
            key: event.aggregateId,
            value: JSON.stringify(event),
            headers: {
              eventType: event.constructor.name,
              version: event.version?.toString() || '1',
              occurredAt:
                event.occurredAt?.toString() || new Date().toISOString(),
            },
          },
        ],
      });
      await producer.disconnect();
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
