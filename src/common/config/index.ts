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

export interface ComfyUICofig {
  baseUrl: string;
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

export interface Config {
  server: ServerConfig;
  baichuan2: Baichuan2Config;
  openai: OpenAIConfig;
  credentialEncrypt: CredentialEncryptConfig;
  comfyui: ComfyUICofig;
  s3: S3Config;
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
  baichuan2: readConfig('baichuan2', {}),
  openai: readConfig('openai', {}),
  credentialEncrypt: readConfig('credentialEncrypt', {}),
  comfyui: {
    baseUrl: readConfig('comfyui.baseUrl', 'http://127.0.0.1:8188'),
  },
  s3: readConfig('s3', {}),
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
