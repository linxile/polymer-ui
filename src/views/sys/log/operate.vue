<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input
            v-model="queryParams.realName"
            placeholder="用户"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
            v-model="queryParams.module"
            placeholder="模块名"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
            v-model="queryParams.reqUri"
            placeholder="请求URI"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <fast-select
            v-model="queryParams.status"
            dict-type="success_fail"
            clearable
            placeholder="操作状态"
        ></fast-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        show-overflow-tooltip
        :data="logOperateList"
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
          prop="realName"
          label="用户"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="module"
          label="模块名"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="reqUri"
          label="请求URI"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="reqMethod"
          label="请求方法"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="address"
          label="登录地点"
          header-align="center"
          align="center"
      ></el-table-column>
      <fast-table-column
          prop="operateType"
          label="操作类型"
          dict-type="log_operate_type"
          header-align="center"
          align="center"
      ></fast-table-column>
      <el-table-column
          prop="duration"
          label="执行时长"
          header-align="center"
          align="center"
      >
        <template #default="scope"> {{ scope.row.duration }}ms </template>
      </el-table-column>
      <fast-table-column
          prop="status"
          label="操作状态"
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
          width="80"
      >
        <template #default="scope">
          <el-button type="primary" link @click="detailHandle(scope.row)">详情</el-button>
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
    <operate-detail ref="detailRef"></operate-detail>
  </el-card>
</template>

<script setup lang="ts" name="SysLogOperate">
import { onMounted, ref } from 'vue';
import OperateDetail from './operate-detail.vue';
import { SysLogOperate, SysLogOperateQuery } from "@/types/api/sys/operate";
import { getLogOperatePage } from "@/api/sys/operate";

const queryRef = ref()

const logOperateList = ref<SysLogOperate[]>([])
const loading = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<SysLogOperateQuery>({
  pageNo: 1,
  pageSize: 10,
  realName: undefined,
  module: undefined,
  reqUri: undefined,
  status: undefined
})

// 详情弹窗引用
const detailRef = ref<InstanceType<typeof OperateDetail>>()

/** 查询操作日志列表 */
function getDataList() {
  loading.value = true
  getLogOperatePage(queryParams.value).then(response => {
    logOperateList.value = response.data?.list || []
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
function detailHandle(row: SysLogOperate) {
  detailRef.value?.open(row)
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
