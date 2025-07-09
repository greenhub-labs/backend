import { UserUpdatedDomainEvent } from './user-updated.domain-event';
import { UserUpdatedDomainEventV1Schema } from './user-updated.schema';

describe('UserUpdatedDomainEvent', () => {
  /**
   * Should construct a valid UserUpdatedDomainEvent and match the schema
   */
  it('should construct a valid event and match the schema', () => {
    const now = new Date().toISOString();
    const event = new UserUpdatedDomainEvent({
      eventId: 'evt-456',
      aggregateId: 'user-789',
      firstName: 'Bob',
      lastName: 'Johnson',
      bio: 'Farmer',
      avatar: 'https://avatar.com/bob.png',
      occurredAt: now,
    });
    const schema: UserUpdatedDomainEventV1Schema = {
      eventId: 'evt-456',
      aggregateId: 'user-789',
      firstName: 'Bob',
      lastName: 'Johnson',
      bio: 'Farmer',
      avatar: 'https://avatar.com/bob.png',
      occurredAt: now,
      version: 1,
    };
    expect(event).toBeInstanceOf(UserUpdatedDomainEvent);
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
    const event = new UserUpdatedDomainEvent({
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
