/**
 * Event bus port for publishing domain events.
 * Add more methods as needed for your use case.
 */
export interface EventBusService {
  /** Publish a domain event */
  publish(event: any): Promise<void>;
  // Add more methods here if needed
}
