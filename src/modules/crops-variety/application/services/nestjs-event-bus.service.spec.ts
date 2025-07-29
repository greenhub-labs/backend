import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';
import { NestjsEventBusService } from './nestjs-event-bus.service';

describe('NestjsEventBusService', () => {
  let service: NestjsEventBusService;
  let nestEventBus: jest.Mocked<EventBus>;

  const mockDomainEvent: DomainEvent = {
    eventId: 'event-123',
    aggregateId: 'aggregate-456',
    occurredAt: new Date().toISOString(),
    version: 1,
  };

  beforeEach(async () => {
    const mockNestEventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NestjsEventBusService,
        {
          provide: EventBus,
          useValue: mockNestEventBus,
        },
      ],
    }).compile();

    service = module.get<NestjsEventBusService>(NestjsEventBusService);
    nestEventBus = module.get(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('publish', () => {
    it('should publish domain event successfully', async () => {
      // Arrange
      nestEventBus.publish.mockResolvedValue(undefined);

      // Act
      await service.publish(mockDomainEvent);

      // Assert
      expect(nestEventBus.publish).toHaveBeenCalledWith(mockDomainEvent);
      expect(nestEventBus.publish).toHaveBeenCalledTimes(1);
    });

    it('should handle publish errors', async () => {
      // Arrange
      const error = new Error('Event bus error');
      nestEventBus.publish.mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      await expect(service.publish(mockDomainEvent)).rejects.toThrow(error);
      expect(nestEventBus.publish).toHaveBeenCalledWith(mockDomainEvent);
    });

    it('should publish multiple events in sequence', async () => {
      // Arrange
      const mockEvent1: DomainEvent = {
        eventId: 'event-1',
        aggregateId: 'aggregate-1',
        occurredAt: new Date().toISOString(),
        version: 1,
      };
      const mockEvent2: DomainEvent = {
        eventId: 'event-2',
        aggregateId: 'aggregate-2',
        occurredAt: new Date().toISOString(),
        version: 1,
      };

      nestEventBus.publish.mockResolvedValue(undefined);

      // Act
      await service.publish(mockEvent1);
      await service.publish(mockEvent2);

      // Assert
      expect(nestEventBus.publish).toHaveBeenCalledTimes(2);
      expect(nestEventBus.publish).toHaveBeenNthCalledWith(1, mockEvent1);
      expect(nestEventBus.publish).toHaveBeenNthCalledWith(2, mockEvent2);
    });

    it('should handle events with different structures', async () => {
      // Arrange
      const complexEvent = {
        eventId: 'complex-event-123',
        aggregateId: 'complex-aggregate-456',
        occurredAt: new Date().toISOString(),
        version: 2,
        additionalData: 'test data',
        metadata: {
          source: 'test',
          timestamp: Date.now(),
        },
      } as DomainEvent;

      nestEventBus.publish.mockResolvedValue(undefined);

      // Act
      await service.publish(complexEvent);

      // Assert
      expect(nestEventBus.publish).toHaveBeenCalledWith(complexEvent);
    });
  });
});
