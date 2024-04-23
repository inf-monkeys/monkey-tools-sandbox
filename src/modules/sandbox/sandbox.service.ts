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

  public async setResult(taskId: string, result: string) {
    const key = this.getResultKey(taskId);
    await this.cache.set(key, result, 'EX', 3600);
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
    if ((executResult.data as any)?.run?.signal === 'SIGKILL') {
      return [false, (executResult.data as any)?.run?.stderr || 'SIGKILL'];
    }
    return [true, ''];
  }

  public async runInVM(
    language: string,
    sourceCode: string,
    parameters?: { [x: string]: any },
    timeoutMs?: number,
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
import requests
task_id = "${taskId}"
collect_result_url = "${config.sandbox.piston.resultServer}/sandbox/result/${taskId}"

def collect_result(result):
  requests.post(collect_result_url, json={
    "result": result
  })

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
      run_timeout: timeoutMs,
      compile_timeout: 10000,
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
