/**
 * IntegrationEvent
 *
 * Interfaz base para todos los eventos de integración publicados hacia sistemas externos.
 * Garantiza la presencia de metadatos mínimos para trazabilidad y versionado.
 */
export interface IntegrationEvent {
  /**
   * Identificador único del evento de integración
   */
  readonly eventId: string;
  /**
   * Identificador de la entidad relacionada (aggregateId, userId, etc.)
   */
  readonly aggregateId: string;
  /**
   * Fecha/hora de creación del evento (ISO string)
   */
  readonly occurredAt: string;
  /**
   * Versión del evento para evolución de esquemas
   */
  readonly version: number;
  /**
   * Tipo de evento (opcional, útil para deserialización)
   */
  readonly eventType?: string;
}
