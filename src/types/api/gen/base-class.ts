// @/types/api/gen/base-class.ts
import type { PageParam, BaseEntity } from "../common";

/** 查询公共参数（gen 模块共用） */
export interface GenQuery extends PageParam {
    /** 编码 */
    code?: string;
    /** 表名 */
    tableName?: string;
    /** 属性类型 */
    attrType?: string;
    /** 字段类型 */
    columnType?: string;
    /** 连接名 */
    connName?: string;
    /** 数据库类型 */
    dbType?: string;
    /** 项目名 */
    projectName?: string;
    /** 表ID */
    tableId?: number;
}

/** 基类信息 */
export interface BaseClass extends BaseEntity {
    /** 基类包名 */
    packageName?: string;
    /** 基类编码 */
    code?: string;
    /** 基类字段，多个用英文逗号分隔 */
    fields?: string;
    /** 备注 */
    remark?: string;
}
