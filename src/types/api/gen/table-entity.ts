// @/types/api/gen/table-entity.ts
import type { BaseEntity } from "../common";

/** 代码生成表信息 */
export interface TableEntity extends BaseEntity {
    /** 表名 */
    tableName?: string;
    /** 类名 */
    className?: string;
    /** 说明 */
    tableComment?: string;
    /** 作者 */
    author?: string;
    /** 邮箱 */
    email?: string;
    /** 项目包名 */
    packageName?: string;
    /** 项目版本号 */
    version?: string;
    /** 生成方式 0：zip压缩包 1：自定义目录 */
    generatorType?: 0 | 1;
    /** 后端生成路径 */
    backendPath?: string;
    /** 前端生成路径 */
    frontendPath?: string;
    /** 模块名 */
    moduleName?: string;
    /** 功能名 */
    functionName?: string;
    /** 表单布局 1：一列 2：两列 */
    formLayout?: 1 | 2;
    /** 数据源ID */
    datasourceId?: number;
    /** 基类ID */
    baseclassId?: number;
    /** 字段列表 */
    fieldList?: TableField[];
}

/** 代码生成表字段信息 */
export interface TableField {
    /** id */
    id?: number;
    /** 表ID */
    tableId?: number;
    /** 字段名称 */
    fieldName?: string;
    /** 字段类型 */
    fieldType?: string;
    /** 字段说明 */
    fieldComment?: string;
    /** 属性名 */
    attrName?: string;
    /** 属性类型 */
    attrType?: string;
    /** 属性包名 */
    packageName?: string;
    /** 排序 */
    sort?: number;
    /** 自动填充 DEFAULT、INSERT、UPDATE、INSERT_UPDATE */
    autoFill?: string;
    /** 主键 0：否 1：是 */
    primaryPk?: boolean;
    /** 基类字段 0：否 1：是 */
    baseField?: boolean;
    /** 表单项 0：否 1：是 */
    formItem?: boolean;
    /** 表单必填 0：否 1：是 */
    formRequired?: boolean;
    /** 表单类型 */
    formType?: string;
    /** 表单字典类型 */
    formDict?: string;
    /** 表单效验 */
    formValidator?: string;
    /** 列表项 0：否 1：是 */
    gridItem?: boolean;
    /** 列表排序 0：否 1：是 */
    gridSort?: boolean;
    /** 查询项 0：否 1：是 */
    queryItem?: boolean;
    /** 查询方式 */
    queryType?: string;
    /** 查询表单类型 */
    queryFormType?: string;
    /** 主键策略 */
    extra?: string;
}
