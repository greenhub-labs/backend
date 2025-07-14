import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';

/**
 * Port for the Event Bus service (Dependency Inversion)
 * Defines the contract for publishing domain events.
 */
export interface EventBusServicePort {
  /**
   * Publishes a domain event
   * @param event - The domain event to publish
   */
  publish(event: DomainEvent): Promise<void>;
}
