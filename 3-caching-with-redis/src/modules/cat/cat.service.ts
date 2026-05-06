/**
 * Service xu ly logic nghiep vu cua Cat.
 * (EN: Business logic service for Cat.)
 */
import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { faker } from '@faker-js/faker';
import { DataSource, Repository } from 'typeorm';
import { Cat } from './cat.entity';

/**
 * Cat Service â€” Minh há»a 3 táº§ng caching (DB, Logic, Response).
 * (EN: Cat Service â€” Demonstrates 3 caching layers: DB, Logic, Response.)
 */
@Injectable()
export class CatService {
  private readonly logger = new Logger(CatService.name);
  private readonly responseCacheKey = 'cats_res_layer';
  private readonly logicCacheKey = 'cats_logic_layer_cache';
  private readonly dbQueryCacheKey = 'cats_db_layer_cache';

  private async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  private isLogicCacheResult(
    value: unknown,
  ): value is { message: string; timestamp: string } {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const candidate = value as Record<string, unknown>;
    return (
      typeof candidate.message === 'string' &&
      typeof candidate.timestamp === 'string'
    );
  }

  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,
    private readonly dataSource: DataSource,
    // Inject CACHE_MANAGER Ä‘á»ƒ thá»±c hiá»‡n manual caching báº±ng code logic
    // (EN: Inject CACHE_MANAGER for manual programmatic caching)
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * LAYER 1: Database Query Cache (Táº§ng Database).
   * DÃ¹ng TypeORM Ä‘á»ƒ cache láº¡i káº¿t quáº£ sau khi thá»±c thi SQL.
   * (EN: LAYER 1: Database Query Cache (Database layer). Uses TypeORM to cache SQL execution results.)
   */
  async findByDbCache(): Promise<Cat[]> {
    this.logger.log('Executing Layer 1: TypeORM Query Cache check...');

    // [execute] DB query vá»›i tÃ¹y chá»n cache cá»§a TypeORM
    // (EN: DB query with TypeORM cache option)
    return await this.catRepository.find({
      cache: {
        id: this.dbQueryCacheKey,
        milliseconds: 30000, // Cache trong 30 giÃ¢y (EN: 30s cache)
      },
    });
  }

  /**
   * LAYER 2: Cache By Logic (Táº§ng Nghiá»‡p vá»¥).
   * Tá»± viáº¿t code Ä‘á»ƒ kiá»ƒm tra cache trÆ°á»›c khi thá»±c hiá»‡n logic náº·ng.
   * (EN: LAYER 2: Cache By Logic (Business layer). Manually check cache before heavy logic.)
   */
  async findByLogicCache(): Promise<{ message: string; timestamp: string }> {
    // [prepare] Kiá»ƒm tra xem dá»¯ liá»‡u Ä‘Ã£ cÃ³ trong cache chÆ°a
    // (EN: Check if data already exists in cache)
    this.logger.log('Executing Layer 2: Programmatic Logic Cache check...');
    const cachedData = await this.cacheManager.get(this.logicCacheKey);

    if (this.isLogicCacheResult(cachedData)) {
      this.logger.debug('Logic Cache Hit! Returning data directly.');
      return cachedData;
    }

    // [execute] Giáº£ láº­p xá»­ lÃ½ nghiá»‡p vá»¥ náº·ng (EN: Simulate heavy business logic)
    this.logger.warn('Logic Cache Miss! Simulating heavy work for 1 second...');
    await this.sleep(1000); // Sleep 1s
    const result = {
      message: 'Háº£i sáº£n cho mÃ¨o cá»±c pháº©m',
      timestamp: new Date().toISOString(),
    };

    // [confirm] LÆ°u káº¿t quáº£ vÃ o cache Ä‘á»… dÃ¹ng cho láº§n sau
    // (EN: Save result to cache for future use)
    await this.cacheManager.set(this.logicCacheKey, result, 60000); // 1 phÃºt (EN: 1 minute)

    return result;
  }

