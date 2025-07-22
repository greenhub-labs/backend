/**
 * EventBus interface for publishing domain events
 * Allows for different implementations (in-memory, Kafka, etc.)
 */
export interface EventBus {
  publish(event: any): Promise<void>;
}
