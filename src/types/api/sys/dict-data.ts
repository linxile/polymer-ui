// @/types/api/sys/dict-data.ts
import type { PageParam, BaseEntity } from "../common";

/** 字典数据分页查询参数 */
export interface SysDictDataQuery extends PageParam {
    /** 字典类型ID */
    dictTypeId: number;
}

/** 字典数据信息 */
export interface SysDictData extends BaseEntity {
    /** 字典类型ID */
    dictTypeId: number;
    /** 字典标签 */
    dictLabel: string;
    /** 标签样式 */
    labelClass?: string;
    /** 字典值 */
    dictValue?: string;
    /** 备注 */
    remark?: string;
    /** 排序 */
    sort?: number;
    /** 更新时间 */
    updateTime?: string;
}
