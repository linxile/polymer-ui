
/**
 * API响应接口
 */
export interface ApiResponse<T = any> {
  code: number
  data: T
  msg?: string
  message?: string
}

/** Treeselect树结构类型 */
export interface TreeSelect {
  /** 节点ID */
  id?: number
  /** 节点名称 */
  label?: string
  /** 子节点 */
  children: TreeSelect[]
}

/**
 * 附件上传结果接口
 */
export interface AttachmentUploadResult {
  name: string
  url: string
  size: number
  platform: string
}

/**
 * 数据导入结果接口（由各业务模块定义，此处为示例）
 */
export interface DataImportResult<T = any> {
  /** 是否通过校验 */
  passed?: boolean
  /** 错误文件相对路径 */
  errorFileUrl?: string
  /** 信息 */
  message?: string
}

export interface IHooksOptions {
  // 是否在创建页面时，调用数据列表接口
  createdIsNeed?: boolean
  // 数据列表 Url
  dataListUrl?: string
  // 是否需要分页
  isPage?: boolean
  // 删除 Url
  deleteUrl?: string
  // 主键key，用于删除场景
  primaryKey?: string
  // 导出 Url
  exportUrl?: string
  // 查询条件
  queryForm?: any
  // 数据列表
  dataList?: any[]
  // 排序字段
  order?: string
  // 是否升序
  asc?: boolean
  // 当前页码
  pageNo?: number
  // 每页数
  pageSize?: number
  // 总条数
  total?: number
  pageSizes?: number[]
  // 数据列表，loading状态
  dataListLoading?: boolean
  // 数据列表，多选项
  dataListSelections?: any[]
  // 导出loading状态
  exportLoading?: boolean
}


