// @/types/api/gen/project.ts
import type { BaseEntity } from "../common";

/** 项目名变更信息 */
export interface ProjectModify extends BaseEntity {
    /** 项目名 */
    projectName?: string;
    /** 项目标识 */
    projectCode?: string;
    /** 项目包名 */
    projectPackage?: string;
    /** 项目路径 */
    projectPath?: string;
    /** 变更项目名 */
    modifyProjectName?: string;
    /** 变更标识 */
    modifyProjectCode?: string;
    /** 变更包名 */
    modifyProjectPackage?: string;
    /** 排除文件 */
    exclusions?: string;
    /** 变更文件 */
    modifySuffix?: string;
    /** 变更临时路径 */
    modifyTmpPath?: string;
}
