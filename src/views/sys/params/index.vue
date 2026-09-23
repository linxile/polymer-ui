<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input
            v-model="queryParams.paramKey"
            placeholder="参数键"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
            v-model="queryParams.paramValue"
            placeholder="参数值"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <fast-select
            v-model="queryParams.paramType"
            dict-type="params_type"
            clearable
            placeholder="系统参数"
        ></fast-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'sys:params:save'" type="primary" @click="handleAdd">
          新增
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'sys:params:update'" type="success" :disabled="single" @click="handleUpdate">
          修改
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'sys:params:delete'" type="danger" :disabled="multiple" @click="handleDelete">
          删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        :data="paramsList"
        border
        style="width: 100%"
        ref="tableRef"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
      ></el-table-column>
      <el-table-column
          prop="paramName"
          label="参数名称"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="paramKey"
          label="参数键"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="paramValue"
          label="参数值"
          header-align="center"
          align="center"
      ></el-table-column>
      <fast-table-column
          prop="paramType"
          label="系统参数"
          dict-type="params_type"
      ></fast-table-column>
      <el-table-column
          prop="remark"
          label="备注"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="createTime"
          label="创建时间"
          header-align="center"
          align="center"
          width="180"
      ></el-table-column>
      <el-table-column
          label="操作"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
      >
        <template #default="scope">
          <el-button
              v-auth="'sys:params:update'"
              type="primary"
              link
              icon="Edit"
              @click="handleUpdate(scope.row)"
          >修改</el-button
          >
          <el-button
              v-auth="'sys:params:delete'"
              type="primary"
              link
              icon="Delete"
              @click="handleDelete(scope.row)"
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

    <!-- 弹窗, 新增 / 修改 -->
    <AddOrUpdate ref="addOrUpdateRef" @success="getDataList"/>
  </el-card>
</template>

<script setup lang="ts" name="SysParamsIndex">
import { onMounted, ref } from 'vue';
import AddOrUpdate from './add-or-update.vue';
import { SysParams, SysParamsQuery } from "@/types/api/sys/params";
import { deleteParams, getParamsPage } from "@/api/sys/params";
import { ElMessage, ElMessageBox } from "element-plus";

const queryRef = ref()
const tableRef = ref();

const paramsList = ref<SysParams[]>([])
const loading = ref<boolean>(true)
const ids = ref<number[]>([])
const single = ref<boolean>(true)
const multiple = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<SysParamsQuery>({
  pageNo: 1,
  pageSize: 10,
  paramType: undefined,
  paramKey: undefined,
  paramValue: undefined
})

// 新增/修改弹窗引用
const addOrUpdateRef = ref<InstanceType<typeof AddOrUpdate>>()

/** 查询参数列表 */
function getDataList() {
  loading.value = true
  getParamsPage(queryParams.value).then(response => {
    paramsList.value = response.data?.list || []
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
function handleSelectionChange(selection: SysParams[]) {
  ids.value = selection.map(item => item.id!)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  addOrUpdateRef.value?.open()
}

/** 修改按钮操作 */
function handleUpdate(row?: SysParams) {
  const paramsId = row?.id || ids.value[0]
  addOrUpdateRef.value?.openWithData(paramsId)
}

/** 删除按钮操作 */
function handleDelete(row?: SysParams) {
  const paramsIds = row?.id !== undefined ? [row.id] : (ids.value || [])
  ElMessageBox.confirm('是否确认删除参数编号为"' + paramsIds + '"的数据项？').then(function() {
    return deleteParams(paramsIds)
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
