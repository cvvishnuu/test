import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SecretService } from '../cloudConductor/services/keyvault/secret.service';
import { KEY_VAULT_SECRET } from '../shared/constants/constants';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  private prisma: PrismaClient;

  constructor(private readonly keyVaultService: SecretService) {
    super();
    this.prisma = new PrismaClient();
  }

  async connect(): Promise<void> {
    const connectionString = await this.keyVaultService.getSecret(
      KEY_VAULT_SECRET.DB_CONNECTION_STRING,
    );
    console.log(connectionString);
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: connectionString,
        },
      },
    });
  }

  get client(): PrismaClient {
    return this.prisma;
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
