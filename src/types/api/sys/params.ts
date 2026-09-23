import type { PageParam, BaseEntity } from "../common";

/** 参数分页查询参数 */
export interface SysParamsQuery extends PageParam {
    /** 系统参数 */
    paramType?: number;
    /** 参数键 */
    paramKey?: string;
    /** 参数值 */
    paramValue?: string;
}

/** 参数信息 */
export interface SysParams extends BaseEntity {
    /** 参数名称 */
    paramName?: string;
    /** 系统参数 */
    paramType?: number;
    /** 参数键 */
    paramKey?: string;
    /** 参数值 */
    paramValue?: string;
    /** 备注 */
    remark?: string;
    /** 创建者 */
    creator?: number;
    /** 更新者 */
    updater?: number;
    /** 更新时间 */
    updateTime?: string;
}
