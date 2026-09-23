import type { TreeNode, BaseEntity } from "../common";

/** 部门信息 */
export interface SysDept extends TreeNode<SysDept>, BaseEntity {
    /** 部门名称 */
    name: string;
    /** 类型（1：公司；2：子公司；3：部门；4：小组） */
    type: number;
    /** 排序 */
    sort?: number;
    /** 负责人ID */
    leaderId?: number;
    /** 负责人名称 */
    leaderName?: string;
    /** 部门路径（用于查询子类） */
    deptPath?: string;
    /** 上级名称 */
    parentName?: string;
}
