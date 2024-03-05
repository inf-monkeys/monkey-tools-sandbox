import * as crypto from 'crypto';
import { config } from '../config';

export const decryptCredentialData = (encrypted: string) => {
  const decryptText = crypto.privateDecrypt(
    {
      key: config.credentialEncrypt.privateKey, // 如果通过文件方式读入就不必转成Buffer
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(encrypted, 'base64'),
  );
  return JSON.parse(decryptText.toString('utf-8'));
};
