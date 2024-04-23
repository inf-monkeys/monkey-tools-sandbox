import { CacheManager } from '@/common/cache';
import { CACHE_TOKEN } from '@/common/common.module';
import { config } from '@/common/config';
import { logger } from '@/common/logger';
import { sleep } from '@/common/utils';
import { indentString } from '@/common/utils/indent-string';
import { Inject, Injectable } from '@nestjs/common';
import { PistonClient, PistonExecuteResult } from 'piston-api-client';
import * as uuid from 'uuid';

@Injectable()
export class SandboxService {
  constructor(@Inject(CACHE_TOKEN) private readonly cache: CacheManager) {}

  public getResultKey(taskId: string) {
    return `${config.redis.prefix}sandbox:result:${taskId}`;
  }

  private async waitForResult(taskId: string, timeoutMs: number) {
    const resultKey = this.getResultKey(taskId);
    const start = Date.now();
    while (true) {
      const result = await this.cache.get(resultKey);
      if (result) {
        return result;
      }
      const now = Date.now();
      if (now - start > timeoutMs) {
        throw new Error('执行超时');
      }
      await sleep(100);
    }
  }

  private isSuccess(
    executResult:
      | {
          success: true;
          data: PistonExecuteResult;
        }
      | {
          success: false;
          error: any;
        },
  ): [boolean, string] {
    if (!executResult.success) {
      return [false, (executResult as any).error];
    }
    if ((executResult.data as any)?.message) {
      return [false, (executResult as any).data?.message];
    }
    const signal = (executResult.data as any)?.run?.signal;
    if (signal === 'SIGKILL' || signal === 'SIGSYS' || signal === 'SIGXCPU') {
      return [false, (executResult.data as any)?.run?.stderr || signal];
    }
    const stderr = (executResult.data as any)?.run?.stderr;
    if (stderr) {
      return [false, stderr];
    }
    return [true, ''];
  }

  public async runInVM(
    language: string,
    sourceCode: string,
    parameters?: { [x: string]: any },
  ) {
    const apiServer = config.sandbox.piston.apiServer;
    if (!apiServer) {
      throw new Error('SandBox piston apiServer is not configured');
    }

    const taskId = uuid.v4();
    const args = parameters
      ? Object.keys(parameters).map((key) => JSON.stringify(parameters[key]))
      : [];
    const fullCode = `
import redis
import json

def collect_result(result):
  r = redis.from_url("${config.redis.url}/0")
  r.set("${this.getResultKey(taskId)}", json.dumps(result), ex=3600)

def __piston_main():
${indentString(sourceCode, 2)}

result = __piston_main()
collect_result(result)
`;

    const client = new PistonClient({ server: apiServer });
    const executResult = await client.execute({
      language,
      version: '*',
      files: [
        {
          content: fullCode,
        },
      ],
      args,
      run_timeout: config.sandbox.piston.runTimeout,
      compile_timeout: config.sandbox.piston.compileTimeout,
    });
    logger.info('Execute sandbox result: ', executResult);
    const [success, errmsg] = this.isSuccess(executResult);
    if (success) {
      const result = await this.waitForResult(taskId, 10 * 1000);
      const pistonExecuteResult = (executResult as any)
        .data as PistonExecuteResult;
      return {
        result,
        stdout: pistonExecuteResult.run?.stdout,
        stderr: pistonExecuteResult.run?.stderr,
        code: pistonExecuteResult.run?.code,
        signal: pistonExecuteResult.run?.signal,
      };
    } else {
      throw new Error(`执行自定义代码失败: ${errmsg}`);
    }
  }
}
