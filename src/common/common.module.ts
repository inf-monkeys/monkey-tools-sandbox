import { config } from '@/common/config';
import { Global, Module } from '@nestjs/common';
import { InMemoryCache, RedisCache } from './cache';

export const CACHE_TOKEN = 'CACHE';

@Global()
@Module({
  providers: [
    {
      provide: CACHE_TOKEN,
      useFactory: () => {
        return config.redis.url
          ? new RedisCache(config.redis.url)
          : new InMemoryCache();
      },
    },
  ],
  imports: [],
  exports: [CACHE_TOKEN],
})
export class CommonModule {}
