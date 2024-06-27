import { config } from '@/common/config';
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
import { Language, SandboxService } from './sandbox.service';

const languageOptions = [
  {
    name: Language.Nodejs,
    value: Language.Nodejs,
  },
];

if (config.piston.enabled) {
  languageOptions.push({
    name: Language.Python,
    value: Language.Python,
  });
}

@Controller('/sandbox')
@UseGuards(new AuthGuard())
export class SandboxController {
  constructor(private readonly sandboxService: SandboxService) {}

  @Post('/execute')
  @ApiOperation({
    summary: '自定义代码',
    description: '在沙箱中执行自定义代码',
  })
  @MonkeyToolName('sandbox')
  @MonkeyToolCategories(['extra'])
  @MonkeyToolIcon('emoji:👋:#b291f7')
  @MonkeyToolInput([
    {
      name: 'language',
      default: 'node-js',
      displayName: '语言',
      type: 'options',
      options: languageOptions,
    },
    {
      name: 'parameters',
      displayName: '执行参数',
      type: 'json',
      typeOptions: {
        multiFieldObject: true,
      },
      description: '在这里定义的变量可以在源代码中通过 命令行参数 进行引用。',
      default: {
        url: 'https://www.baidu.com',
      },
    },
    {
      name: 'sourceCode',
      displayName: 'Nodejs 源代码',
      type: 'string',
      typeOptions: {
        editor: 'code',
        editorLanguage: 'javaScript',
      },
      required: true,
      default: `// 您可以在上述的执行参数中定义需要引用的变量，例如您定义了一个名为 url 的变量，可以通过 $.url 进行引用。您还可以通过 require 引用需要的包。
// 此 JS 沙箱环境支持 Node.js 14 版本，支持 async/await 语法。
// 最终您需要通过 return 语句返回最终的结果。

const axios = require('axios');
const { data } = await axios.get($.url);
return data;`,
      displayOptions: {
        show: {
          language: [Language.Nodejs],
        },
      },
    },
    {
      name: 'sourceCode',
      displayName: 'Python 源代码',
      type: 'string',
      typeOptions: {
        editor: 'code',
        editorLanguage: 'python',
      },
      required: true,
      default: `# 你可以在上面定义代码的执行参数，在次代码块中，你可以通过全局对象 context 获取到。例如你定义了一个 url 参数，可以通过 context.get("url") 获取。

# 你还可以通过 import 引用需要的包。
# 如 import requests

import requests

url = context.get('url')

r = requests.get(url)

return r.text`,
      displayOptions: {
        show: {
          language: [Language.Python],
        },
      },
    },
  ])
  @MonkeyToolOutput([
    {
      name: 'stdout',
      displayName: 'stdout 输出',
      type: 'string',
    },
    {
      name: 'stderr',
      displayName: 'stderr 输出',
      type: 'string',
    },
    {
      name: 'data',
      displayName: '返回数据',
      type: 'json',
    },
    {
      name: 'code',
      displayName: '程序退出状态码',
      type: 'number',
    },
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
    const { sourceCode, parameters, language = Language.Nodejs } = body;
    const result = await this.sandboxService.runInSandbox(
      language,
      sourceCode,
      parameters,
    );
    return result;
  }
}
