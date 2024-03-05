import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { config } from './common/config';
import {
  ApiType,
  AuthType,
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
    };
  }
}
