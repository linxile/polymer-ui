<template>
  <div class="tree-sidebar" :class="{ collapsed, resizing: isResizing, 'no-initial-transition': isLoadingFromStorage }" :style="{ width: sidebarWidth + 'px' }">
    <!-- 右侧拖动条 -->
    <div v-if="!collapsed" class="resize-handle" @mousedown="startResize" @touchstart="startResize" :class="{ active: isResizing }" />
    <div class="tree-header">
      <span class="tree-title" v-show="!collapsed">
        <el-icon><component :is="titleIcon" /></el-icon> {{ title }}
      </span>
      <div class="tree-actions" v-show="!collapsed">
        <el-tooltip :content="isExpandedAll ? '收起全部' : '展开全部'" placement="right">
          <el-icon class="tree-action-icon" @click="toggleExpandAll">
            <ArrowDown v-if="isExpandedAll" />
            <ArrowUp v-else />
          </el-icon>
        </el-tooltip>
        <el-tooltip content="刷新" placement="right">
          <el-icon class="tree-action-icon" @click="handleRefresh"><Refresh /></el-icon>
        </el-tooltip>
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- 侧边栏展开/收起按钮 -->
    <div class="collapse-button-container">
      <el-tooltip :content="collapsed ? '展开' : '收起'" placement="right">
        <el-icon class="collapse-button" @click="toggleCollapsed">
          <DArrowRight v-if="collapsed" />
          <DArrowLeft v-else />
        </el-icon>
      </el-tooltip>
    </div>

    <div class="tree-search" v-show="!collapsed" v-if="showSearch">
      <el-input v-model="searchKeyword" :placeholder="searchPlaceholder" clearable>
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <div class="tree-wrap" v-show="!collapsed">
      <el-tree
          ref="treeRef"
          :data="treeData"
          :props="treeProps"
          :expand-on-click-node="expandOnClickNode"
          :filter-node-method="filterNodeMethod"
          :default-expand-all="defaultExpandAll"
          :default-expanded-keys="defaultExpandedKeys"
          :node-key="nodeKey"
          :check-strictly="checkStrictly"
          :show-checkbox="showCheckbox"
          @node-click="onNodeClick"
          @check="onCheck"
          @node-expand="onNodeExpand"
          @node-collapse="onNodeCollapse"
      >
        <template #default="{ node, data }">
          <slot name="node" :node="node" :data="data">
            <span class="tree-node">
              <el-icon class="node-icon">
                <Folder v-if="data.children && data.children.length" />
                <Document v-else />
              </el-icon>
              <span class="node-label" :title="node.label">{{ node.label }}</span>
            </span>
          </slot>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script setup lang="ts" name="TreeSidebar">
import { computed, markRaw, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Component } from 'vue'
import {
  ArrowDown,
  ArrowUp,
  DArrowLeft,
  DArrowRight,
  Document,
  Folder,
  Search,
  OfficeBuilding,
  Refresh
} from '@element-plus/icons-vue'
import type { ElTree } from 'element-plus'

/** 树节点数据 */
interface TreeNodeData {
  [key: string]: any
  children?: TreeNodeData[]
}

/** 树配置 */
interface TreeProps {
  children?: string
  label?: string
  disabled?: string
  isLeaf?: string
  [key: string]: string | undefined
}

interface IProps {
  /** 树形数据 */
  treeData?: TreeNodeData[]
  /** 标题 */
  title?: string
  /** 标题图标 */
  titleIcon?: string | Component
  /** 是否显示搜索框 */
  showSearch?: boolean
  /** 搜索框占位符 */
  searchPlaceholder?: string
  /** 是否默认收起侧边栏 */
  defaultCollapsed?: boolean
  /** 树配置项 */
  treeProps?: TreeProps
  /** 节点唯一标识字段 */
  nodeKey?: string
  /** 是否在点击节点时展开或收起 */
  expandOnClickNode?: boolean
  /** 是否显示复选框 */
  showCheckbox?: boolean
  /** 是否严格的遵循父子不互相关联 */
  checkStrictly?: boolean
  /** 是否默认展开所有节点 */
  defaultExpandAll?: boolean
  /** 默认展开的节点的key数组 */
  defaultExpandedKeys?: (string | number)[]
  /** 默认宽度 */
  defaultWidth?: number
  /** 收起时的宽度 */
  collapsedWidth?: number
  /** 最小宽度 */
  minWidth?: number
  /** 最大宽度 */
  maxWidth?: number
  /** 本地存储的宽度key */
  storageKey?: string
  /** 是否启用本地存储宽度 */
  enableStorage?: boolean
  /** 自定义过滤方法 */
  filterMethod?: ((value: string, data: TreeNodeData) => boolean) | null
}

