// @/types/api/gen/field-type.ts
import type { BaseEntity } from "../common";

/** 字段类型信息 */
export interface FieldType extends BaseEntity {
    /** 字段类型 */
    columnType?: string;
    /** 属性类型 */
    attrType?: string;
    /** 属性包名 */
    packageName?: string;
}
