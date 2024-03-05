import { decryptCredentialData } from '@/common/utils/credential-helpers';
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import * as $Util from '@alicloud/tea-util';
import { Injectable } from '@nestjs/common';
import { SendDysmsParams } from './interface';

@Injectable()
export class DysmsService {
  public async sendDysms(
    params: SendDysmsParams,
    encryptedCredentialData: string,
  ) {
    const { signName, templateCode, templateParam, phoneNumbers } = params;
    const decryptedCredentialData = await decryptCredentialData(
      encryptedCredentialData,
    );
    const {
      accessKeyId,
      accessKeySecret,
      regionId = 'cn-beijing',
    } = decryptedCredentialData;
    const config = new $OpenApi.Config({
      accessKeyId: accessKeyId,
      accessKeySecret: accessKeySecret,
      regionId,
    });
    // 访问的域名
    config.endpoint = `dysmsapi.aliyuncs.com`;
    const client = new Dysmsapi20170525(config);
    const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
      phoneNumbers,
      signName,
      templateCode,
      templateParam,
    });
    const runtime = new $Util.RuntimeOptions({});
    const { body } = await client.sendSmsWithOptions(sendSmsRequest, runtime);
    const { code, message, requestId } = body;
    if (code !== 'OK') {
      throw new Error(
        `发送阿里云短信失败：code=${code}, message=${message}, requestId=${requestId}`,
      );
    }
    return {
      success: true,
    };
  }
}
