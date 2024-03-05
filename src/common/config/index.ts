import { readConfig } from './readYaml';

export interface ServerConfig {
  port: number;
}

export interface Baichuan2Config {
  baseUrl?: string;
  modelPath?: string;
}

export interface Config {
  server: ServerConfig;
  baichuan2: Baichuan2Config;
}

const port = readConfig('server.port', 3001);

export const config: Config = {
  server: {
    port,
  },
  baichuan2: readConfig('baichuan2', {}),
};
