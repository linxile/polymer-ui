<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input
            v-model="queryParams.connName"
            placeholder="连接名"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryParams.dbType" clearable placeholder="数据库类型">
          <el-option value="MySQL" label="MySQL"></el-option>
          <el-option value="Oracle" label="Oracle"></el-option>
          <el-option value="PostgreSQL" label="PostgreSQL"></el-option>
          <el-option value="SQLServer" label="SQLServer"></el-option>
          <el-option value="DM" label="达梦8"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'gen:datasource:save'" type="primary" @click="handleAdd">
          新增
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'gen:datasource:delete'" type="danger" :disabled="multiple" @click="handleDelete">
          删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        :data="datasourceList"
        border
        style="width: 100%"
        ref="tableRef"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="connName" label="连接名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="dbType" label="数据库类型" header-align="center" align="center"></el-table-column>
      <el-table-column prop="connUrl" label="数据库URL" show-overflow-tooltip header-align="center" align="center"></el-table-column>
      <el-table-column prop="username" label="用户名" header-align="center" align="center"></el-table-column>
      <el-table-column label="密码" header-align="center" align="center">
        <template #default="scope">
          <span>{{ formatPassword(scope.row.password) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
        <template #default="scope">
          <el-button type="primary" link @click="datasourceHandle(scope.row)">测试</el-button>
          <el-button
              v-auth="'gen:datasource:update'"
              type="primary"
              link
              icon="Edit"
              @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
              v-auth="'gen:datasource:delete'"
              type="primary"
              link
              icon="Delete"
              @click="handleDelete(scope.row)"
          >删除</el-button>
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
    <add-or-update ref="addOrUpdateRef" @success="getDataList"></add-or-update>
  </el-card>
</template>

<script setup lang="ts" name="DataSourceIndex">
import { onMounted, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { Datasource } from '@/types/api/gen/datasource'
import { GenQuery } from '@/types/api/gen/base-class'
import { deleteDatasources, getDatasourcePage, useDataSourceTestApi } from '@/api/gen/datasource'
import { ElMessage, ElMessageBox } from 'element-plus'
import { decrypt } from '@/utils/tool'

const queryRef = ref()
const tableRef = ref()

const datasourceList = ref<Datasource[]>([])
const loading = ref<boolean>(true)
const ids = ref<number[]>([])
const multiple = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<GenQuery>({
  pageNo: 1,
  pageSize: 10,
  connName: undefined,
  dbType: undefined
})

// 新增/修改弹窗引用
const addOrUpdateRef = ref<InstanceType<typeof AddOrUpdate>>()

/** 查询数据源列表 */
function getDataList() {
  loading.value = true
  getDatasourcePage(queryParams.value).then(response => {
    datasourceList.value = response.data?.list || []
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
function handleSelectionChange(selection: Datasource[]) {
  ids.value = selection.map(item => item.id!)
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  addOrUpdateRef.value?.open()
}

/** 修改按钮操作 */
function handleUpdate(row: Datasource) {
  addOrUpdateRef.value?.openWithData(row.id!)
}

/** 删除按钮操作 */
function handleDelete(row?: Datasource) {
  const deleteIds = row?.id !== undefined ? [row.id] : (ids.value || [])
  if (deleteIds.length === 0) {
    ElMessage.warning('请选择删除记录')
    return
  }
  ElMessageBox.confirm('是否确认删除数据源编号为"' + deleteIds + '"的数据项？').then(function() {
    return deleteDatasources(deleteIds)
  }).then(() => {
    getDataList()
    ElMessage.success("删除成功")
  }).catch(() => {})
}

/** 测试数据源连接 */
function datasourceHandle(row: Datasource) {
  useDataSourceTestApi(row.id!).then(res => {
    ElMessage.success(res.data || '连接成功')
  })
}

/** 格式化密码显示（脱敏） */
function formatPassword(str?: string): string {
  if (!str) return ''
  try {
    return Array(decrypt(str).length).fill('•').join('')
  } catch {
    return '••••••'
  }
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
