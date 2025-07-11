import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { KAFKA_CLIENT } from 'src/shared/infrastructure/providers/kafka/kafka.provider';
import { REDIS_CLIENT } from 'src/shared/infrastructure/redis/provider/redis.provider';
import { PrismaClient } from '@prisma/client';
import { Kafka } from 'kafkajs';
import Redis from 'ioredis';

/**
 * StartupCheckService
 *
 * Verifica la conexión a Kafka, Prisma y Redis al arrancar la app.
 * Si alguna dependencia crítica no está disponible tras varios reintentos, detiene el arranque.
 */
@Injectable()
export class StartupCheckService implements OnModuleInit {
  private readonly logger = new Logger(StartupCheckService.name);
  private readonly maxRetries = 5;
  private readonly retryDelayMs = 2000;

  constructor(
    @Inject(KAFKA_CLIENT) private readonly kafka: Kafka,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly prisma: PrismaClient,
  ) {}

  async onModuleInit() {
    await this.checkWithRetry('Kafka', this.checkKafka.bind(this));
    await this.checkWithRetry('Prisma', this.checkPrisma.bind(this));
    await this.checkWithRetry('Redis', this.checkRedis.bind(this));
    this.logger.log(
      'All critical dependencies are connected. App startup continues.',
    );
  }

  private async checkWithRetry(name: string, checkFn: () => Promise<void>) {
    let attempt = 0;
    while (attempt < this.maxRetries) {
      try {
        await checkFn();
        this.logger.log(`${name} connection OK`);
        return;
      } catch (err) {
        attempt++;
        this.logger.warn(
          `${name} connection failed (attempt ${attempt}/${this.maxRetries}): ${err.message}`,
        );
        if (attempt >= this.maxRetries) {
          this.logger.error(
            `${name} connection failed after ${this.maxRetries} attempts. Exiting.`,
          );
          process.exit(1);
        }
        await new Promise((res) => setTimeout(res, this.retryDelayMs));
      }
    }
  }

  private async checkKafka() {
    const admin = this.kafka.admin();
    await admin.connect();
    await admin.disconnect();
  }

  private async checkPrisma() {
    await this.prisma.$connect();
    await this.prisma.$disconnect();
  }

  private async checkRedis() {
    await this.redis.ping();
  }
}
