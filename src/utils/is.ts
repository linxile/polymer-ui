// copy to vben-admin

const toString = Object.prototype.toString

/**
 * 判断值的类型是否匹配指定类型
 * @param val 待判断的值
 * @param type 类型名称（如 'Object' / 'Array' / 'Date'）
 */
export function is(val: unknown, type: string): boolean {
  return toString.call(val) === `[object ${type}]`
}

/** 判断是否为已定义（非 undefined） */
export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined'
}

/** 判断是否为未定义（undefined） */
export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val)
}

/** 判断是否为对象 */
export function isObject(val: unknown): val is Record<any, any> {
  return val !== null && is(val, 'Object')
}

/** 判断是否为空（null / 空数组 / 空字符串 / 空 Map / 空 Set / 空对象） */
export function isEmpty<T = unknown>(val: T): val is T {
  if (val === null) {
    return true
  }
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }
  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }
  if (isObject(val)) {
    return Object.keys(val).length === 0
  }
  return false
}

/** 判断是否为日期 */
export function isDate(val: unknown): val is Date {
  return is(val, 'Date')
}

/** 判断是否为 null */
export function isNull(val: unknown): val is null {
  return val === null
}

/** 判断是否同时为 null 和 undefined（永远为 false，保留兼容） */
export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val)
}

/** 判断是否为 null 或 undefined */
export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val)
}

/** 判断是否为数字 */
export function isNumber(val: unknown): val is number {
  return is(val, 'Number')
}

/** 判断是否为 Promise */
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

/** 判断是否为字符串 */
export function isString(val: unknown): val is string {
  return is(val, 'String')
}

/** 判断是否为函数 */
export function isFunction(val: unknown): val is (...args: any[]) => any {
  return typeof val === 'function'
}

/** 判断是否为布尔值 */
export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean')
}

/** 判断是否为正则 */
export function isRegExp(val: unknown): val is RegExp {
  return is(val, 'RegExp')
}

/** 判断是否为数组 */
export function isArray(val: unknown): val is any[] {
  return Array.isArray(val)
}

/** 判断是否为 window 对象 */
export function isWindow(val: unknown): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window')
}

/** 判断是否为 DOM 元素 */
export function isElement(val: unknown): val is Element {
  return isObject(val) && 'tagName' in val
}

/** 判断是否为 Map */
export function isMap(val: unknown): val is Map<any, any> {
  return is(val, 'Map')
}

/** 是否运行在服务端 */
export const isServer = typeof window === 'undefined'

/** 是否运行在客户端 */
export const isClient = !isServer

/** 判断是否为 URL */
export function isUrl(path: string): boolean {
  const reg =
      /(((^https?:(?:\/\/)?)(?:[-:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&%@.\w_]*)#?(?:[\w]*))?)$/
  return reg.test(path)
}

/** 判断系统是否处于暗黑模式 */
export function isDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/** 是否是图片链接 */
export function isImgPath(path: string): boolean {
  return /(https?:\/\/|data:image\/).*?\.(png|jpg|jpeg|gif|svg|webp|ico)/gi.test(path)
}

/** 判断是否为空值（'' / null / undefined） */
export function isEmptyVal(val: unknown): boolean {
  return val === '' || val === null || val === undefined
}
