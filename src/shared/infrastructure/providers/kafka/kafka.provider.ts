import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, KafkaConfig } from 'kafkajs';

export const KAFKA_CLIENT = 'KAFKA_CLIENT';

export const KafkaProvider: Provider = {
  provide: KAFKA_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const kafkaConfig: KafkaConfig = {
      clientId: configService.get<string>('KAFKA_CLIENT_ID', 'greenhub-app'),
      brokers: configService
        .get<string>('KAFKA_BROKERS', 'localhost:29092')
        .split(','),
      ssl: configService.get<string>('KAFKA_SSL') === 'true',
      sasl:
        configService.get<string>('KAFKA_SASL_USERNAME') &&
        configService.get<string>('KAFKA_SASL_PASSWORD')
          ? {
              mechanism:
                (configService.get<string>('KAFKA_SASL_MECHANISM') as any) ||
                'plain',
              username: configService.get<string>('KAFKA_SASL_USERNAME'),
              password: configService.get<string>('KAFKA_SASL_PASSWORD'),
            }
          : undefined,
    };
    return new Kafka(kafkaConfig);
  },
};
