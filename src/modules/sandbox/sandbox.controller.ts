import {
  MonkeyToolCategories,
  MonkeyToolExtra,
  MonkeyToolIcon,
  MonkeyToolInput,
  MonkeyToolName,
  MonkeyToolOutput,
} from '@/common/decorators/monkey-block-api-extensions.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { RunSandboxDto } from './dto/req/run-sandbox.req.dto';
import { RunSandboxRespDto } from './dto/res/run-sandbox.resp.dto';
import { SandboxService } from './sandbox.service';

@Controller('/sandbox')
@UseGuards(new AuthGuard())
export class SandboxController {
  constructor(private readonly sandboxService: SandboxService) {}

  @Post('/execute')
  @ApiOperation({
    summary: '自定义代码沙箱',
    description: '在沙箱中执行自定义代码',
  })
  @MonkeyToolName('sandbox')
  @MonkeyToolCategories(['extra'])
  @MonkeyToolIcon('emoji:👋:#b291f7')
  @MonkeyToolInput([
    {
      name: 'parameters',
      displayName: '执行参数',
      type: 'string',
      typeOptions: {
        multipleValues: true,
      },
      required: false,
      default: ['Hello', 'World'],
      description: '在这里定义的变量可以在源代码中通过 命令行参数 进行引用。',
    },
    {
      name: 'sourceCode',
      displayName: '源代码',
      type: 'string',
      typeOptions: {
        editor: 'code',
        editorLanguage: 'python',
      },
      required: true,
      default: `# 您可以在上面定义代码的执行参数，参数会通过命令行参数的形式传给程序，可以通过 sys.argv 获取。您还可以通过 import 引用需要的包。

import sys
print(sys.argv[1])`,
    },
  ])
  @MonkeyToolOutput([
    {
      name: 'stdout',
      displayName: 'stdout 输出',
      type: 'string',
    },
  ])
  @MonkeyToolOutput([
    {
      name: 'stderr',
      displayName: 'stderr 输出',
      type: 'string',
    },
  ])
  @MonkeyToolOutput([
    {
      name: 'output',
      displayName: '默认输出',
      type: 'string',
    },
  ])
  @MonkeyToolOutput([
    {
      name: 'code',
      displayName: '程序退出状态码',
      type: 'number',
    },
  ])
  @MonkeyToolOutput([
    {
      name: 'signal',
      displayName: '中断信号',
      type: 'string',
    },
  ])
  @MonkeyToolExtra({
    estimateTime: 3,
  })
  @ApiOkResponse({ type: RunSandboxRespDto })
  public async runCustomCode(@Body() body: RunSandboxDto) {
    const { sourceCode, parameters } = body;
    const result = await this.sandboxService.runInVM(
      'python',
      sourceCode,
      parameters,
    );
    return result;
  }
}
