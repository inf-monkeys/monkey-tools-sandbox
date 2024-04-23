import Redis from 'ioredis';

export interface CacheManager {
  isRedis: () => boolean;
  get(key: string): Promise<string | null>;
  set(
    key: string,
    value: string | Buffer | number,
    secondsToken?: 'EX',
    seconds?: number | string,
  ): Promise<'OK'>;
  lpush(key: string, value: string | Buffer | number): Promise<number>;
}

export class RedisCache implements CacheManager {
  redis: Redis;
  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl);
  }

  public isRedis() {
    return true;
  }

  public async get(key: string): Promise<string> {
    return await this.redis.get(key);
  }

  public async set(
    key: string,
    value: string | Buffer | number,
    secondsToken: 'EX',
    seconds: number | string,
  ) {
    return await this.redis.set(key, value, secondsToken, seconds);
  }

  public async lpush(key: string, value: string | Buffer | number) {
    return await this.redis.lpush(key, value);
  }
}