const props = withDefaults(defineProps<IProps>(), {
  treeData: () => [],
  title: '树形结构',
  titleIcon: () => markRaw(OfficeBuilding),
  showSearch: true,
  searchPlaceholder: '请输入名称',
  defaultCollapsed: false,
  treeProps: () => ({ children: 'children', label: 'name' }),
  nodeKey: 'id',
  expandOnClickNode: false,
  showCheckbox: false,
  checkStrictly: false,
  defaultExpandAll: false,
  defaultExpandedKeys: () => [],
  defaultWidth: 220,
  collapsedWidth: 20,
  minWidth: 180,
  maxWidth: 400,
  storageKey: 'tree-sidebar-width',
  enableStorage: true,
  filterMethod: null
})

const emit = defineEmits<{
  (e: 'collapsed-change', collapsed: boolean): void
  (e: 'expanded-all-change', expandedAll: boolean): void
  (e: 'refresh'): void
  (e: 'node-click', data: TreeNodeData, node: any, event: Event): void
  (e: 'check', data: TreeNodeData, checkedInfo: any): void
  (e: 'node-expand', data: TreeNodeData, node: any, event: Event): void
  (e: 'node-collapse', data: TreeNodeData, node: any, event: Event): void
  (e: 'search', value: string): void
}>()

const treeRef = ref<InstanceType<typeof ElTree>>()

// 响应式数据
const searchKeyword = ref<string>('')
const collapsed = ref<boolean>(props.defaultCollapsed)
const sidebarWidth = ref<number>(props.defaultCollapsed ? props.collapsedWidth : props.defaultWidth)
const isResizing = ref<boolean>(false)
const startX = ref<number>(0)
const startWidth = ref<number>(0)
const rafId = ref<number | null>(null)
const isLoadingFromStorage = ref<boolean>(false)
const expandedAll = ref<boolean>(props.defaultExpandAll)

// 计算属性
const isExpandedAll = computed<boolean>({
  get: () => expandedAll.value,
  set: (val: boolean) => {
    expandedAll.value = val
  }
})

/** 节点过滤方法 */
function filterNodeMethod(value: string, data: TreeNodeData): boolean {
  if (props.filterMethod) {
    return props.filterMethod(value, data)
  }

  if (!value || value.trim() === '') {
    return true
  }

  const labelField = props.treeProps?.label || 'name'
  const labelValue = data[labelField]

  if (labelValue) {
    return String(labelValue).toLowerCase().indexOf(value.toLowerCase()) !== -1
  }

  return false
}

// 监听折叠状态
watch(collapsed, (newVal: boolean, oldVal: boolean) => {
  if (newVal !== oldVal) {
    handleCollapseChange(newVal)
    emit('collapsed-change', newVal)
  }
})

// 监听内部展开状态变化
watch(expandedAll, (newVal: boolean) => {
  nextTick(() => {
    if (newVal) {
      expandAllNodes()
    } else {
      collapseAllNodes()
    }
  })
  emit('expanded-all-change', newVal)
})

// 监听搜索关键词
watch(searchKeyword, (val: string) => {
  if (treeRef.value) {
    treeRef.value.filter(val)
    emit('search', val)
  }
})

/** 清理动画帧 */
function cleanup(): void {
  if (rafId.value) {
    cancelAnimationFrame(rafId.value)
    rafId.value = null
  }
}

/** 处理收起/展开状态变化 */
function handleCollapseChange(isCollapsed: boolean): void {
  if (isCollapsed) {
    saveWidthToStorage()
    sidebarWidth.value = props.collapsedWidth
  } else {
    const savedWidth = getSavedWidth()
    sidebarWidth.value = savedWidth !== null ? savedWidth : props.defaultWidth
  }
}

/** 获取保存的宽度 */
function getSavedWidth(): number | null {
  if (!props.enableStorage) {
    return null
  }
  try {
    const savedWidth = localStorage.getItem(props.storageKey)
    if (savedWidth) {
      const width = parseInt(savedWidth, 10)
      if (!isNaN(width) && width >= props.minWidth && width <= props.maxWidth) {
        return width
      }
    }
  } catch (error) {
    console.warn(`Failed to load sidebar width from storage with key ${props.storageKey}:`, error)
  }
  return null
}

/** 保存宽度到本地存储 */
function saveWidthToStorage(): void {
  if (collapsed.value || !props.enableStorage) return
  try {
    localStorage.setItem(props.storageKey, sidebarWidth.value.toString())
  } catch (error) {
    console.warn(`Failed to save sidebar width to storage with key ${props.storageKey}:`, error)
  }
}

/** 切换侧边栏收起/展开状态 */
function toggleCollapsed(): void {
  collapsed.value = !collapsed.value
}

/** 切换展开/折叠所有节点 */
function toggleExpandAll(): void {
  expandedAll.value = !expandedAll.value
}

