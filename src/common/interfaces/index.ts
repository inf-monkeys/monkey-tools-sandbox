import { BlockDefProperties } from '@inf-monkeys/vines';

export enum AuthType {
  none = 'none',
}

export enum ApiType {
  openapi = 'openapi',
}

export enum SchemaVersion {
  v1 = 'v1',
}

export enum CredentialAuthType {
  AKSK = 'AKSK',
  OAUTH2 = 'OAUTH2',
}

export interface CredentialDefinition {
  name: string;
  displayName: string;
  properties: BlockDefProperties[];
  logo: string;
  type: CredentialAuthType;
}

export interface MenifestJson {
  schema_version: SchemaVersion;
  namespace: string;
  auth: {
    type: AuthType;
  };
  api: {
    type: ApiType;
    url: string;
  };
  contact_email: string;
  credentials?: CredentialDefinition[];
  credentialEncryptKey?: string;
}
