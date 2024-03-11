import { readConfig } from './readYaml';

export interface ServerConfig {
  port: number;
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
  },
  baichuan2: readConfig('baichuan2', {}),
  openai: readConfig('openai', {}),
  credentialEncrypt: readConfig('credentialEncrypt', {}),
  comfyui: readConfig('comfyui', {}),
  s3: readConfig('s3', {}),
};