/** 展开所有节点 */
function expandAllNodes(): void {
  if (!treeRef.value) return
  const allNodes = getAllNodes(treeRef.value.root)
  allNodes.forEach(node => {
    if (node.expanded !== undefined && !node.expanded) {
      node.expanded = true
    }
  })
}

/** 获取所有节点 */
function getAllNodes(rootNode: any): any[] {
  const nodes: any[] = []
  const traverse = (node: any): void => {
    if (!node) return
    nodes.push(node)
    if (node.childNodes && node.childNodes.length) {
      node.childNodes.forEach((child: any) => traverse(child))
    }
  }
  traverse(rootNode)
  return nodes
}

/** 收起所有节点 */
function collapseAllNodes(): void {
  if (!treeRef.value) return
  const allNodes = getAllNodes(treeRef.value.root)
  allNodes.forEach(node => {
    if (node.expanded !== undefined && node.expanded) {
      node.expanded = false
    }
  })
}

/** 处理刷新操作 */
function handleRefresh(): void {
  emit('refresh')
}

/** 节点点击事件 */
function onNodeClick(data: TreeNodeData, node: any, e: Event): void {
  emit('node-click', data, node, e)
}

/** 复选框选中事件 */
function onCheck(data: TreeNodeData, checkedInfo: any): void {
  emit('check', data, checkedInfo)
}

/** 节点展开事件 */
function onNodeExpand(data: TreeNodeData, node: any, e: Event): void {
  emit('node-expand', data, node, e)
}

/** 节点折叠事件 */
function onNodeCollapse(data: TreeNodeData, node: any, e: Event): void {
  emit('node-collapse', data, node, e)
}

/** 设置当前选中节点 */
function setCurrentKey(key: string | number): void {
  treeRef.value?.setCurrentKey(key)
}

/** 获取当前选中节点 */
function getCurrentNode(): any | null {
  return treeRef.value?.getCurrentNode() ?? null
}

/** 获取当前选中节点的 key */
function getCurrentKey(): string | number | null {
  return treeRef.value?.getCurrentKey() ?? null
}

/** 设置复选框选中 */
function setCheckedKeys(keys: (string | number)[]): void {
  if (treeRef.value && props.showCheckbox) {
    treeRef.value.setCheckedKeys(keys)
  }
}

/** 获取复选框选中的 keys */
function getCheckedKeys(): (string | number)[] {
  if (treeRef.value && props.showCheckbox) {
    return treeRef.value.getCheckedKeys()
  }
  return []
}

/** 获取复选框选中的节点 */
function getCheckedNodes(): any[] {
  if (treeRef.value && props.showCheckbox) {
    return treeRef.value.getCheckedNodes()
  }
  return []
}

/** 清空搜索 */
function clearSearch(): void {
  searchKeyword.value = ''
  treeRef.value?.filter('')
}

/** 外部过滤 */
function filter(value: string): void {
  searchKeyword.value = value
}

/** 开始拖拽调整宽度 */
function startResize(e: MouseEvent | TouchEvent): void {
  e.preventDefault()
  e.stopPropagation()
  isResizing.value = true
  startX.value = e.type === 'mousedown' ? (e as MouseEvent).clientX : (e as TouchEvent).touches[0].clientX
  startWidth.value = sidebarWidth.value

  if (e.type === 'mousedown') {
    document.addEventListener('mousemove', handleResizeMove)
    document.addEventListener('mouseup', stopResize)
  } else {
    document.addEventListener('touchmove', handleResizeMove, { passive: false })
    document.addEventListener('touchend', stopResize)
  }
  disableUserSelect()
}

/** 拖拽移动 */
function handleResizeMove(e: MouseEvent | TouchEvent): void {
  if (!isResizing.value) return
  if (rafId.value) {
    cancelAnimationFrame(rafId.value)
  }
  rafId.value = requestAnimationFrame(() => {
    const clientX = e.type === 'mousemove' ? (e as MouseEvent).clientX : (e as TouchEvent).touches[0].clientX
    const deltaX = clientX - startX.value
    const newWidth = startWidth.value + deltaX
    const clampedWidth = Math.max(props.minWidth, Math.min(props.maxWidth, newWidth))
    if (Math.abs(clampedWidth - sidebarWidth.value) >= 1) {
      sidebarWidth.value = clampedWidth
    }
  })
}

/** 停止拖拽 */
function stopResize(): void {
  if (!isResizing.value) return
  isResizing.value = false
  if (rafId.value) {
    cancelAnimationFrame(rafId.value)
    rafId.value = null
  }
  startX.value = 0
  startWidth.value = 0
  document.removeEventListener('mousemove', handleResizeMove)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', handleResizeMove)
  document.removeEventListener('touchend', stopResize)
  enableUserSelect()
  saveWidthToStorage()
}

