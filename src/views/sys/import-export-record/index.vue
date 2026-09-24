<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input
            v-model="queryParams.operatorName"
            placeholder="操作人姓名"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
            v-model="queryParams.businessType"
            placeholder="对象"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
            v-model="queryParams.operationType"
            style="width: 100px"
            placeholder="操作类型"
            clearable
        >
          <el-option label="导入" value="import"></el-option>
          <el-option label="导出" value="export"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
            v-model="createTimeRef"
            type="datetimerange"
            start-placeholder="开始操作时间"
            end-placeholder="结束操作时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            @change="onChangeCreateTime"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
        v-loading="loading"
        :data="recordList"
        border
        style="width: 100%"
    >
      <el-table-column prop="operatorName" label="操作人姓名" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="businessType" label="对象" header-align="center" align="center" width="60"></el-table-column>
      <el-table-column prop="operationType" label="操作类型" header-align="center" align="center" width="100">
        <template #default="{ row }">{{ operationTypeMap[row.operationType] || row.operationType }}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="操作时间" header-align="center" align="center" width="160"></el-table-column>
      <el-table-column prop="totalCount" label="总数据量" header-align="center" align="center" width="90"></el-table-column>
      <el-table-column prop="successCount" label="成功量" header-align="center" align="center" width="70"></el-table-column>
      <el-table-column prop="errorCount" label="失败量" header-align="center" align="center" width="70"></el-table-column>
      <el-table-column prop="conflictHandleCount" label="冲突量" header-align="center" align="center" width="70"></el-table-column>
      <el-table-column prop="importStrategy" label="策略" header-align="center" align="center" width="100">
        <template #default="{ row }">{{ importStrategyMap[row.importStrategy] || row.importStrategy }}</template>
      </el-table-column>
      <el-table-column prop="errorFileUrl" label="错误文件" header-align="center" align="center" width="90">
        <template #default="{ row }">
          <el-link v-if="row.errorFileUrl" type="primary" @click="downloadHandle(row.errorFileUrl, '错误.xlsx')">下载</el-link>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="resultFileUrl" label="结果文件" header-align="center" align="center" width="90">
        <template #default="{ row }">
          <el-link v-if="row.resultFileUrl" type="primary" @click="downloadHandle(row.resultFileUrl, 'data.xlsx')">下载</el-link>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" header-align="center" align="center" min-width="380"></el-table-column>
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

<script setup lang="ts" name="SystemImportExportRecordIndex">
import { onMounted, ref } from 'vue'
import { SysImportExportRecord, SysImportExportRecordQuery } from "@/types/api/sys/import-export-record"
import { getImportExportRecordPage } from "@/api/sys/import-export-record"
import { useFileDownload } from '@/hooks/useFileDownload'

/**
 * 操作类型映射
 */
const operationTypeMap: Record<string, string> = {
  'import': '导入',
  'export': '导出',
}

/**
 * 导入策略映射
 */
const importStrategyMap: Record<string, string> = {
  'update': '更新',
  'skip': '跳过',
  'override': '覆盖',
}

const queryRef = ref()
const createTimeRef = ref<string[]>([])

const recordList = ref<SysImportExportRecord[]>([])
const loading = ref<boolean>(true)
const total = ref<number>(0)
const fileDownload = useFileDownload()

const queryParams = ref<SysImportExportRecordQuery>({
  pageNo: 1,
  pageSize: 10,
  operatorName: undefined,
  businessType: undefined,
  operationType: undefined,
  beginCreateTime: undefined,
  endCreateTime: undefined
})

/** 查询导入导出记录列表 */
function getDataList() {
  loading.value = true
  getImportExportRecordPage(queryParams.value).then(response => {
    recordList.value = response.data?.list || []
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
  createTimeRef.value = []
  queryParams.value.beginCreateTime = undefined
  queryParams.value.endCreateTime = undefined
  handleQuery()
}

/** 创建时间范围选择变更处理 */
function onChangeCreateTime(value: string[] | null) {
  if (value && value.length === 2) {
    queryParams.value.beginCreateTime = value[0]
    queryParams.value.endCreateTime = value[1]
  } else {
    queryParams.value.beginCreateTime = undefined
    queryParams.value.endCreateTime = undefined
  }
}

/** 文件下载 */
function downloadHandle(url: string, filename: string) {
  fileDownload.download(url, filename)
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
