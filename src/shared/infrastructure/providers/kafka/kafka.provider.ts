import { Provider } from '@nestjs/common';
import { Kafka, KafkaConfig } from 'kafkajs';

export const KAFKA_CLIENT = 'KAFKA_CLIENT';

const kafkaConfig: KafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID || 'greenhub-app',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  ssl: process.env.KAFKA_SSL === 'true',
  sasl:
    process.env.KAFKA_SASL_USERNAME && process.env.KAFKA_SASL_PASSWORD
      ? {
          mechanism: (process.env.KAFKA_SASL_MECHANISM as any) || 'plain',
          username: process.env.KAFKA_SASL_USERNAME,
          password: process.env.KAFKA_SASL_PASSWORD,
        }
      : undefined,
};

export const KafkaProvider: Provider = {
  provide: KAFKA_CLIENT,
  useFactory: () => {
    return new Kafka(kafkaConfig);
  },
};
