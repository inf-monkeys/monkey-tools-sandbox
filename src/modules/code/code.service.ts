import { safifyVm } from '@/common/vm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CodeService {
  constructor() {}

  public async runInVM(sourceCode: string, parameters?: { [x: string]: any }) {
    try {
      const result = await safifyVm.run(sourceCode, parameters);
      return result;
    } catch (error: any) {
      throw new Error(`执行自定义代码失败：${error.message}`);
    }
  }
}
