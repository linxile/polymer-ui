import type { PageParam } from "../common";

/** 在线用户分页查询参数 */
export interface UserOnlineQuery extends PageParam {
    // 后端分页只用 PageParam，无额外查询字段
}

/** 在线用户信息 */
export interface UserOnline {
    /** id */
    id?: number;
    /** 用户名 */
    username?: string;
    /** 姓名 */
    realName?: string;
    /** 性别 */
    gender?: number;
    /** 邮箱 */
    email?: string;
    /** accessToken */
    accessToken?: string;
}
