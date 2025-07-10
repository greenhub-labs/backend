import { UserCreatedDomainEvent } from './user-created.domain-event';
import { UserCreatedDomainEventV1Schema } from './user-created.schema';

describe('UserCreatedDomainEvent', () => {
  /**
   * Should construct a valid UserCreatedDomainEvent and match the schema
   */
  it('should construct a valid event and match the schema', () => {
    const now = new Date().toISOString();
    const event = new UserCreatedDomainEvent({
      eventId: 'evt-123',
      aggregateId: 'user-456',
      firstName: 'Alice',
      lastName: 'Smith',
      bio: 'Gardener',
      avatar: 'https://avatar.com/alice.png',
      occurredAt: now,
    });
    const schema: UserCreatedDomainEventV1Schema = {
      eventId: 'evt-123',
      aggregateId: 'user-456',
      firstName: 'Alice',
      lastName: 'Smith',
      bio: 'Gardener',
      avatar: 'https://avatar.com/alice.png',
      occurredAt: now,
      version: 1,
    };
    expect(event).toBeInstanceOf(UserCreatedDomainEvent);
    expect(event.eventId).toBe(schema.eventId);
    expect(event.aggregateId).toBe(schema.aggregateId);
    expect(event.firstName).toBe(schema.firstName);
    expect(event.lastName).toBe(schema.lastName);
    expect(event.bio).toBe(schema.bio);
    expect(event.avatar).toBe(schema.avatar);
    expect(event.occurredAt).toBe(schema.occurredAt);
    expect(event.version).toBe(1);
  });

  /**
   * Should be immutable
   */
  it('should be immutable', () => {
    const event = new UserCreatedDomainEvent({
      eventId: 'event-1',
      aggregateId: 'agg-1',
      occurredAt: new Date().toISOString(),
      version: 1,
      userId: 'user-1',
    });
    // @ts-expect-error
    event.eventId = 'changed';
    expect(event.eventId).toBe('event-1');
  });
});
