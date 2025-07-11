import { Injectable } from '@nestjs/common';
import { EventBus as NestEventBus } from '@nestjs/cqrs';
import { EventBus as AppEventBus } from '../ports/event-bus.service';
import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';

/**
 * NestjsEventBusService
 *
 * EventBus implementation using NestJS CQRS EventBus for in-memory event handling.
 * This service is used for publishing domain events to internal bounded contexts
 * and event handlers within the same application instance.
 *
 * @author GreenHub Labs
 */
@Injectable()
export class NestjsEventBusService implements AppEventBus {
  constructor(private readonly nestEventBus: NestEventBus) {}

  /**
   * Publishes a domain event using NestJS CQRS EventBus
   *
   * @param event - The domain event to publish
   */
  async publish(event: DomainEvent): Promise<void> {
    this.nestEventBus.publish(event);
  }
}
