<template>
  <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" :width="600" draggable @closed="handleClosed">
    <el-form ref="roleRef" :model="form" label-width="120px" @keyup.enter="submitForm()">
      <el-form-item label="角色名称">
        <el-input v-model="form.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="数据范围" prop="dataScope">
        <fast-select v-model="form.dataScope" dict-type="role_data_scope" placeholder="数据范围" style="width: 100%"></fast-select>
      </el-form-item>
      <el-form-item
          v-show="form.dataScope == 4"
          label="数据权限"
          prop="deptIdList"
          :rules="[{ required: true, message: '请选择数据权限', trigger: 'change' }]"
      >
        <el-tree
            ref="deptListTree"
            :data="deptList"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            accordion
            show-checkbox
            @check="handleTreeCheck"
        >
        </el-tree>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus/es'
import { getRoleById, useRoleDataScopeSubmitApi } from '@/api/sys/role'
import { useDeptListApi } from '@/api/sys/dept'
import { SysRole } from '@/types/api/sys/role'

const emit = defineEmits<{ (e: 'success'): void }>()
const roleRef = ref()
const deptListTree = ref()
const deptList = ref<any[]>([])
const dialogVisible = ref<boolean>(false)
const title = ref<string>("数据权限")

const form = ref<SysRole>({
  id: undefined,
  name: '',
  roleCode: '',
  dataScope: 0,
  deptIdList: []
})

/** 打开弹窗 */
function openWithData(id: number) {
  reset()
  getDeptList()
  getRoleById(id).then(response => {
    form.value = response.data!
    dialogVisible.value = true
    nextTick(() => {
      if (form.value.deptIdList) {
        deptListTree.value.setCheckedKeys(form.value.deptIdList)
      }
      if (form.value.dataScope == 4) {
        form.value.deptIdList = deptListTree.value.getCheckedKeys()
        nextTick(() => {
          roleRef.value.clearValidate('deptIdList')
        })
      }
    })
  })
}

/** 获取部门列表 */
function getDeptList() {
  useDeptListApi().then(response => {
    deptList.value = response.data!
  })
}

/** 树节点选中事件（同步数据 + 清除校验） */
function handleTreeCheck() {
  if (form.value.dataScope == 4) {
    form.value.deptIdList = deptListTree.value.getCheckedKeys()
    nextTick(() => {
      roleRef.value.clearValidate('deptIdList')
    })
  }
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
  openWithData
})

/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    name: '',
    roleCode: '',
    dataScope: 0,
    deptIdList: []
  }

  if (roleRef.value) {
    roleRef.value.resetFields()
  }
  if (deptListTree.value) {
    deptListTree.value.setCheckedKeys([])
  }
}

/** 提交按钮 */
function submitForm() {
  // 先同步勾选的部门
  form.value.deptIdList = deptListTree.value.getCheckedKeys()

  // 自定义数据范围需要校验部门是否为空
  if (form.value.dataScope == 4) {
    if (!form.value.deptIdList || form.value.deptIdList.length === 0) {
      ElMessage.warning('请选择数据权限')
      roleRef.value.validateField('deptIdList')
      return
    }
    roleRef.value.clearValidate('deptIdList')
  }

  useRoleDataScopeSubmitApi(form.value).then(() => {
    ElMessage.success("操作成功")
    dialogVisible.value = false
    emit('success')
  })
}
</script>
