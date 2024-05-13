import { ClusterNode, RedisOptions, SentinelAddress } from 'ioredis';
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
    runTimeout?: number;
    compileTimeout?: number;
  };
}

export interface GoApiConfig {
  apikey: string;
}

export enum RedisMode {
  standalone = 'standalone',
  cluster = 'cluster',
  sentinel = 'sentinel',
}

export interface RedisConfig {
  mode: RedisMode;

  // Standalone config
  url?: string;

  // Cluster config
  nodes?: ClusterNode[];

  // Sentinel config
  sentinels?: Array<Partial<SentinelAddress>>;
  sentinelName?: string;

  // Common config
  prefix: string;
  options?: RedisOptions;
}

export interface Config {
  server: ServerConfig;
  sandbox: SandboxConfig;
  redis: RedisConfig;
}

const port = readConfig('server.port', 8001);

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
      runTimeout: readConfig('sandbox.piston.runTimeout', 3000),
      compileTimeout: readConfig('sandbox.piston.compileTimeout', 10000),
    },
  },
  redis: {
    mode: readConfig('redis.mode', RedisMode.standalone),
    // Standalone config
    url: readConfig('redis.url'),
    // Cluster config
    nodes: readConfig('redis.nodes', []),
    // Sentinel config
    sentinels: readConfig('redis.sentinels', []),
    sentinelName: readConfig('redis.sentinelName'),
    // Common config
    prefix: readConfig('redis.prefix', 'monkeys:'),
    options: readConfig('redis.options', {}),
  },
};

export const isRedisConfigured = () => {
  if (config.redis.mode === RedisMode.standalone) {
    return !!config.redis.url;
  }
  if (config.redis.mode === RedisMode.cluster) {
    return !!config.redis.nodes.length;
  }
  if (config.redis.mode === RedisMode.sentinel) {
    return !!config.redis.sentinels.length && !!config.redis.sentinelName;
  }
  return false;
};

const validateConfig = () => {
  if (config.server.auth.type === AuthType.service_http) {
    if (!config.server.auth.verification_tokens['monkeys']) {
      throw new Error(
        'Invalid Config: auth.bearerToken must not empty when auth.type is service_http',
      );
    }
  }
  if (config.redis.mode === RedisMode.cluster && !config.redis.nodes.length) {
    throw new Error('Redis cluster mode requires at least one node');
  }
  if (config.redis.mode === RedisMode.sentinel) {
    if (!config.redis.sentinels.length) {
      throw new Error(
        'Redis sentinel mode requires at least one sentinel node',
      );
    }
    if (!config.redis.sentinelName) {
      throw new Error('Redis sentinel mode requires a sentinel name');
    }
  }
};

validateConfig();
