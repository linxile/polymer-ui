<template>
  <div class="user-transfer-container">
    <el-dialog
        v-model="dialogVisible"
        :title="title"
        width="940px"
        :close-on-click-modal="false"
    >
      <div class="user-transfer-dialog">
        <!-- 左侧组织部门树 -->
        <div class="tree-container">
          <tree-panel
              ref="deptTreeRef"
              title="组织机构"
              :tree-data="deptOptions"
              search-placeholder="请输入部门名称"
              storage-key="dept-sidebar-width"
              :default-expand-all="true"
              :max-width="222"
              style="height: 100%; flex: 1"
              @node-click="handleDeptClick"
              @refresh="getDeptTree"
          />
        </div>

        <!-- 右侧人员穿梭框 -->
        <div class="transfer-content">
          <el-transfer
              v-model="selectedUserIds"
              filterable
              :filter-method="filterMethod"
              :titles="['待选人员', '已选人员']"
              :props="{ key: 'id', label: 'username' }"
              :data="leftUsers"
              @change="handleTransferChange"
          />
        </div>
      </div>

      <!-- 对话框底部按钮 -->
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSelection">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="UserTransfer">
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useDeptListApi } from '@/api/sys/dept'
import { useListByDeptIdApi } from '@/api/sys/user'
import TreePanel from '@/components/tree-panel/index.vue'
import type { TreeNode } from '@/types/api/common'
import {SysUser} from "@/types/api/sys/user";

interface IProps {
  /** 对话框标题 */
  title?: string
  /** 是否多选模式 */
  multiple?: boolean
  /** 默认选中的用户ID */
  defaultValue?: number | number[] | null
}

const props = withDefaults(defineProps<IProps>(), {
  title: '选择负责人',
  multiple: false,
  defaultValue: null
})

const emit = defineEmits<{
  (e: 'confirm', value: SysUser | SysUser[] | null): void
}>()

// ============== 状态变量定义 ==============
const dialogVisible = ref<boolean>(false)
const deptOptions = ref<TreeNode[]>([])
const deptTreeRef = ref<InstanceType<typeof TreePanel>>()
const currentDeptId = ref<number>(0)
const leftUsers = ref<SysUser[]>([])
const selectedUserIds = ref<number[]>([])

// ============== 初始化逻辑 ==============
onMounted(async () => {
  await getDeptTree()
})

// ============== 方法定义 ==============

/** 打开对话框 */
function open(defaultValue?: number | number[]) {
  dialogVisible.value = true
  selectedUserIds.value = []

  // 设置默认值 - 使用传入的值或 props.defaultValue
  const initValue = defaultValue !== undefined ? defaultValue : props.defaultValue

  if (initValue !== null && initValue !== undefined) {
    if (props.multiple) {
      // 多选模式：直接设置数组
      selectedUserIds.value = Array.isArray(initValue) ? [...initValue] : [initValue]
    } else {
      // 单选模式：确保是数组形式
      selectedUserIds.value = Array.isArray(initValue) && initValue.length > 0
          ? [initValue[0]]
          : (typeof initValue === 'number' ? [initValue] : [])
    }
  }
}

/** 加载组织部门树 */
async function getDeptTree() {
  try {
    const res = await useDeptListApi()
    deptOptions.value = res.data || []
  } catch (error) {
    console.error('加载组织部门树失败:', error)
    ElMessage.error('加载组织部门失败')
  }
}

/** 加载指定部门下的用户 */
async function loadUsersByDept(deptId: number) {
  try {
    const res = await useListByDeptIdApi(deptId)
    leftUsers.value = res.data || []
  } catch (error) {
    console.error(`加载部门${deptId}下的用户失败:`, error)
    ElMessage.error('加载用户列表失败')
    leftUsers.value = []
  }
}

/** 安全字符串转换（用于搜索） */
function safeToLower(str: string | null | undefined): string {
  return str ? str.toLowerCase() : ''
}

// ============== 事件处理函数 ==============

/** 树节点点击事件 */
function handleDeptClick(node: TreeNode) {
  currentDeptId.value = Number(node.id)
  loadUsersByDept(currentDeptId.value)
}

/** 穿梭框筛选方法 */
function filterMethod(query: string, item: SysUser): boolean {
  return safeToLower(item.username).includes(safeToLower(query))
}

/** 处理穿梭框变化事件 */
function handleTransferChange(
    newSelected: number[],
    direction: 'left' | 'right',
    movedKeys: number[]
) {
  // 单选模式下特殊处理：当从左侧添加新用户时，替换现有选择
  if (!props.multiple && direction === 'right' && movedKeys.length > 0) {
    selectedUserIds.value = [movedKeys[movedKeys.length - 1]]
  }
}

/** 确认选择 */
function confirmSelection() {
  // 单选模式校验
  if (!props.multiple && selectedUserIds.value.length > 1) {
    ElMessage.warning('单选模式下只能选择一个用户')
    return
  }

  // 获取选中用户的详细信息
  const selectedUsers = selectedUserIds.value.map(id =>
      leftUsers.value.find(user => user.id === id) || { id, username: `未知用户(${id})` }
  )

  // 根据模式触发不同的事件
  if (props.multiple) {
    emit('confirm', selectedUsers)
  } else {
    emit('confirm', selectedUsers.length > 0 ? selectedUsers[0] : null)
  }

  dialogVisible.value = false
}

// ============== 监听器 ==============

/** 监听选中用户ID的变化（用于单选模式处理） */
watch(selectedUserIds, (newVal) => {
  if (!props.multiple && newVal.length > 1) {
    selectedUserIds.value = [newVal[newVal.length - 1]]
  }
})

// 暴露 open 方法供外部使用
defineExpose({ open })
</script>

<style scoped>
/* 容器样式 */
.user-transfer-container {
  display: block;
}

/* 对话框内容布局 */
.user-transfer-dialog {
  display: flex;
}

/* 左侧树容器 */
.tree-container {
  padding: 0;
  height: 417px;
  min-height: 300px;
  overflow: hidden;
  border: 1px solid #ebeef5;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
}

/* 树样式调整 */
.tree-scroll-container :deep(.el-tree) {
  min-width: max-content;
  padding: 0 8px 8px;
  box-sizing: border-box;
}

.tree-scroll-container :deep(.el-tree-node__content) {
  height: auto;
  min-height: 26px;
}

.tree-scroll-container :deep(.el-tree-node__label) {
  white-space: nowrap;
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 穿梭框样式调整 */
:deep(.el-transfer) {
  --el-transfer-border-color: var(--el-border-color-lighter);
  --el-transfer-border-radius: var(--el-border-radius-base);
  --el-transfer-panel-width: 200px;
  --el-transfer-panel-header-height: 40px;
  --el-transfer-panel-header-bg-color: var(--el-fill-color-light);
  --el-transfer-panel-footer-height: 40px;
  --el-transfer-panel-body-height: 378px;
  --el-transfer-item-height: 30px;
  --el-transfer-filter-height: 32px;
  font-size: var(--el-font-size-base);
}

:deep(.el-transfer-panel) {
  width: 255px;
}
</style>
