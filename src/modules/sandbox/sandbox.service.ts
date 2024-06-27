import { CacheManager } from '@/common/cache';
import { CACHE_TOKEN } from '@/common/common.module';
import { RedisMode, config } from '@/common/config';
import { logger } from '@/common/logger';
import { sleep } from '@/common/utils';
import { indentString } from '@/common/utils/indent-string';
import { safifyVm } from '@/common/vm';
import { Inject, Injectable } from '@nestjs/common';
import { PistonClient, PistonExecuteResult } from 'piston-api-client';
import * as uuid from 'uuid';

export enum Language {
  Nodejs = 'node-js',
  Python = 'python',
}

export interface SandboxResult {
  data: any;
  stdout?: string;
  stderr?: string;
  code?: number;
  signal?: string;
}

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
        try {
          return JSON.parse(result);
        } catch {
          return result;
        }
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

  private initPistonClient() {
    const apiServer = config.piston.apiServer;
    if (!apiServer) {
      throw new Error('SandBox piston apiServer is not configured');
    }
    const client = new PistonClient({ server: apiServer });
    return client;
  }

  private async runNodejs(
    sourceCode: string,
    parameters?: { [x: string]: any },
  ): Promise<SandboxResult> {
    try {
      const data = await safifyVm.run(sourceCode, {
        $: parameters,
      });
      return {
        data,
      };
    } catch (error: any) {
      throw new Error(`执行自定义代码失败：${error.message}`);
    }
  }

  // TODO: Piston node may not working, use safify
  //   private async runNodejs(
  //     sourceCode: string,
  //     parameters?: { [x: string]: any },
  //   ) {
  //     const client = this.initPistonClient();
  //     const taskId = uuid.v4();
  //     const fullCode = `
  // const Redis = require('ioredis');

  // $ = ${JSON.stringify(parameters)}

  // async function collect_result(result) {
  //   const redis = new Redis('${config.redis.url}');
  //   await redis.set('${this.getResultKey(taskId)}', JSON.stringify(result), 'EX', 3600);
  // }

  // async function __piston_main() {
  // ${indentString(sourceCode, 2)}
  // }

  // const main = async () => {
  //   const result = await __piston_main()
  //   await collect_result(result)
  // }

  // main().catch(console.error)
  // `;

  //     const executResult = await client.execute({
  //       language: Language.Nodejs,
  //       version: '*',
  //       files: [
  //         {
  //           content: fullCode,
  //         },
  //       ],
  //       run_timeout: config.sandbox.piston.runTimeout,
  //       compile_timeout: config.sandbox.piston.compileTimeout,
  //     });
  //     logger.info('Execute sandbox result: ', executResult);
  //     const [success, errmsg] = this.isSuccess(executResult);
  //     if (success) {
  //       const result = await this.waitForResult(taskId, 10 * 1000);
  //       const pistonExecuteResult = (executResult as any)
  //         .data as PistonExecuteResult;
  //       return {
  //         result,
  //         stdout: pistonExecuteResult.run?.stdout,
  //         stderr: pistonExecuteResult.run?.stderr,
  //         code: pistonExecuteResult.run?.code,
  //         signal: pistonExecuteResult.run?.signal,
  //       };
  //     } else {
  //       throw new Error(`执行自定义代码失败: ${errmsg}`);
  //     }
  //   }

  private async runPython(
    sourceCode: string,
    parameters?: { [x: string]: any },
  ): Promise<SandboxResult> {
    const client = this.initPistonClient();
    const taskId = uuid.v4();

    let redisCode = '';
    switch (config.redis.mode) {
      case RedisMode.standalone:
        redisCode = `
import redis
import json
redis_client = redis.from_url("${config.redis.url}")

        `;
        break;
      case RedisMode.cluster:
        redisCode = `
from rediscluster import (
    RedisCluster,
    ClusterConnectionPool,
)
import json
startup_nodes = ${JSON.stringify(config.redis.nodes)}
password = "${config.redis.options.password}"
pool = ClusterConnectionPool(startup_nodes=startup_nodes, password=password)
redis_client = RedisCluster(connection_pool=pool)
        `;
        break;
      case RedisMode.sentinel:
        redisCode = `
import json
from redis.sentinel import Sentinel
sentinel_nodes = ${JSON.stringify(config.redis.sentinels)}
sentinel_name = "${config.redis.sentinelName}"
password = "${config.redis.options.password}"
sentinel_nodes = [(item['host'], int(item['port'])) for item in sentinel_nodes]
sentinel = Sentinel(sentinel_nodes, password=password)
redis_client = sentinel.master_for(sentinel_name)`;
        break;
      default:
        break;
    }

    const fullCode = `
${redisCode}

def collect_result(result):
  redis_client.set("${this.getResultKey(taskId)}", json.dumps(result), ex=3600)

context = ${JSON.stringify(parameters)}

def __piston_main():
${indentString(sourceCode, 2)}

result = __piston_main()
collect_result(result)
`;

    const executResult = await client.execute({
      language: Language.Python,
      version: '*',
      files: [
        {
          content: fullCode,
        },
      ],
      run_timeout: config.piston.runTimeout,
      compile_timeout: config.piston.compileTimeout,
    });
    logger.info('Execute sandbox result: ', executResult);
    const [success, errmsg] = this.isSuccess(executResult);
    if (success) {
      const data = await this.waitForResult(taskId, 10 * 1000);
      const pistonExecuteResult = (executResult as any)
        .data as PistonExecuteResult;
      return {
        data,
        stdout: pistonExecuteResult.run?.stdout,
        stderr: pistonExecuteResult.run?.stderr,
        code: pistonExecuteResult.run?.code,
        signal: pistonExecuteResult.run?.signal,
      };
    } else {
      throw new Error(`执行自定义代码失败: ${errmsg}`);
    }
  }

  public async runInSandbox(
    language: Language,
    sourceCode: string,
    parameters?: { [x: string]: any },
  ): Promise<SandboxResult> {
    if (language === Language.Python) {
      return await this.runPython(sourceCode, parameters);
    } else if (language === Language.Nodejs) {
      return await this.runNodejs(sourceCode, parameters);
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }
  }
}
