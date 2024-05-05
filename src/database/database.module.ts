import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecretService } from '../cloudConductor/services/keyvault/secret.service';
import { DATABASE_CONFIG } from '../shared/constants/constants';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [SecretService, ConfigService],
      useFactory: async (
        secretService: SecretService,
        configService: ConfigService,
      ) => {
        const dbConfig: {
          host: string;
          database: string;
          port: number;
          tenantId: string;
        } = JSON.parse(await secretService.getSecret(DATABASE_CONFIG));
        return {
          type: 'mssql',
          host: dbConfig.host,
          port: dbConfig.port,
          database: dbConfig.database,
          authentication: {
            type: 'azure-active-directory-service-principal-secret',
            options: {
              clientId: configService.getOrThrow<string>('AZURE_CLIENT_ID'),
              clientSecret: configService.getOrThrow<string>(
                'AZURE_CLIENT_SECRET',
              ),
              tenantId: dbConfig.tenantId,
            },
          },
          synchronize: false,
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
