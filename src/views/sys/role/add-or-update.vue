<template>
  <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" draggable @closed="handleClosed">
    <el-form ref="roleRef" :model="form" :rules="rules" label-width="80px" @keyup.enter="submitForm()">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色编码" prop="roleCode">
        <el-input v-model="form.roleCode" placeholder="请输入角色编码"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item label="菜单权限">
        <el-tree
            ref="menuListTree"
            :data="menuList"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            accordion
            show-checkbox
        ></el-tree>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { getRoleById, submitRole, useRoleMenuApi } from '@/api/sys/role'
import { SysRole } from '@/types/api/sys/role'

const emit = defineEmits<{ (e: 'success'): void }>()
const roleRef = ref()
const menuListTree = ref()
const menuList = ref<any[]>([])
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)

const form = ref<SysRole>({
  id: undefined,
  name: '',
  roleCode: '',
  remark: '',
  menuIdList: []
})

const rules = {
  name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  roleCode: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗（新增） */
function open() {
  reset()
  isEdit.value = false
  title.value = "添加角色"
  dialogVisible.value = true
  getMenuList()
}

/** 打开弹窗（修改） */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "修改角色"
  getMenuList()
  getRoleById(id).then(response => {
    form.value = response.data!
    // 回显菜单勾选状态
    if (form.value.menuIdList) {
      form.value.menuIdList.forEach(item => menuListTree.value.setChecked(item, true))
    }
    dialogVisible.value = true
  })
}

/** 获取菜单列表 */
function getMenuList() {
  useRoleMenuApi().then(response => {
    menuList.value = response.data!
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
    roleCode: '',
    remark: '',
    menuIdList: []
  }

  if (roleRef.value) {
    roleRef.value.resetFields()
  }
  if (menuListTree.value) {
    menuListTree.value.setCheckedKeys([])
  }
}

/** 提交按钮 */
function submitForm() {
  roleRef.value.validate((valid: boolean) => {
    if (valid) {
      // 收集菜单权限（含半选节点）
      form.value.menuIdList = [
        ...menuListTree.value.getHalfCheckedKeys(),
        ...menuListTree.value.getCheckedKeys()
      ]

      const msg = isEdit.value ? "修改成功" : "新增成功"
      submitRole(form.value).then(() => {
        ElMessage.success(msg)
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>
