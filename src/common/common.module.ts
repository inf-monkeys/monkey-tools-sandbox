import { config, isRedisConfigured } from '@/common/config';
import { Global, Module } from '@nestjs/common';
import { InMemoryCache, RedisCache } from './cache';

export const CACHE_TOKEN = 'CACHE';

@Global()
@Module({
  providers: [
    {
      provide: CACHE_TOKEN,
      useFactory: () => {
        return isRedisConfigured()
          ? new RedisCache(config.redis)
          : new InMemoryCache();
      },
    },
  ],
  imports: [],
  exports: [CACHE_TOKEN],
})
export class CommonModule {}
