import { Injectable, Inject } from '@nestjs/common';
import { EventBus } from '../ports/event-bus.service';
import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';
import { KAFKA_CLIENT } from 'src/shared/infrastructure/providers/kafka/kafka.provider';
import { Kafka } from 'kafkajs';

/**
 * EventBus implementation for publishing events (domain or integration) to Kafka
 */
@Injectable()
export class KafkaEventBusService implements EventBus {
  constructor(@Inject(KAFKA_CLIENT) private readonly kafka: Kafka) {}

  /**
   * Publishes an event (domain or integration) to Kafka
   * @param event - The event to publish
   */
  async publish(event: any): Promise<void> {
    const producer = this.kafka.producer();
    await producer.connect();
    const topic = this.getTopicForEvent(event);
    await producer.send({
      topic,
      messages: [
        {
          key: event.aggregateId || event.userId,
          value: JSON.stringify(event),
          headers: {
            eventType: event.constructor?.name || event.constructor.name,
            version: event.version?.toString() || '1',
            occurredAt:
              event.occurredAt?.toString() ||
              event.createdAt ||
              new Date().toISOString(),
          },
        },
      ],
    });
    await producer.disconnect();
  }

  /**
   * Determines the appropriate Kafka topic for an event
   * @param event - The domain event
   * @returns The Kafka topic name
   */
  private getTopicForEvent(event: any): string {
    const eventName =
      event.constructor?.name
        ?.replace('DomainEvent', '')
        .replace('IntegrationEvent', '') || 'event';
    // Si es integración, topic users.integration
    if (event.constructor?.name?.endsWith('IntegrationEvent')) {
      return `users.integration.${eventName.toLowerCase()}`;
    }
    return `users.${eventName.toLowerCase()}`;
  }
}
