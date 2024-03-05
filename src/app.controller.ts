import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { config } from './common/config';
import {
  ApiType,
  AuthType,
  CredentialAuthType,
  MenifestJson,
  SchemaVersion,
} from './common/interfaces';

@Controller()
export class AppController {
  constructor() {}

  @Get('/manifest.json')
  @ApiExcludeEndpoint()
  public getManifestJson(): MenifestJson {
    return {
      schema_version: SchemaVersion.v1,
      namespace: 'monkeys_tools_nodejs',
      auth: {
        type: AuthType.none,
      },
      api: {
        type: ApiType.openapi,
        url: `http://127.0.0.1:${config.server.port}/openapi-json`,
      },
      contact_email: 'dev@inf-monkeys.com',
      credentials: [
        {
          name: 'dysms',
          type: CredentialAuthType.AKSK,
          logo: 'https://static.aside.fun/upload/frame/a0QyJc.png',
          displayName: '阿里云短信账号',
          properties: [
            {
              displayName: 'accessKeyId',
              name: 'accessKeyId',
              type: 'string',
              required: true,
            },
            {
              displayName: 'accessKeySecret',
              name: 'accessKeySecret',
              type: 'string',
              default: '',
              required: true,
            },
            {
              displayName: 'regionId',
              name: 'regionId',
              type: 'string',
              default: 'cn-beijing',
              required: true,
            },
          ],
        },
      ],
      credentialEncryptKey: config.credentialEncrypt.publicKey,
    };
  }
}
