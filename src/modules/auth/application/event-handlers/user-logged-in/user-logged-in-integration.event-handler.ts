import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserLoggedInDomainEvent } from 'src/modules/auth/domain/events/user-logged-in/user-logged-in.domain-event';
import { KafkaEventBusService } from '../../services/kafka-event-bus.service';
import { UserLoggedInIntegrationEvent } from '../../events/user-logged-in/user-logged-in.integration-event';

// TODO: Remove this because we are not using Kafka for internal events

/**
 * Event handler that listens to UserLoggedInDomainEvent and publishes a UserLoggedInIntegrationEvent to Kafka
 */
@Injectable()
@EventsHandler(UserLoggedInDomainEvent)
export class UserLoggedInIntegrationEventHandler
  implements IEventHandler<UserLoggedInDomainEvent>
{
  constructor(private readonly kafkaEventBus: KafkaEventBusService) {}

  /**
   * Handles the domain event and publishes the integration event
   * @param event - The UserLoggedInDomainEvent
   */
  async handle(event: UserLoggedInDomainEvent): Promise<void> {
    const integrationEvent = new UserLoggedInIntegrationEvent({
      eventId: event.eventId,
      aggregateId: event.aggregateId,
      occurredAt: event.occurredAt,
      email: event.email,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      sessionId: event.sessionId,
      version: event.version,
    });
    await this.kafkaEventBus.publish(integrationEvent);
  }
}
