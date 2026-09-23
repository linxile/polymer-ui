import type {TreeNode, BaseEntity, PageParam} from "../common";

/** 城市管理分页查询参数 */
export interface SysCityQuery extends PageParam {
    /** 父级等级（1：省级；2：城市；3：区县） */
    level?: number;
    /** 城市名称 */
    name?: string;
    /** 父级id */
    pid?: number;
}

/** 城市信息 */
export interface SysCity extends TreeNode<SysCity>, BaseEntity {
    /** 城市名称 */
    name: string;
    /** 城市拼音 */
    pinyin?: string;
    /** 城市简称 */
    shortName?: string;
    /** 城市全称 */
    fullName?: string;
    /** 行政编码 */
    areaCode: string;
    /** 城市区号 */
    cityCode?: string;
    /** 父级编码 */
    parentCode?: string;
    /** 父级等级（1：省级；2：城市；3：区县） */
    level?: number;
    /** 邮政编码 */
    zipCode?: string;
    /** 城市经度 */
    longitude?: string;
    /** 城市纬度 */
    latitude?: string;
    /** 是否存在下级 */
    haveChild?: boolean;
    /** 创建者 */
    creator?: number;
    /** 更新者 */
    updater?: number;
    /** 更新时间 */
    updateTime?: string;
}
