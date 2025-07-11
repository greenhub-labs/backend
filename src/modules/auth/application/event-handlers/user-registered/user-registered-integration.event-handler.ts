import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredDomainEvent } from 'src/modules/auth/domain/events/user-registered/user-registered.domain-event';
import { KafkaEventBusService } from '../../services/kafka-event-bus.service';
import { UserRegisteredIntegrationEvent } from '../../events/user-registered/user-registered.integration-event copy';

/**
 * Event handler that listens to UserRegisteredDomainEvent and publishes a UserRegisteredIntegrationEvent to Kafka
 */
@Injectable()
@EventsHandler(UserRegisteredDomainEvent)
export class UserRegisteredIntegrationEventHandler
  implements IEventHandler<UserRegisteredDomainEvent>
{
  constructor(private readonly kafkaEventBus: KafkaEventBusService) {}

  /**
   * Handles the domain event and publishes the integration event
   * @param event - The UserRegisteredDomainEvent
   */
  async handle(event: UserRegisteredDomainEvent): Promise<void> {
    const integrationEvent = new UserRegisteredIntegrationEvent({
      eventId: event.eventId,
      aggregateId: event.aggregateId,
      occurredAt: event.occurredAt,
      email: event.email,
      ipAddress: event.registrationInfo?.ipAddress,
      userAgent: event.registrationInfo?.userAgent,
      sessionId: event.registrationInfo?.source,
      version: event.version,
    });
    await this.kafkaEventBus.publish(integrationEvent);
  }
}
