import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedDomainEvent } from 'src/modules/users/domain/events/user-created/user-created.domain-event';
import { KafkaEventBusService } from '../services/kafka-event-bus.service';
import { UserCreatedIntegrationEvent } from '../events/user-created.integration-event';

/**
 * Event handler that listens to UserCreatedDomainEvent and publishes a UserCreatedIntegrationEvent to Kafka
 */
@Injectable()
@EventsHandler(UserCreatedDomainEvent)
export class UserCreatedIntegrationEventHandler
  implements IEventHandler<UserCreatedDomainEvent>
{
  constructor(private readonly kafkaEventBus: KafkaEventBusService) {}

  /**
   * Handles the domain event and publishes the integration event
   * @param event - The UserCreatedDomainEvent
   */
  async handle(event: UserCreatedDomainEvent): Promise<void> {
    const integrationEvent = new UserCreatedIntegrationEvent({
      eventId: event.eventId,
      aggregateId: event.aggregateId,
      occurredAt: event.occurredAt,
      userId: event.aggregateId,
      name: [event.firstName, event.lastName].filter(Boolean).join(' '),
      email: undefined,
      version: event.version,
    });
    await this.kafkaEventBus.publish(integrationEvent);
  }
}
