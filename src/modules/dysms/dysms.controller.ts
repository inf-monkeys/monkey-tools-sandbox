import {
  MonkeyToolCategories,
  MonkeyToolCredentials,
  MonkeyToolExtra,
  MonkeyToolIcon,
  MonkeyToolInput,
  MonkeyToolName,
  MonkeyToolOutput,
} from '@/common/decorators/monkey-block-api-extensions.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendDysmsReqDto } from './dto/req/send-dysms.req.dto';
import { DysmsService } from './dysms.service';

@Controller('')
@UseGuards(new AuthGuard())
@ApiTags('自动化')
export class DysmsController {
  constructor(private readonly service: DysmsService) {}

  @Post('send-dysms')
  @ApiOperation({
    summary: '阿里云短信',
    description: '发送阿里云短信',
  })
  @MonkeyToolName('collect_dowhile_output')
  @MonkeyToolCategories(['auto'])
  @MonkeyToolIcon('emoji:🤖️:#7fa3f8')
  @MonkeyToolInput([
    {
      name: 'signName',
      displayName: '短信签名',
      type: 'string',
      typeOptions: {
        password: true,
      },
      required: true,
    },
    {
      name: 'templateCode',
      displayName: '短信模版编码',
      type: 'string',
      required: true,
    },
    {
      name: 'templateParam',
      displayName: '短信模板参数',
      type: 'string',
      required: true,
    },
    {
      name: 'phoneNumbers',
      displayName: '手机号列表，如果有多个，使用英文逗号分割',
      type: 'string',
      required: true,
    },
  ])
  @MonkeyToolOutput([
    {
      name: 'success',
      type: 'boolean',
      displayName: '是否发送成功',
    },
  ])
  @MonkeyToolExtra({
    estimateTime: 3,
  })
  @MonkeyToolCredentials([
    {
      name: 'dysms',
      required: true,
    },
  ])
  public async sendDysms(@Body() dto: SendDysmsReqDto) {
    const {
      phoneNumbers,
      templateCode,
      templateParam,
      signName,
      __encryptedCredentialData,
    } = dto;
    const data = await this.service.sendDysms(
      {
        phoneNumbers,
        templateCode,
        templateParam,
        signName,
      },
      __encryptedCredentialData,
    );
    return data;
  }
}
