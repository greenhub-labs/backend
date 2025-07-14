import { Injectable } from "@nestjs/common";
import { EventBus as NestEventBus } from "@nestjs/cqrs";
import { EventBus as AppEventBus } from "../ports/event-bus.service";
import { DomainEvent } from "src/shared/domain/events/domain-event.interface";

/**
 * EventBus implementation using NestJS CQRS EventBus (in-memory)
 */
@Injectable()
export class NestjsEventBusService implements AppEventBus {
  constructor(private readonly nestEventBus: NestEventBus) {}

  async publish(event: DomainEvent): Promise<void> {
    this.nestEventBus.publish(event);
  }
}
