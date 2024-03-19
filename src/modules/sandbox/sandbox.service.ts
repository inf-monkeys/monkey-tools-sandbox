import { config } from '@/common/config';
import { Injectable } from '@nestjs/common';
import { PistonClient } from 'piston-api-client';

@Injectable()
export class SandboxService {
  constructor() {}

  public async runInVM(
    language: string,
    sourceCode: string,
    parameters?: { [x: string]: any },
  ) {
    const url = config.sandbox.pistonApiUrl;
    if (!url) {
      throw new Error('SandBox url is not configured');
    }

    const args = parameters
      ? Object.keys(parameters).map((key) => JSON.stringify(parameters[key]))
      : [];

    const client = new PistonClient({ server: url });
    const result = await client.execute({
      language,
      version: '*',
      files: [
        {
          content: sourceCode,
        },
      ],
      args,
    });
    if (result.success) {
      console.log(result.data);
      // {
      //   "run": {
      //     "stdout": "[ 'Hello', 'World' ]\n",
      //     "stderr": "",
      //     "code": 0,
      //     "signal": null,
      //     "output": "[ 'Hello', 'World' ]\n"
      //   },
      //   "language": "javascript",
      //   "version": "16.3.0"
      // }
      return result;
    } else {
      throw new Error(`执行自定义代码失败`);
    }
  }
}
