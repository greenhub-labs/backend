import { UserDeletedDomainEvent } from './user-deleted.domain-event';
import { UserDeletedDomainEventV1Schema } from './user-deleted.schema';

describe('UserDeletedDomainEvent', () => {
  /**
   * Should construct a valid UserDeletedDomainEvent and match the schema
   */
  it('should construct a valid event and match the schema', () => {
    const now = new Date().toISOString();
    const event = new UserDeletedDomainEvent({
      eventId: 'evt-789',
      aggregateId: 'user-999',
      occurredAt: now,
    });
    const schema: UserDeletedDomainEventV1Schema = {
      eventId: 'evt-789',
      aggregateId: 'user-999',
      occurredAt: now,
      version: 1,
    };
    expect(event).toBeInstanceOf(UserDeletedDomainEvent);
    expect(event.eventId).toBe(schema.eventId);
    expect(event.aggregateId).toBe(schema.aggregateId);
    expect(event.occurredAt).toBe(schema.occurredAt);
    expect(event.version).toBe(1);
  });

  /**
   * Should be immutable
   */
  it('should be immutable', () => {
    const event = new UserDeletedDomainEvent({
      eventId: 'evt-immutable',
      aggregateId: 'user-immutable',
      occurredAt: new Date().toISOString(),
    });
    expect(() => {
      // @ts-expect-error
      event.eventId = 'changed';
    }).toThrow();
  });
});
