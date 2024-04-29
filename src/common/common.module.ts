import { config } from '@/common/config';
import { Global, Module } from '@nestjs/common';
import { RedisCache } from './cache';

export const CACHE_TOKEN = 'CACHE';

@Global()
@Module({
  providers: [
    {
      provide: CACHE_TOKEN,
      useFactory: () => {
        return new RedisCache(config.redis);
      },
    },
  ],
  imports: [],
  exports: [CACHE_TOKEN],
})
export class CommonModule {}
