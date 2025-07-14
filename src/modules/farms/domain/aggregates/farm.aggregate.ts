import { FarmEntity } from '../entities/farm.entity';

/**
 * Aggregate root for the Farm domain.
 * Coordinates all changes and invariants for the Farm and its entities.
 */
export class FarmAggregate extends FarmEntity {
  /**
   * Example method to register a domain event when the farm is created.
   */
  farmCreated(): void {
    // this.domainEvents.push(new FarmCreatedDomainEvent(this.id, ...));
    // Implement domain event logic here
  }

  // Add more aggregate-specific logic and invariants here
}
