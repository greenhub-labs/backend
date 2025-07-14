import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';
import { FARM_MEMBERSHIP_ROLES } from '../../constants/farm-membership-roles.constant';

/**
 * Domain event emitted when a user is assigned to a farm.
 * @extends DomainEvent
 */
export class UserAssignedToFarmDomainEvent implements DomainEvent {
  /** Unique event identifier */
  readonly eventId: string;
  /** Aggregate (Farm) identifier */
  readonly aggregateId: string;
  /** User identifier assigned to the farm */
  readonly userId: string;
  /** Role assigned to the user */
  readonly role: FARM_MEMBERSHIP_ROLES;
  /** Date and time when the event occurred */
  readonly occurredAt: string;
  /** Event version */
  readonly version: number = 1;

  /**
   * Creates a new UserAssignedToFarmDomainEvent
   * @param params - Event properties
   */
  constructor(params: {
    eventId: string;
    aggregateId: string;
    userId: string;
    role: FARM_MEMBERSHIP_ROLES;
    occurredAt: string;
  }) {
    this.eventId = params.eventId;
    this.aggregateId = params.aggregateId;
    this.userId = params.userId;
    this.role = params.role;
    this.occurredAt = params.occurredAt;
  }
}
