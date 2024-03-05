import {
  MonkeyToolCategories,
  MonkeyToolExtra,
  MonkeyToolIcon,
  MonkeyToolInput,
  MonkeyToolName,
  MonkeyToolOutput,
} from '@/common/decorators/monkey-block-api-extensions.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ArrayToStringService } from './array_to_string.service';
import { ArrayToStringDto } from './dto/req/array-to-string.req.dto';

@Controller('')
export class ArrayToStringController {
  constructor(private readonly arrayToStringService: ArrayToStringService) {}

  @Post('/array-to-string')
  @ApiOperation({
    summary: '数组转字符串',
    description: '使用分隔符将数组转换为字符串',
  })
  @MonkeyToolName('array_to_string')
  @MonkeyToolCategories(['extra', 'text'])
  @MonkeyToolIcon('emoji:👋:#b291f7')
  @MonkeyToolInput([
    {
      name: 'inputData',
      type: 'string',
      displayName: '输入数据',
      required: true,
    },
    {
      name: 'delimiter',
      type: 'string',
      displayName: '分割符',
      required: true,
      default: ',',
    },
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: '输出数据',
      type: 'string',
    },
  ])
  @MonkeyToolExtra({
    estimateTime: 1,
  })
  public async arryToString(@Body() body: ArrayToStringDto) {
    const { inputData, delimiter } = body;
    const data = await this.arrayToStringService.arrayToString(
      inputData,
      delimiter,
    );
    return {
      data,
    };
  }
}
