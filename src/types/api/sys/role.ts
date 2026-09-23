import type { PageParam, BaseEntity } from "../common";

/** 用户查询参数 */
export interface SysRoleQuery extends PageParam {
  /** 角色名称 */
  name?: string;
}

/**
 * 角色管理
 */
export interface SysRole extends BaseEntity {
  /** 角色名称 */
  name: string;
  /** 角色编码 */
  roleCode: string;
  /** 备注 */
  remark?: string;
  /** 数据范围 0：全部数据 1：本部门及子部门数据 2：本部门数据 3：本人数据 4：自定义数据 */
  dataScope?: 0 | 1 | 2 | 3 | 4;
  /** 菜单ID列表 */
  menuIdList?: number[];
  /** 部门ID列表 */
  deptIdList?: number[];
}
