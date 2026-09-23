<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input v-model="queryParams.username" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryParams.mobile" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <fast-select
            v-model="queryParams.gender"
            dict-type="user_gender"
            clearable
            placeholder="性别"
        ></fast-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <fast-user @select="userHandle"></fast-user>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        :data="userList"
        border
        style="width: 100%"
        ref="tableRef"
        @selection-change="handleSelectionChange"
    >
      <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
      ></el-table-column>
      <el-table-column
          prop="username"
          label="用户名"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="mobile"
          label="手机号"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="realName"
          label="姓名"
          header-align="center"
          align="center"
      ></el-table-column>
      <fast-table-column
          prop="gender"
          label="性别"
          dict-type="user_gender"
      ></fast-table-column>
      <el-table-column
          label="操作"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
      >
        <template #default="scope">
          <el-button type="primary" link icon="Delete" @click="handleDelete(scope.row)"
          >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getDataList"
    />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import FastUser from '@/components/fast-user/index.vue'
import { SysUser, SysUserQuery } from '@/types/api/sys/user'
import { useRoleUserSubmitApi } from '@/api/sys/role'
import { deleteRoleUsers, getRoleUserPage } from '@/api/sys/role'
import { ElMessage, ElMessageBox } from 'element-plus/es'

const props = defineProps({
  roleId: {
    type: Number,
    required: true
  }
})

const queryRef = ref()
const tableRef = ref()

const userList = ref<SysUser[]>([])
const loading = ref<boolean>(true)
const ids = ref<number[]>([])
const multiple = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<SysUserQuery & { roleId: number }>({
  pageNo: 1,
  pageSize: 10,
  roleId: props.roleId,
  username: undefined,
  mobile: undefined,
  gender: undefined
})

/** 查询角色用户列表 */
function getDataList() {
  loading.value = true
  getRoleUserPage(queryParams.value).then(response => {
    userList.value = response.data?.list || []
    total.value = response.data?.total || 0
    loading.value = false
  })
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNo = 1
  getDataList()
}

/** 重置按钮操作 */
function resetQuery() {
  queryRef.value.resetFields()
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection: SysUser[]) {
  ids.value = selection.map(item => item.id!)
  multiple.value = !selection.length
}

/** 分配用户 */
function userHandle(userIdList: number[]) {
  useRoleUserSubmitApi(props.roleId, userIdList).then(() => {
    ElMessage.success("操作成功")
    getDataList()
  })
}

/** 删除按钮操作 */
function handleDelete(row?: SysUser) {
  const userIds = row?.id !== undefined ? [row.id] : (ids.value || [])
  ElMessageBox.confirm('是否确认删除用户编号为"' + userIds + '"的数据项？').then(function() {
    return deleteRoleUsers(props.roleId, userIds)
  }).then(() => {
    getDataList()
    ElMessage.success("删除成功")
  }).catch(() => {})
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
