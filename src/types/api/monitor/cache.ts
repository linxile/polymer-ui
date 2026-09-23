// @/types/api/monitor/cache.ts

/** 缓存信息 */
export interface Cache {
    /** 缓存名称 */
    cacheName?: string;
    /** 缓存键名 */
    cacheKey?: string;
    /** 缓存内容 */
    cacheValue?: string;
    /** 备注 */
    remark?: string;
}

/** Redis 请求命令统计 */
export interface RedisCommandStat {
    /** 命令名称 */
    name?: string;
    /** 调用次数 */
    value?: string;
}

/** Redis 详情信息 */
export interface RedisInfo {
    /** Redis info 原始属性 */
    info?: Record<string, any>;
    /** key 数量 */
    keyCount?: number;
    /** 请求命令统计 */
    commandStats?: RedisCommandStat[];
}
