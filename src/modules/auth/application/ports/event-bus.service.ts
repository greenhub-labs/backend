import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';

/**
 * EventBus Port
 *
 * Interface that defines the contract for publishing domain events.
 * This abstraction allows different implementations (NestJS EventBus, Kafka, etc.)
 * without coupling the application layer to specific infrastructure concerns.
 */
export interface EventBus {
  /**
   * Publishes a domain event to the event bus
   *
   * @param event - The domain event to publish
   * @throws {Error} When event publishing fails
   */
  publish(event: DomainEvent): Promise<void>;
}

/**
 * Dependency injection token for EventBus implementations
 */
export const EVENT_BUS_TOKEN = Symbol('EventBus');
