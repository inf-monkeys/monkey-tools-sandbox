import { Injectable } from '@nestjs/common';

@Injectable()
export class ArrayToStringService {
  public async arrayToString(inputArray: string[], delimiter: string) {
    if (!Array.isArray(inputArray)) {
      throw new Error('输入数据不是一个合法的数组');
    }
    return inputArray.join(delimiter);
  }
}
