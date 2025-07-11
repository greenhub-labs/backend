import { UserRestoredDomainEvent } from './user-restored.domain-event';
import { UserRestoredDomainEventV1Schema } from './user-restored.schema';

describe('UserRestoredDomainEvent', () => {
  /**
   * Should construct a valid UserRestoredDomainEvent and match the schema
   */
  it('should construct a valid event and match the schema', () => {
    const now = new Date().toISOString();
    const event = new UserRestoredDomainEvent({
      eventId: 'evt-restore-1',
      aggregateId: 'user-restore-1',
      occurredAt: now,
    });
    const schema: UserRestoredDomainEventV1Schema = {
      eventId: 'evt-restore-1',
      aggregateId: 'user-restore-1',
      occurredAt: now,
      version: 1,
    };
    expect(event).toBeInstanceOf(UserRestoredDomainEvent);
    expect(event.eventId).toBe(schema.eventId);
    expect(event.aggregateId).toBe(schema.aggregateId);
    expect(event.occurredAt).toBe(schema.occurredAt);
    expect(event.version).toBe(1);
  });

  /**
   * Should be immutable
   */
  it('should be immutable', () => {
    const event = new UserRestoredDomainEvent({
      eventId: 'event-1',
      aggregateId: 'agg-1',
      occurredAt: new Date().toISOString(),
      version: 1,
    });
    // @ts-expect-error: test immutability
    event.eventId = 'changed';
    expect(event.eventId).toBe('event-1');
  });
});
