// @/types/api/auth.ts

/**
 * 图片验证码
 */
export interface SysCaptcha {
	/** key */
	key?: string;
	/** image base64 */
	image?: string;
}

/**
 * 账号密码登录参数
 */
export interface SysAccountLogin {
	/** 用户名 */
	username?: string;
	/** 密码 */
	password?: string;
	/** 唯一key（验证码 key） */
	key?: string;
	/** 验证码 */
	captcha?: string;
}

/**
 * 手机号登录参数
 */
export interface SysMobileLogin {
	/** 手机号 */
	mobile?: string;
	/** 短信验证码 */
	code?: string;
}

/**
 * 用户 token 信息
 */
export interface SysUserToken {
	/** id */
	id?: number;
	/** 用户ID */
	userId?: number;
	/** accessToken */
	access_token?: string;
	/** accessToken 过期时间 */
	accessTokenExpire?: string;
	/** refreshToken */
	refresh_token?: string;
	/** refreshToken 过期时间 */
	refreshTokenExpire?: string;
	/** 创建时间 */
	createTime?: string;
}

/**
 * AccessToken 信息
 */
export interface AccessToken {
	/** access_token */
	access_token?: string;
	/** access_token 过期时间 */
	accessTokenExpire?: string;
}
