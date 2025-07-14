import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';
import { FarmsIdValueObject } from '../value-objects/farms-id/farms-id.value-object';

/**
 * Farms Entity (Aggregate Root)
 * Basic DDD Clean Architecture entity template
 */
export class Farms {
  // TODO: Add value objects and properties here
  public readonly id: FarmsIdValueObject;

  private readonly domainEvents: DomainEvent[] = [];

  constructor(id?: FarmsIdValueObject /*, other props */) {
    this.id = id ?? new FarmsIdValueObject();
    // TODO: Initialize other properties
  }

  /**
   * Updates the entity with the given data
   */
  update(data: Partial<any>): Farms {
    // TODO: Implement update logic
    // id should not be updated
    return this;
  }

  /**
   * Marks the entity as deleted (soft delete)
   */
  delete(): Farms {
    // TODO: Implement delete logic
    return this;
  }

  /**
   * Converts the entity instance to a primitive object
   * @returns A primitive object
   */
  toPrimitives(): any { // TODO: Replace 'any' with the correct primitive type
    return {
      id: this.id.value,
      // TODO: Map other properties to primitives
    };
  }

  /**
   * Adds a domain event to the internal collection
   */
  protected addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  /**
   * Returns and clears all accumulated domain events
   */
  public pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.clearDomainEvents();
    return events;
  }

  /**
   * Clears all accumulated domain events
   */
  public clearDomainEvents(): void {
    (this.domainEvents as DomainEvent[]).length = 0;
  }
} 