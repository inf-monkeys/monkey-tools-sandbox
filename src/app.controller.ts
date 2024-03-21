import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { config } from './common/config';
import {
  ApiType,
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
      display_name: '基础工具',
      namespace: 'monkey_tools_nodejs',
      auth: config.server.auth,
      api: {
        type: ApiType.openapi,
        url: `/openapi-json`,
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
