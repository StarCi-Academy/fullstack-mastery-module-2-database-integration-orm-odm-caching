/**
 * Controller REST cho feature Cat.
 * (EN: REST controller for Cat feature.)
 */
import {
  BadRequestException,
  Controller,
  Post,
  Get,
  Query,
  UseInterceptors,
  Logger,
  Delete,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CatService } from './cat.service';

/**
 * Cat Controller â€” TrÃ¬nh diá»…n 3 táº§ng caching qua 3 endpoints khÃ¡c nhau.
 * (EN: Cat Controller â€” Demonstrates 3 caching layers through 3 different endpoints.)
 */
@Controller('cats')
export class CatController {
  private readonly logger = new Logger(CatController.name);

  constructor(private readonly catService: CatService) {}

  /**
   * POST /cats/seed?count=1000 â€” Seed nhanh dá»¯ liá»‡u báº±ng faker.
   * (EN: POST /cats/seed?count=1000 â€” Quick faker-based seed endpoint.)
   */
  @Post('seed')
  async seedCats(
    @Query('count') count?: string,
  ): Promise<{ message: string; inserted: number }> {
    const seedCount = count ? Number(count) : 1000;

    if (!Number.isInteger(seedCount) || seedCount <= 0) {
      throw new BadRequestException(
        'count must be a positive integer (example: /cats/seed?count=1000)',
      );
    }

    this.logger.warn(`--- Seeding ${seedCount} cats for cache demo ---`);
    return await this.catService.seedCats(seedCount);
  }

  /**
   * ENDPOINT 1: Demo Response Cache (Request Level).
   * Tá»± Ä‘á»™ng cache toÃ n bá»™ HTTP Response dá»±a trÃªn URL vÃ  Key.
   * (EN: ENDPOINT 1: Demo Response Cache (Request Level). Auto-caches HTTP Response based on URL and Key.)
   */
  @Get('response-layer')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @UseInterceptors(CacheInterceptor) // Táº§ng 3: Cháº·n ngay táº¡i entry point (EN: Block at entry point)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @CacheKey('cats_res_layer')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @CacheTTL(30000) // 30 giÃ¢y (EN: 30 seconds)
  async getResponseCache(): Promise<string> {
    this.logger.log('--- Triggering Layer 3 (Response Cache) flow ---');
    return await this.catService.findForResponseCacheWithDelay();
  }

  /**
   * DELETE /cats/response-layer/cache â€” XÃ³a key cache táº§ng controller.
   * (EN: DELETE /cats/response-layer/cache â€” Clear response-layer cache key.)
   */
  @Delete('response-layer/cache')
  async clearResponseLayerCache(): Promise<{
    message: string;
    cacheKey: string;
  }> {
    this.logger.warn('--- Clearing Layer 3 (Response Cache) key ---');
    return await this.catService.clearResponseLayerCache();
  }

  /**
   * ENDPOINT 2: Demo Logic Cache (Service Level).
   * Service chá»§ Ä‘á»™ng kiá»ƒm tra cache báº±ng code trÆ°á»›c khi tÃ­nh toÃ¡n.
   * (EN: ENDPOINT 2: Demo Logic Cache (Service Level). Service manually checks cache before computing.)
   */
  @Get('logic-layer')
  async getLogicCache(): Promise<{ message: string; timestamp: string }> {
    this.logger.log('--- Triggering Layer 2 (Logic Cache) flow ---');
    return await this.catService.findByLogicCache();
  }

  /**
   * DELETE /cats/logic-layer/cache â€” XÃ³a key cache táº§ng logic.
   * (EN: DELETE /cats/logic-layer/cache â€” Clear logic-layer cache key.)
   */
  @Delete('logic-layer/cache')
  async clearLogicLayerCache(): Promise<{
    message: string;
    cacheKey: string;
  }> {
    this.logger.warn('--- Clearing Layer 2 (Logic Cache) key ---');
    return await this.catService.clearLogicLayerCache();
  }

  /**
   * ENDPOINT 3: Demo DB Query Cache (Data Level).
   * TypeORM tá»± Ä‘á»™ng cache káº¿t quáº£ cá»§a cÃ¢u lá»‡nh SQL.
   * (EN: ENDPOINT 3: Demo DB Query Cache (Data Level). TypeORM auto-caches SQL query results.)
   */
  @Get('db-layer')
  async getDbCache() {
    this.logger.log('--- Triggering Layer 1 (DB Query Cache) flow ---');
    return await this.catService.findByDbCache();
  }

  /**
   * DELETE /cats/db-layer/cache â€” XÃ³a key query cache táº§ng DB.
   * (EN: DELETE /cats/db-layer/cache â€” Clear DB query-layer cache key.)
   */
  @Delete('db-layer/cache')
  async clearDbLayerCache(): Promise<{
    message: string;
    cacheKey: string;
  }> {
    this.logger.warn('--- Clearing Layer 1 (DB Query Cache) key ---');
    return await this.catService.clearDbLayerCache();
  }
}
