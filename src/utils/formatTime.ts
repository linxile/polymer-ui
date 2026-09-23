import dayjs from 'dayjs'
import type { TableColumnCtx } from 'element-plus'

/** 日期快捷选项，适用于 el-date-picker */
export const defaultShortcuts = [
  {
    text: '今天',
    value: () => {
      return new Date()
    }
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return [date, date]
    }
  },
  {
    text: '最近七天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return [date, new Date()]
    }
  },
  {
    text: '最近 30 天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
      return [date, new Date()]
    }
  },
  {
    text: '本月',
    value: () => {
      const date = new Date()
      date.setDate(1)
      return [date, new Date()]
    }
  },
  {
    text: '今年',
    value: () => {
      const date = new Date()
      return [new Date(`${date.getFullYear()}-01-01`), date]
    }
  }
]

/**
 * 时间日期转换
 * @param date 当前时间，new Date() 格式
 * @param format 需要转换的时间格式字符串
 */
export function formatDate(date: Date | string | undefined | null, format?: string): string {
  if (!date) {
    return ''
  }
  return dayjs(date).format(format ?? 'YYYY-MM-DD HH:mm:ss')
}

/**
 * 获取当前的日期+时间
 */
export function getNowDateTime(): dayjs.Dayjs {
  return dayjs()
}

/**
 * 获取当前日期是第几周
 * @param dateTime 当前传入的日期值
 */
export function getWeek(dateTime: Date): number {
  const temptTime = new Date(dateTime.getTime())
  // 周几
  const weekday = temptTime.getDay() || 7
  // 周1+5天=周六
  temptTime.setDate(temptTime.getDate() - weekday + 1 + 5)
  let firstDay = new Date(temptTime.getFullYear(), 0, 1)
  const dayOfWeek = firstDay.getDay()
  let spendDay = 1
  if (dayOfWeek !== 0) spendDay = 7 - dayOfWeek + 1
  firstDay = new Date(temptTime.getFullYear(), 0, 1 + spendDay)
  const d = Math.ceil((temptTime.valueOf() - firstDay.valueOf()) / 86400000)
  return Math.ceil(d / 7)
}

/**
 * 将时间转换为「几秒前」「几分钟前」「几小时前」「几天前」
 * @param param 当前时间，new Date() 格式或字符串时间格式
 * @param format 超过 3 天时使用的时间格式
 */
export function formatPast(param: string | Date, format = 'YYYY-MM-DD HH:mm:ss'): string {
  // 获取当前时间戳
  const now = Date.now()
  // 传入时间戳
  const target = new Date(param).getTime()
  const diff = now - target

  if (diff < 10000) {
    return '刚刚'
  }
  if (diff < 60000) {
    return `${Math.floor(diff / 1000)}秒前`
  }
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  }
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  }
  if (diff < 259200000) {
    return `${Math.floor(diff / 86400000)}天前`
  }
  return formatDate(new Date(param), format)
}

/**
 * 时间问候语
 * @param param 当前时间
 */
export function formatAxis(param: Date): string {
  const hour = new Date(param).getHours()
  if (hour < 6) return '凌晨好'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 17) return '下午好'
  if (hour < 19) return '傍晚好'
  if (hour < 22) return '晚上好'
  return '夜里好'
}

/**
 * 将毫秒转换成时间字符串，例如：xx 分钟
 * @param ms 毫秒
 */
export function formatPast2(ms: number): string {
  const day = Math.floor(ms / (24 * 60 * 60 * 1000))
  const hour = Math.floor(ms / (60 * 60 * 1000) - day * 24)
  const minute = Math.floor(ms / (60 * 1000) - day * 24 * 60 - hour * 60)
  const second = Math.floor(ms / 1000 - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60)
  if (day > 0) {
    return day + '天' + hour + '小时' + minute + '分钟'
  }
  if (hour > 0) {
    return hour + '小时' + minute + '分钟'
  }
  if (minute > 0) {
    return minute + '分钟'
  }
  if (second > 0) {
    return second + '秒'
  }
  return '0秒'
}

/**
 * element-plus 的时间 Formatter，使用 YYYY-MM-DD HH:mm:ss 格式
 */
export function dateFormatter(
    _row: any,
    _column: TableColumnCtx<any>,
    cellValue: any
): string {
  return cellValue ? formatDate(cellValue) : ''
}

/**
 * element-plus 的时间 Formatter，使用 YYYY-MM-DD 格式
 */
export function dateFormatter2(
    _row: any,
    _column: TableColumnCtx<any>,
    cellValue: any
): string {
  return cellValue ? formatDate(cellValue, 'YYYY-MM-DD') : ''
}

/**
 * 设置起始日期，时间为 00:00:00
 */
export function beginOfDay(param: Date): Date {
  return new Date(param.getFullYear(), param.getMonth(), param.getDate(), 0, 0, 0)
}

/**
 * 设置结束日期，时间为 23:59:59
 */
export function endOfDay(param: Date): Date {
  return new Date(param.getFullYear(), param.getMonth(), param.getDate(), 23, 59, 59)
}

/**
 * 计算两个日期间隔天数
 */
export function betweenDay(param1: Date, param2: Date): number {
  const d1 = convertDate(param1)
  const d2 = convertDate(param2)
  return Math.floor((d2.getTime() - d1.getTime()) / (24 * 3600 * 1000))
}

/**
 * 日期计算
 * @param param1 日期
 * @param param2 添加的时间（毫秒）
 */
export function addTime(param1: Date, param2: number): Date {
  const date = convertDate(param1)
  return new Date(date.getTime() + param2)
}

/**
 * 日期转换
 */
export function convertDate(param: Date | string): Date {
  if (typeof param === 'string') {
    return new Date(param)
  }
  return param
}

/**
 * 指定的两个日期是否为同一天
 */
export function isSameDay(a: dayjs.ConfigType, b: dayjs.ConfigType): boolean {
  if (!a || !b) return false
  const aa = dayjs(a)
  const bb = dayjs(b)
  return aa.year() === bb.year() && aa.month() === bb.month() && aa.date() === bb.date()
}

/**
 * 获取一天的开始时间、截止时间
 */
export function getDayRange(
    date: dayjs.ConfigType,
    days: number
): [string, string] {
  const day = dayjs(date).add(days, 'd')
  return getDateRange(day, day)
}

/**
 * 获取最近 7 天的开始时间、截止时间
 */
export function getLast7Days(): [string, string] {
  const lastWeekDay = dayjs().subtract(7, 'd')
  const yesterday = dayjs().subtract(1, 'd')
  return getDateRange(lastWeekDay, yesterday)
}

/**
 * 获取最近 30 天的开始时间、截止时间
 */
export function getLast30Days(): [string, string] {
  const lastMonthDay = dayjs().subtract(30, 'd')
  const yesterday = dayjs().subtract(1, 'd')
  return getDateRange(lastMonthDay, yesterday)
}

/**
 * 获取最近 1 年的开始时间、截止时间
 */
export function getLast1Year(): [string, string] {
  const lastYearDay = dayjs().subtract(1, 'y')
  const yesterday = dayjs().subtract(1, 'd')
  return getDateRange(lastYearDay, yesterday)
}

/**
 * 获取指定日期的开始时间、截止时间
 */
export function getDateRange(
    beginDate: dayjs.ConfigType,
    endDate: dayjs.ConfigType
): [string, string] {
  return [
    dayjs(beginDate).startOf('d').format('YYYY-MM-DD HH:mm:ss'),
    dayjs(endDate).endOf('d').format('YYYY-MM-DD HH:mm:ss')
  ]
}
