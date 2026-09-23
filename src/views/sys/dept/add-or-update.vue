<template>
  <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" draggable @closed="handleClosed">
    <el-form ref="deptRef" :model="form" :rules="rules" label-width="120px" @keyup.enter="submitForm()">
      <el-form-item prop="name" label="名称">
        <el-input v-model="form.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item prop="type" label="部门类型">
        <fast-select v-model="form.type" dict-type="dept_type" placeholder="部门类型" style="width: 100%"></fast-select>
      </el-form-item>
      <el-form-item prop="pid" label="上级部门">
        <el-tree-select
            v-model="form.pid"
            :data="deptList"
            value-key="id"
            check-strictly
            :render-after-expand="false"
            :props="{ label: 'name', children: 'children' }"
            style="width: 100%"
            clearable
        />
      </el-form-item>
      <el-form-item prop="leaderId" label="负责人">
        <div class="leader-selection">
          <div v-if="selectedLeader" class="selected-leader">
            <span>{{ selectedLeader.username }}</span>
            <el-icon @click="clearLeader" class="delete-icon">
              <Close />
            </el-icon>
          </div>
          <el-button text bg :icon="Plus" @click="openLeaderDialog">
            {{ form.leaderId ? '修改负责人' : '选择负责人' }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-input-number v-model="form.sort" controls-position="right" :min="0" aria-label="排序"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm()">确定</el-button>
    </template>
    <!-- 负责人选择组件 -->
    <user-transfer
        v-model="form.leaderId"
        ref="userTransferRef"
        :title="!form.leaderId ? '选择负责人' : '修改负责人'"
        :multiple="false"
        @confirm="handleLeaderSelected"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Close, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus/es'
import { getDeptById, submitDept, useDeptListApi } from '@/api/sys/dept'
import { SysDept } from '@/types/api/sys/dept'
import UserTransfer from '@/components/user-transfer/index.vue'

const emit = defineEmits<{ (e: 'success'): void }>()
const deptRef = ref()
const userTransferRef = ref()
const deptList = ref<SysDept[]>([])
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)
const selectedLeader = ref<{ id: number; username: string } | null>(null)

const form = ref<SysDept>({
  id: undefined,
  name: '',
  type: 1,
  pid: undefined,
  parentName: '',
  leaderId: undefined,
  sort: 0
})

const rules = {
  name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  parentName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗（新增） */
function open(row?: SysDept) {
  reset()
  isEdit.value = false
  title.value = "添加部门"
  dialogVisible.value = true
  getDeptList()

  // 从某行"新增"子部门时，带入父级
  if (row) {
    form.value.pid = row.id
    form.value.parentName = row.name
  }
}

/** 打开弹窗（修改） */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "修改部门"
  getDeptList()
  getDeptById(id).then(response => {
    form.value = response.data!
    // 回显负责人
    if (form.value.leaderId) {
      selectedLeader.value = {
        id: form.value.leaderId,
        username: form.value.leaderName || `用户 ${form.value.leaderId}`
      }
    }
    dialogVisible.value = true
  })
}

/** 获取部门列表 */
function getDeptList() {
  useDeptListApi().then(response => {
    deptList.value = response.data || []
  })
}

/** 关闭弹窗 */
function cancel() {
  dialogVisible.value = false
}

/** 弹窗关闭后重置表单 */
function handleClosed() {
  reset()
}

/** 对外暴露方法 */
defineExpose({
  open,
  openWithData
})

/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    name: '',
    type: 1,
    pid: undefined,
    parentName: '',
    leaderId: undefined,
    sort: 0
  }
  selectedLeader.value = null

  if (deptRef.value) {
    deptRef.value.resetFields()
  }
}

/** 打开负责人选择对话框 */
function openLeaderDialog() {
  userTransferRef.value.open(form.value.leaderId)
}

/** 处理负责人选择结果 */
function handleLeaderSelected(user: any) {
  if (user) {
    selectedLeader.value = {
      id: user.id,
      username: user.username
    }
    form.value.leaderId = user.id
  } else {
    selectedLeader.value = null
    form.value.leaderId = undefined
  }
}

/** 清除已选择的负责人 */
function clearLeader() {
  selectedLeader.value = null
  form.value.leaderId = undefined
}

/** 提交按钮 */
function submitForm() {
  deptRef.value.validate((valid: boolean) => {
    if (valid) {
      const msg = isEdit.value ? "修改成功" : "新增成功"
      submitDept(form.value).then(() => {
        ElMessage.success(msg)
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.dept-list {
  ::v-deep(.el-input__inner) {
    cursor: pointer;
  }
  ::v-deep(.el-input__suffix) {
    cursor: pointer;
  }
}

.leader-selection {
  display: flex;
  flex-direction: row;
  gap: 10px;

  .selected-leader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    background-color: #f5f7fa;
    border-radius: 20px;
    border: 0 solid #dcdfe6;

    .delete-icon {
      cursor: pointer;
      color: #f56c6c;
    }

    .delete-icon:hover {
      color: #e4393c;
    }
  }
}

.el-button.is-text:not(.is-disabled).is-has-bg {
  background-color: var(--el-fill-color-light);
  border-radius: 20px;
}
</style>
