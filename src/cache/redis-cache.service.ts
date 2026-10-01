import { Injectable, Inject } from '@nestjs/common';
import {Redis} from 'ioredis';
import { CacheStrategy, CacheTTL } from './cache.enums.js';

@Injectable()
export class RedisCacheService {
 



  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}
  
  
  

  // Generate Cache Key
  private buildKey(strategy: CacheStrategy, identifier: string): string {
    switch (strategy) {


      case CacheStrategy.USER_PROFILE:
        return `user:profile:${identifier}`; 
        
      case CacheStrategy.SESSION:
        return `auth:session:${identifier}`; 
        
      case CacheStrategy.GENERIC:
      default:
        return `cache:${identifier}`;         
        
    }
  }



  // TTL (Time-To-Live) 
  private getDefaultTTL(strategy: CacheStrategy): number {
    switch (strategy) {
    
      case CacheStrategy.SESSION:
        return CacheTTL.DAY;   
        
      case CacheStrategy.USER_PROFILE:
        return CacheTTL.LONG;  
        
      case CacheStrategy.GENERIC:
      default:
        return CacheTTL.MEDIUM; 
        
    }
  }





  //  Get Cached Data
  async get<T>(strategy: CacheStrategy, identifier: string): Promise<T | null> {
  
    const key = this.buildKey(strategy, identifier); 
    const data = await this.redisClient.get(key);   
    if (!data) return null;                         
    return JSON.parse(data) as T;                   
  }
  
  
  
  // Store Data
  async set(strategy: CacheStrategy,identifier: string, value: any, customTTL?: number,): Promise<void> {
  
    const key = this.buildKey(strategy, identifier);
    const ttl = customTTL ?? this.getDefaultTTL(strategy); 
    await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
  }
  
  

  // Delete Cached Data
  async del(strategy: CacheStrategy, identifier: string): Promise<void> {
    const key = this.buildKey(strategy, identifier);
    await this.redisClient.del(key);
  }


}