  /**
   * LAYER 3: Response Cache (Táº§ng Tiáº¿p nháº­n).
   * Táº§ng nÃ y thÆ°á»ng Ä‘Æ°á»£c handle á»Ÿ Controller, service chá»‰ tráº£ vá» data thÃ´.
   * (EN: LAYER 3: Response Cache (Entry layer). Usually handled at Controller; service just returns raw data.)
   */
  findForResponseCache(): string {
    this.logger.log(
      'Layer 3 flow: Request reaching Service (it means Response Cache was MISS)',
    );
    // Intentionally no delay here because method is sync
    return 'This data would be cached at the Controller level using CacheInterceptor';
  }

  /**
   * LAYER 3 helper: mÃ´ phá»ng tÃ¡c vá»¥ náº·ng 1 giÃ¢y cho láº§n cache miss.
   * (EN: Simulates 1-second heavy work for response-layer cache miss.)
   */
  async findForResponseCacheWithDelay(): Promise<string> {
    this.logger.warn(
      'Response Cache Miss! Simulating controller-layer work for 1 second...',
    );
    await this.sleep(1000); // Sleep 1s
    return this.findForResponseCache();
  }

  /**
   * XÃ³a key cache cá»§a táº§ng response Ä‘á»ƒ demo láº¡i miss/hit.
   * (EN: Clears response-layer cache key to replay miss/hit demo.)
   */
  async clearResponseLayerCache(): Promise<{
    message: string;
    cacheKey: string;
  }> {
    await this.cacheManager.del(this.responseCacheKey);
    this.logger.warn(`Response cache cleared: ${this.responseCacheKey}`);
    return {
      message: 'Response-layer cache key was cleared successfully.',
      cacheKey: this.responseCacheKey,
    };
  }

  /**
   * XÃ³a key cache cá»§a táº§ng logic Ä‘á»ƒ thá»­ láº¡i luá»“ng miss/hit.
   * (EN: Clears logic-layer cache key to replay miss/hit.)
   */
  async clearLogicLayerCache(): Promise<{
    message: string;
    cacheKey: string;
  }> {
    await this.cacheManager.del(this.logicCacheKey);
    this.logger.warn(`Logic cache cleared: ${this.logicCacheKey}`);
    return {
      message: 'Logic-layer cache key was cleared successfully.',
      cacheKey: this.logicCacheKey,
    };
  }

  /**
   * XÃ³a query cache cá»§a TypeORM Ä‘á»ƒ thá»­ láº¡i luá»“ng DB cache.
   * (EN: Clears TypeORM query cache key to replay DB-layer cache flow.)
   */
  async clearDbLayerCache(): Promise<{
    message: string;
    cacheKey: string;
  }> {
    if (this.dataSource.queryResultCache) {
      await this.dataSource.queryResultCache.remove([this.dbQueryCacheKey]);
    }

    this.logger.warn(`DB query cache cleared: ${this.dbQueryCacheKey}`);
    return {
      message: 'DB query-layer cache key was cleared successfully.',
      cacheKey: this.dbQueryCacheKey,
    };
  }

  /**
   * Seed nhanh dá»¯ liá»‡u cat Ä‘á»ƒ demo caching vá»›i táº­p dá»¯ liá»‡u lá»›n.
   * (EN: Quickly seeds cat data for large-dataset caching demo.)
   */
  async seedCats(count = 1000): Promise<{
    message: string;
    inserted: number;
  }> {
    const payload: Array<Pick<Cat, 'name' | 'breed'>> = Array.from(
      { length: count },
      () => ({
        name: faker.person.firstName(),
        breed: faker.animal.cat(),
      }),
    );

    await this.catRepository.insert(payload);
    this.logger.warn(`Seeded ${count} cats for caching demo.`);

    return {
      message: 'Seed completed successfully.',
      inserted: count,
    };
  }
}
