import { IntegrationEvent } from 'src/shared/application/events/integration-event.interface';

/**
 * UserCreatedIntegrationEvent
 *
 * Evento de integración publicado cuando se crea un usuario, para consumo por sistemas externos.
 * Este evento es estable y desacoplado del evento de dominio interno.
 */
export class UserCreatedIntegrationEvent implements IntegrationEvent {
  /** Identificador único del evento de integración */
  readonly eventId: string;
  /** Identificador de la entidad relacionada (userId) */
  readonly aggregateId: string;
  /** Fecha/hora de creación del evento (ISO string) */
  readonly occurredAt: string;
  /** Versión del evento para evolución de esquemas */
  readonly version: number = 1;
  /** Tipo de evento (opcional) */
  readonly eventType?: string = 'UserCreatedIntegrationEvent';

  /**
   * Identificador único del usuario
   */
  readonly userId: string;
  /**
   * Nombre del usuario
   */
  readonly name: string;
  /**
   * Email del usuario (si aplica)
   */
  readonly email?: string;

  /**
   * Crea un nuevo evento de integración UserCreatedIntegrationEvent
   * @param params - Parámetros del evento
   */
  constructor(params: {
    eventId: string;
    aggregateId: string;
    occurredAt: string;
    userId: string;
    name: string;
    email?: string;
    version?: number;
    eventType?: string;
  }) {
    this.eventId = params.eventId;
    this.aggregateId = params.aggregateId;
    this.occurredAt = params.occurredAt;
    this.version = params.version ?? 1;
    this.eventType = params.eventType ?? 'UserCreatedIntegrationEvent';
    this.userId = params.userId;
    this.name = params.name;
    this.email = params.email;
  }
}
