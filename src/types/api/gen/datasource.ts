// @/types/api/gen/datasource.ts
import type { BaseEntity } from "../common";
import type { GenQuery } from "./base-class";

/** 数据源信息 */
export interface Datasource extends BaseEntity {
    /** 数据库类型 */
    dbType?: string;
    /** 连接名 */
    connName?: string;
    /** URL */
    connUrl?: string;
    /** 用户名 */
    username?: string;
    /** 密码 */
    password?: string;
}
