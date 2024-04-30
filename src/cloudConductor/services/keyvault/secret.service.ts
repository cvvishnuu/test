import { Injectable } from '@nestjs/common';
import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';

@Injectable()
export class SecretService {
  private readonly client: SecretClient;
  private readonly vaultUrl = process.env.KEYVAULT_URL!;
  constructor() {
    this.client = new SecretClient(this.vaultUrl, new DefaultAzureCredential());
  }

  async getSecret(secretName: string): Promise<string> {
    const secret = await this.client.getSecret(secretName);
    return secret.value;
  }
}
