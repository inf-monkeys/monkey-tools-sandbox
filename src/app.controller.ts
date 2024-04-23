import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { config } from './common/config';
import { ApiType, MenifestJson, SchemaVersion } from './common/interfaces';

@Controller()
export class AppController {
  constructor() {}

  @Get('/manifest.json')
  @ApiExcludeEndpoint()
  public getManifestJson(): MenifestJson {
    return {
      schema_version: SchemaVersion.v1,
      display_name: '基础工具',
      namespace: 'common',
      auth: config.server.auth,
      api: {
        type: ApiType.openapi,
        url: `/openapi-json`,
      },
      contact_email: 'dev@inf-monkeys.com',
    };
  }
}
