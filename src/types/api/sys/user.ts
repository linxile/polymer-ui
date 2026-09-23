import type { PageParam, BaseEntity } from "../common";

/** 用户查询参数 */
export interface SysUserQuery extends PageParam {
  /** 用户名 */
  username?: string;
  /** 手机号 */
  mobile?: string;
  /** 性别 */
  gender?: number;
  /** 部门ID */
  deptId?: number;
}

/**
 * 用户信息
 */
export interface SysUser extends BaseEntity {
  /** 用户名 */
  username: string;
  /** 密码 */
  password?: string;
  /** 姓名 */
  realName?: string;
  /** 头像 */
  avatar?: string;
  /** 性别 0：男 1：女 2：未知 */
  gender?: 0 | 1 | 2;
  /** 邮箱 */
  email?: string;
  /** 手机号 */
  mobile?: string;
  /** 省份代码 */
  provinceCode?: string;
  /** 城市代码 */
  cityCode?: string;
  /** 地区代码 */
  districtCode?: string;
  /** 详细地址 */
  address?: string;
  /** 所属城市 */
  city?: string[];
  /** 部门ID */
  deptId?: number;
  /** 状态 0：停用 1：正常 */
  status?: 0 | 1;
  /** 角色ID列表 */
  roleIdList?: number[];
  /** 角色名称列表 */
  roleNameList?: string[];
  /** 岗位ID列表 */
  postIdList?: number[];
  /** 岗位名称列表 */
  postNameList?: string[];
  /** 超级管理员 0：否 1：是 */
  superAdmin?: 0 | 1;
  /** 部门名称 */
  deptName?: string;
}

/** 修改密码 */
export interface SysUserPassword {
  /** 原密码 */
  password?: string;
  /** 新密码 */
  newPassword?: string;
  /** 确认密码 */
  confirmPassword?: string;

}

/** 用户基本信息 */
export interface SysUserBase {
  /** 头像 */
  avatar?: string;
  /** 性别 0：男 1：女 2：未知 */
  gender?: 0 | 1 | 2;
  /** 邮箱 */
  email?: string;
  /** 手机号 */
  mobile?: string;
  /** 省份代码 */
  provinceCode?: string;
  /** 城市代码 */
  cityCode?: string;
  /** 地区代码 */
  districtCode?: string;
  /** 详细地址 */
  address?: string;
  /** 所属城市 */
  city?: string[];
}
