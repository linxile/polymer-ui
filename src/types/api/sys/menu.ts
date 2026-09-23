import {BaseEntity, TreeNode} from "../common";

/** 菜单信息 */
export interface SysMenu extends TreeNode<SysMenu>, BaseEntity {
    /** 菜单名称 */
    name: string;
    /** 菜单URL */
    url?: string;
    /** 类型 0：菜单 1：按钮 2：接口 */
    type?: 0 | 1 | 2;
    /** 打开方式 0：内部 1：外部 */
    openStyle?: 0 | 1;
    /** 菜单图标 */
    icon?: string;
    /** 授权标识(多个用逗号分隔，如：sys:menu:list,sys:menu:save) */
    authority?: string;
    /** 排序 */
    sort?: number;
    /** 上级菜单名称 */
    parentName?: string;
}
