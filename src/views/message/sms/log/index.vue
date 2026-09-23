<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input
            v-model="queryParams.platformId"
            placeholder="平台ID"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <fast-select
            v-model="queryParams.platform"
            dict-type="sms_platform"
            clearable
            placeholder="平台类型"
        ></fast-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        :data="logList"
        border
        style="width: 100%"
        ref="tableRef"
    >
      <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
      ></el-table-column>
      <el-table-column
          prop="platformId"
          label="平台ID"
          header-align="center"
          align="center"
      ></el-table-column>
      <fast-table-column
          prop="platform"
          label="平台类型"
          dict-type="sms_platform"
      ></fast-table-column>
      <el-table-column
          prop="mobile"
          label="手机号"
          header-align="center"
          align="center"
      ></el-table-column>
      <fast-table-column
          prop="status"
          label="状态"
          dict-type="success_fail"
      ></fast-table-column>
      <el-table-column
          prop="createTime"
          label="创建时间"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          label="操作"
          fixed="right"
          header-align="center"
          align="center"
          width="100"
      >
        <template #default="scope">
          <el-button
              v-auth="'message:smsLog:info'"
              type="primary"
              link
              @click="detailHandle(scope.row)"
          >详情</el-button
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

    <!-- 详情 -->
    <detail ref="detailRef"></detail>
  </el-card>
</template>

<script setup lang="ts" name="MessageSmsLogIndex">
import { onMounted, ref } from 'vue'
import Detail from './detail.vue'
import { MessageSmsLog, MessageSmsLogQuery } from '@/types/api/message/sms-log'
import { getSmsLogPage } from '@/api/message/sms-log'

const queryRef = ref()
const tableRef = ref()

const logList = ref<MessageSmsLog[]>([])
const loading = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<MessageSmsLogQuery>({
  pageNo: 1,
  pageSize: 10,
  platformId: undefined,
  platform: undefined
})

// 详情弹窗引用
const detailRef = ref<InstanceType<typeof Detail>>()

/** 查询短信日志列表 */
function getDataList() {
  loading.value = true
  getSmsLogPage(queryParams.value).then(response => {
    logList.value = response.data?.list || []
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

/** 详情按钮操作 */
function detailHandle(row: MessageSmsLog) {
  detailRef.value?.open(row)
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
