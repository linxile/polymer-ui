// src/types/api/common.ts
/** API 通用响应类型 */
export interface Result<T> {
  /** 状态码 */
  code: number;
  /** 返回内容 */
  msg: string;
  /** 数据对象 */
  data?: T;
}

/** 通用树形节点 */
export interface TreeNode<T = any> {
  /** 主键 */
  id?: number;
  /** 上级ID */
  pid?: number;
  /** 节点名称（前端 UI 组件常用 label） */
  label?: string;
  /** 节点名称（后端常用 name） */
  name?: string;
  /** 子节点列表 */
  children?: TreeNode<T>[];
}

/**
 * 数据导入结果接口
 */
export interface DataImportResult {
  /** 是否通过校验 */
  passed?: boolean;
  /** 错误文件相对路径 */
  errorFileUrl?: string;
  /** 信息 */
  message?: string;
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

/** 分页参数类型 */
export interface PageParam {
  /** 当前记录起始索引 */
  pageNo?: number;
  /** 每页显示记录数 */
  pageSize?: number;
}

/** 分页响应（通用） */
export interface PageResult<T> {
  list: T[];
  total: number;
}

/** Entity基类 */
export interface BaseEntity {
  /** 主键 */
  id?: number;
  /** 创建者 */
  creator?: number;
  /** 更新者 */
  updater?: number;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
}
