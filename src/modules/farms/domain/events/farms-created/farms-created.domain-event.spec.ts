import { __Name@pascalcase__CreatedDomainEvent } from './farms-created.domain-event';
import { __Name@pascalcase__CreatedDomainEventV1Schema } from './farms-created.schema';

describe('__Name@pascalcase__CreatedDomainEvent', () => {
  it('should construct a valid event and match the schema', () => {
    const now = new Date().toISOString();
    const event = new __Name@pascalcase__CreatedDomainEvent({
      eventId: 'evt-123',
      aggregateId: 'agg-456',
      occurredAt: now,
      // Add more properties here if needed
    });
    const schema: __Name@pascalcase__CreatedDomainEventV1Schema = {
      eventId: 'evt-123',
      aggregateId: 'agg-456',
      occurredAt: now,
      version: 1,
      // Add more properties here if needed
    };
    expect(event).toBeInstanceOf(__Name@pascalcase__CreatedDomainEvent);
    expect(event.eventId).toBe(schema.eventId);
    expect(event.aggregateId).toBe(schema.aggregateId);
    expect(event.occurredAt).toBe(schema.occurredAt);
    expect(event.version).toBe(1);
  });

  it('should be immutable', () => {
    const event = new __Name@pascalcase__CreatedDomainEvent({
      eventId: 'event-1',
      aggregateId: 'agg-1',
      occurredAt: new Date().toISOString(),
    });
    // @ts-expect-error: test immutability
    event.eventId = 'changed';
    expect(event.eventId).toBe('event-1');
  });
}); 