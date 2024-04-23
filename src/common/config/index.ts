import { AuthConfig, AuthType } from '../interfaces';
import { readConfig } from './readYaml';

export interface ServerConfig {
  port: number;
  auth: AuthConfig;
}

export interface Baichuan2Config {
  baseUrl?: string;
  modelPath?: string;
}

export interface OpenAIConfig {
  baseUrl: string;
  apiKey: string;
}

export interface CredentialEncryptConfig {
  publicKey: string;
  privateKey: string;
}

export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  region: string;
  modelBucketName: string;
  assetsBucketName: string;
  assetsBucketPublicUrl: string;
}

export interface SandboxConfig {
  engine: 'piston';
  piston?: {
    apiServer: string;
    resultServer: string;
  };
}

export interface GoApiConfig {
  apikey: string;
}

export interface RedisConfig {
  url: string;
  prefix: string;
}

export interface Config {
  server: ServerConfig;
  sandbox: SandboxConfig;
  redis: RedisConfig;
}

const port = readConfig('server.port', 3001);

export const config: Config = {
  server: {
    port,
    auth: {
      type: readConfig('server.auth.type', AuthType.none),
      authorization_type: 'bearer',
      verification_tokens: {
        monkeys: readConfig('server.auth.bearerToken'),
      },
    },
  },
  sandbox: {
    engine: 'piston',
    piston: {
      apiServer: readConfig(
        'sandbox.piston.apiServer',
        'http://localhost:2000',
      ),
      resultServer: readConfig(
        'sandbox.piston.resultServer',
        `http://localhost:${port}`,
      ),
    },
  },
  redis: {
    url: readConfig('redis.url'),
    prefix: readConfig('redis.prefix', 'monkeys:'),
  },
};

const validateConfig = () => {
  if (config.server.auth.type === AuthType.service_http) {
    if (!config.server.auth.verification_tokens['monkeys']) {
      throw new Error(
        'Invalid Config: auth.bearerToken must not empty when auth.type is service_http',
      );
    }
  }
};

validateConfig();
