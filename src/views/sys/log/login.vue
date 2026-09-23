<template>
  <el-card>
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
            v-model="queryParams.address"
            placeholder="登录地点"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <fast-select
            v-model="queryParams.status"
            dict-type="success_fail"
            clearable
            placeholder="登录状态"
        ></fast-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'sys:log:login'" type="primary" :loading="exportLoading" @click="handleExport">
          导出
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        show-overflow-tooltip
        :data="logLoginList"
        border
        style="width: 100%"
    >
      <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
      ></el-table-column>
      <el-table-column
          prop="id"
          label="序号"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="username"
          label="用户名"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="ip"
          label="登录IP"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="address"
          label="登录地点"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="userAgent"
          label="User Agent"
          header-align="center"
          align="center"
      ></el-table-column>
      <fast-table-column
          prop="status"
          label="登录状态"
          dict-type="success_fail"
      ></fast-table-column>
      <fast-table-column
          prop="operation"
          label="操作信息"
          dict-type="login_operation"
      ></fast-table-column>
      <el-table-column
          prop="createTime"
          label="登录时间"
          header-align="center"
          align="center"
          width="165"
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
  </el-card>
</template>

<script setup lang="ts" name="SysLogLogin">
import { onMounted, ref } from 'vue';
import { SysLogLogin, SysLogLoginQuery } from "@/types/api/sys/login";
import { getLogLoginPage } from "@/api/sys/login";
import {exportFile2} from "@/utils/download";

const queryRef = ref()

const logLoginList = ref<SysLogLogin[]>([])
const loading = ref<boolean>(true)
const exportLoading = ref<boolean>(false)
const total = ref<number>(0)

const queryParams = ref<SysLogLoginQuery>({
  pageNo: 1,
  pageSize: 10,
  username: undefined,
  address: undefined,
  status: undefined
})

/** 查询登录日志列表 */
function getDataList() {
  loading.value = true
  getLogLoginPage(queryParams.value).then(response => {
    logLoginList.value = response.data?.list || []
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

/** 导出按钮操作 */
function handleExport() {
  console.log('handleExport', queryParams.value)
  exportFile2("sys/log/login/export", {
    ...queryParams.value
  }, `login_${new Date().getTime()}.xlsx`)
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