/** 禁用用户选择 */
function disableUserSelect(): void {
  const bodyStyle = document.body.style as CSSStyleDeclaration & {
    webkitUserSelect?: string
    mozUserSelect?: string
    msUserSelect?: string
  }
  bodyStyle.userSelect = 'none'
  bodyStyle.webkitUserSelect = 'none'
  bodyStyle.mozUserSelect = 'none'
  bodyStyle.msUserSelect = 'none'
}

/** 启用用户选择 */
function enableUserSelect(): void {
  const bodyStyle = document.body.style as CSSStyleDeclaration & {
    webkitUserSelect?: string
    mozUserSelect?: string
    msUserSelect?: string
  }
  bodyStyle.userSelect = ''
  bodyStyle.webkitUserSelect = ''
  bodyStyle.mozUserSelect = ''
  bodyStyle.msUserSelect = ''
}

/** 重置宽度 */
function resetWidth(): void {
  sidebarWidth.value = props.defaultWidth
  saveWidthToStorage()
}

/** 获取当前宽度 */
function getCurrentWidth(): number {
  return sidebarWidth.value
}

/** 设置宽度 */
function setWidth(width: number): void {
  if (typeof width === 'number' && width >= props.minWidth && width <= props.maxWidth) {
    sidebarWidth.value = width
    if (!collapsed.value) {
      saveWidthToStorage()
    }
  }
}

defineExpose({
  setCurrentKey,
  getCurrentNode,
  getCurrentKey,
  setCheckedKeys,
  getCheckedKeys,
  getCheckedNodes,
  clearSearch,
  filter,
  resetWidth,
  getCurrentWidth,
  setWidth,
  expandAllNodes,
  collapseAllNodes,
  toggleCollapsed,
  treeRef
})

onMounted(() => {
  isLoadingFromStorage.value = true
  if (!collapsed.value && props.enableStorage) {
    const savedWidth = getSavedWidth()
    if (savedWidth !== null) {
      sidebarWidth.value = savedWidth
    }
  }
  nextTick(() => {
    isLoadingFromStorage.value = false
  })
  if (expandedAll.value) {
    nextTick(() => {
      expandAllNodes()
    })
  }
})

onBeforeUnmount(() => {
  cleanup()
})
</script>

<style lang="scss" scoped>
.tree-sidebar {
  flex-shrink: 0;
  width: 220px;
  background: #fff;
  border-right: 1px solid #e8eaed;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  transition: width 0.25s ease;

  &.collapsed {
    width: 42px;
  }

  &.resizing {
    transition: none;
    will-change: width;

    * {
      pointer-events: none !important;
    }
  }

  &.no-initial-transition {
    transition: none;
  }
}

.resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 100%;
  cursor: col-resize;
  z-index: 20;
  background: transparent;
  transition: background 0.2s;

  &:hover {
    background: rgba(64, 158, 255, 0.3);
  }

  &.active {
    background: rgba(64, 158, 255, 0.5);
  }
}

.collapse-button-container {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 20px;
  background: #fff;
  border-radius: 0 4px 4px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  .tree-sidebar.collapsed & {
    right: 0;
    background: #f7f8fa;
    border-radius: 0 4px 4px 0;
  }

  .tree-sidebar.resizing & {
    pointer-events: none;
  }
}

.collapse-button {
  font-size: 20px;
  color: #909399;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: #409eff;
    background: #ecf5ff;
  }
}

.tree-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  height: 40px;
  border-bottom: 1px solid #e8eaed;
  background: #f7f8fa;
  flex-shrink: 0;

  .tree-title {
    font-size: 13px;
    font-weight: 600;
    color: #303133;
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 5px;

    .el-icon {
      color: #409eff;
      font-size: 16px;
    }
  }

  .tree-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }
}

.tree-action-icon {
  font-size: 20px;
  color: #909399;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: #409eff;
    background: #ecf5ff;
  }
}

.tree-search {
  padding: 10px 10px 4px;
  flex-shrink: 0;
}

.tree-wrap {
  flex: 1;
  overflow-y: auto;
  padding: 6px 6px 12px;

  .tree-sidebar.resizing & {
    overflow: hidden;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #dcdfe6;
    border-radius: 4px;

    &:hover {
      background: #c0c4cc;
    }
  }

  :deep(.el-tree-node__content) {
    height: 32px;
    border-radius: 4px;
    margin-bottom: 1px;

    &:hover {
      background: #f0f7ff;
    }
  }

  :deep(.el-tree-node.is-current > .el-tree-node__content) {
    background: #e6f0fd;
    color: #4fb5d0;
    font-weight: 600;

    .node-icon {
      color: #4fb5d0 !important;
    }
  }
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  overflow: hidden;

  .node-icon {
    font-size: 14px;
    color: #4fb5d0;
    flex-shrink: 0;
  }

  .node-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
