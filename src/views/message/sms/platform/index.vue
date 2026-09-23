<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <fast-select
            v-model="queryParams.platform"
            dict-type="sms_platform"
            clearable
            placeholder="平台类型"
        ></fast-select>
      </el-form-item>
      <el-form-item>
        <el-input
            v-model="queryParams.signName"
            placeholder="短信签名"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'message:smsPlatform:save'" type="primary" @click="handleAdd">
          新增
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'message:smsPlatform:delete'" type="danger" :disabled="multiple" @click="handleDelete">
          删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        :data="smsPlatformList"
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
          prop="id"
          label="id"
          header-align="center"
          align="center"
      ></el-table-column>
      <fast-table-column
          prop="platform"
          label="平台类型"
          dict-type="sms_platform"
      ></fast-table-column>
      <el-table-column
          prop="signName"
          label="短信签名"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="templateId"
          label="短信模板"
          header-align="center"
          align="center"
      ></el-table-column>
      <fast-table-column
          prop="status"
          label="状态"
          dict-type="enable_disable"
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
          width="180"
      >
        <template #default="scope">
          <el-button
              v-auth="'message:smsPlatform:update'"
              type="primary"
              link
              icon="Edit"
              @click="handleUpdate(scope.row)"
          >修改</el-button
          >
          <el-button
              v-auth="'message:smsPlatform:update'"
              type="primary"
              link
              @click="handleSend(scope.row)"
          >测试</el-button
          >
          <el-button
              v-auth="'message:smsPlatform:delete'"
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
    <add-or-update ref="addOrUpdateRef" @success="getDataList"></add-or-update>
    <!-- 发送短信 -->
    <send ref="sendRef" @success="getDataList"></send>
  </el-card>
</template>

<script setup lang="ts" name="MessageSmsPlatformIndex">
import { onMounted, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import Send from './send.vue'
import { MessageSmsPlatform, MessageSmsPlatformQuery } from '@/types/api/message/sms-platform'
import { deleteSmsPlatforms, getSmsPlatformPage } from '@/api/message/sms-platform'
import { ElMessage, ElMessageBox } from 'element-plus'

const queryRef = ref()
const tableRef = ref()

const smsPlatformList = ref<MessageSmsPlatform[]>([])
const loading = ref<boolean>(true)
const ids = ref<number[]>([])
const multiple = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<MessageSmsPlatformQuery>({
  pageNo: 1,
  pageSize: 10,
  platform: undefined,
  signName: undefined
})

// 新增/修改弹窗引用
const addOrUpdateRef = ref<InstanceType<typeof AddOrUpdate>>()
// 发送短信弹窗引用
const sendRef = ref<InstanceType<typeof Send>>()

/** 查询短信平台列表 */
function getDataList() {
  loading.value = true
  getSmsPlatformPage(queryParams.value).then(response => {
    smsPlatformList.value = response.data?.list || []
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
function handleSelectionChange(selection: MessageSmsPlatform[]) {
  ids.value = selection.map(item => item.id!)
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  addOrUpdateRef.value?.open()
}

/** 修改按钮操作 */
function handleUpdate(row: MessageSmsPlatform) {
  addOrUpdateRef.value?.openWithData(row.id!)
}

/** 发送测试按钮操作 */
function handleSend(row: MessageSmsPlatform) {
  sendRef.value?.open(row)
}

/** 删除按钮操作 */
function handleDelete(row?: MessageSmsPlatform) {
  const deleteIds = row?.id !== undefined ? [row.id] : (ids.value || [])
  if (deleteIds.length === 0) {
    ElMessage.warning('请选择删除记录')
    return
  }
  ElMessageBox.confirm('是否确认删除短信平台编号为"' + deleteIds + '"的数据项？').then(function() {
    return deleteSmsPlatforms(deleteIds)
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
