import type { PageParam, BaseEntity } from "../common";

/** 导入导出记录分页查询参数 */
export interface SysImportExportRecordQuery extends PageParam {
    /** 创建者 */
    creator?: number;
    /** 操作人姓名 */
    operatorName?: string;
    /** 业务对象类型：user-用户, dept-部门, role-角色等 */
    businessType?: string;
    /** 操作类型：import-导入, export-导出 */
    operationType?: string;
    /** 开始创建时间 */
    beginCreateTime?: string;
    /** 结束创建时间 */
    endCreateTime?: string;
}

/** 导入导出记录信息 */
export interface SysImportExportRecord extends BaseEntity {
    /** 操作人姓名 */
    operatorName?: string;
    /** 业务对象类型：user-用户, dept-部门, role-角色等 */
    businessType?: string;
    /** 操作类型：import-导入, export-导出 */
    operationType?: string;
    /** 总数据量 */
    totalCount?: number;
    /** 成功量 */
    successCount?: number;
    /** 失败量 */
    errorCount?: number;
    /** 冲突处理数量（根据 importStrategy 判断：skip-跳过数量，override-覆盖数量） */
    conflictHandleCount?: number;
    /** 导入策略：update-更新, skip-跳过, override-覆盖 */
    importStrategy?: string;
    /** 错误数据文件地址（相对路径） */
    errorFileUrl?: string;
    /** 结果文件地址（相对路径） */
    resultFileUrl?: string;
    /** 备注/错误摘要 */
    remark?: string;
    /** 部门ID */
    deptId?: number;
}
