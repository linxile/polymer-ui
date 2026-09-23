/**
 * 通用 js 方法封装处理
 */

/**
 * 表单重置
 * @param refName 表单 ref 名称
 * @param vm 组件实例（Vue 3 需要显式传入，因为 setup 里没有 this）
 */
export function resetForm(refName: string, vm: any): void {
  if (vm?.$refs?.[refName]) {
    vm.$refs[refName].resetFields()
  }
}

/**
 * 字符串格式化（%s 占位符）
 * @param str 模板字符串，如 'Hello %s, you are %s'
 * @param args 替换参数
 */
export function sprintf(str: string, ...args: any[]): string {
  let flag = true
  let i = 0
  str = str.replace(/%s/g, () => {
    const arg = args[i++]
    if (typeof arg === 'undefined') {
      flag = false
      return ''
    }
    return String(arg)
  })
  return flag ? str : ''
}

/**
 * 转换字符串，undefined、null 等转化为 ''
 */
export function parseStrEmpty(str: unknown): string {
  if (!str || str === 'undefined' || str === 'null') {
    return ''
  }
  return String(str)
}

/**
 * 参数处理，把对象序列化为 URL 查询字符串（不含 ?）
 * @param params 参数对象
 */
export function tansParams(params: Record<string, any>): string {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    const part = encodeURIComponent(propName) + '='
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== '' && typeof value[key] !== 'undefined') {
            const paramKey = propName + '[' + key + ']'
            const subPart = encodeURIComponent(paramKey) + '='
            result += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&'
      }
    }
  }
  return result
}

/**
 * 验证是否为 blob 格式
 * @param data Blob 对象
 */
export function blobValidate(data: Blob): boolean {
  return data.type !== 'application/json'
}
