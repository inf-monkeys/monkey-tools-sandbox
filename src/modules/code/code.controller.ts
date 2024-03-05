import {
  MonkeyToolCategories,
  MonkeyToolExtra,
  MonkeyToolIcon,
  MonkeyToolInput,
  MonkeyToolName,
  MonkeyToolOutput,
} from '@/common/decorators/monkey-block-api-extensions.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CodeService } from './code.service';
import { RunCustomCodeDto } from './dto/req/run-custom-code.req.dto';
import { RunCustomCodeRespDto } from './dto/res/run-custom-code.resp.dto';

@Controller('')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post('/code')
  @ApiOperation({
    summary: '自定义代码',
    description: '在沙箱中执行 JavaScript 自定义代码',
  })
  @MonkeyToolName('code')
  @MonkeyToolCategories(['extra'])
  @MonkeyToolIcon('emoji:👋:#b291f7')
  @MonkeyToolInput([
    {
      name: 'parameters',
      displayName: '执行参数',
      type: 'json',
      typeOptions: {
        multiFieldObject: true,
      },
      required: false,
      default: {
        url: 'https://www.baidu.com',
      },
      description: '在这里定义的变量可以在源代码中通过 $.xxx 进行引用。',
    },
    {
      name: 'sourceCode',
      displayName: '源代码',
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
    },
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: '返回数据',
      type: 'string',
    },
  ])
  @MonkeyToolExtra({
    estimateTime: 3,
  })
  @ApiOkResponse({ type: RunCustomCodeRespDto })
  public async runCustomCode(@Body() body: RunCustomCodeDto) {
    const { sourceCode, parameters } = body;
    const result = await this.codeService.runInVM(sourceCode, parameters);
    return {
      data: result,
    };
  }
}
