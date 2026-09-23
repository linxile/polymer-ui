<template>
  <div class="fast-user">
    <el-form-item>
      <el-button type="primary" @click="openDialog">新增</el-button>
    </el-form-item>
    <el-dialog
        v-model="dialogVisible"
        title="选择用户"
        :close-on-click-modal="false"
        :width="800"
        draggable
        @closed="handleClosed"
    >
      <el-form :model="queryParams" ref="queryRef" :inline="true">
        <el-form-item>
          <el-input
              v-model="queryParams.username"
              placeholder="用户名"
              clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
              v-model="queryParams.mobile"
              placeholder="手机号"
              clearable
          ></el-input>
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
            prop="createTime"
            label="创建时间"
            header-align="center"
            align="center"
            width="180"
        ></el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getDataList"
      />
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm()">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="FastUser">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserPage } from '@/api/sys/user'
import type { SysUser, SysUserQuery } from '@/types/api/sys/user'

const emit = defineEmits<{
  (e: 'select', userIdList: number[]): void
}>()

const queryRef = ref()
const tableRef = ref()

const userList = ref<SysUser[]>([])
const loading = ref<boolean>(false)
const selectedIds = ref<number[]>([])
const total = ref<number>(0)
const dialogVisible = ref<boolean>(false)

const queryParams = ref<SysUserQuery>({
  pageNo: 1,
  pageSize: 10,
  username: undefined,
  mobile: undefined,
  gender: undefined
})

/** 打开弹窗 */
function openDialog() {
  reset()
  dialogVisible.value = true
  getDataList()
}

/** 关闭弹窗 */
function cancel() {
  dialogVisible.value = false
}

/** 弹窗关闭后重置 */
function handleClosed() {
  reset()
}

/** 表单重置 */
function reset() {
  queryParams.value = {
    pageNo: 1,
    pageSize: 10,
    username: undefined,
    mobile: undefined,
    gender: undefined
  }
  userList.value = []
  selectedIds.value = []
  total.value = 0
  if (queryRef.value) {
    queryRef.value.resetFields()
  }
}

/** 查询用户列表 */
function getDataList() {
  loading.value = true
  getUserPage(queryParams.value).then(response => {
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
  queryParams.value.gender = undefined
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection: SysUser[]) {
  selectedIds.value = selection.map(item => item.id!).filter(Boolean)
}

/** 提交按钮 */
function submitForm() {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择用户记录')
    return
  }

  dialogVisible.value = false
  emit('select', selectedIds.value)
}

</script>

<style lang="scss" scoped>
.fast-user {
  display: inline-block;
}
</style>
