<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input
            v-model="queryParams.name"
            placeholder="模板名称"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
            v-model="queryParams.code"
            placeholder="模版编码"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <fast-select
            v-model="queryParams.status"
            dict-type="notify_status"
            clearable
            placeholder="状态"
        ></fast-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
            v-model="queryParams.createTime"
            type="daterange"
            value-format="YYYY-MM-DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'message:notifyTemplate:save'" type="primary" @click="handleAdd">
          新增
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'message:notifyTemplate:delete'" type="danger" :disabled="multiple" @click="handleDelete">
          删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        :data="notifyTemplateList"
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
          prop="name"
          label="模板名称"
          header-align="center"
          align="center"
          width="120"
          :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
          prop="code"
          label="模版编码"
          header-align="center"
          align="center"
          width="120"
          :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
          prop="nickname"
          label="发送人名称"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="content"
          label="模版内容"
          header-align="center"
          align="center"
          width="200"
          :show-overflow-tooltip="true"
      ></el-table-column>
      <fast-table-column
          prop="type"
          label="类型"
          dict-type="notify_type"
          align="center"
          width="100"
      ></fast-table-column>
      <fast-table-column
          prop="status"
          label="状态"
          dict-type="notify_status"
          align="center"
          width="80"
      ></fast-table-column>
      <el-table-column
          prop="remark"
          label="备注"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
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
          width="180"
      >
        <template #default="scope">
          <el-button
              v-auth="'message:notifyTemplate:update'"
              type="primary"
              link
              icon="Edit"
              @click="handleUpdate(scope.row)"
          >修改</el-button
          >
          <el-button
              v-auth="'message:notifyTemplate:sendNotify'"
              type="primary"
              link
              @click="openSendForm(scope.row)"
          >测试</el-button
          >
          <el-button
              v-auth="'message:notifyTemplate:delete'"
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
    <!-- 表单弹窗：测试发送 -->
    <!-- <NotifyTemplateSendForm ref="sendFormRef" @success="getDataList" /> -->
  </el-card>
</template>

<script setup lang="ts" name="MessageNotifyTemplateIndex">
import { onMounted, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { MessageNotifyTemplate, MessageNotifyTemplateQuery } from '@/types/api/message/notify-template'
import { deleteNotifyTemplates, getNotifyTemplatePage } from '@/api/message/notify-template'
import { ElMessage, ElMessageBox } from 'element-plus'

const queryRef = ref()
const tableRef = ref()

const notifyTemplateList = ref<MessageNotifyTemplate[]>([])
const loading = ref<boolean>(true)
const ids = ref<number[]>([])
const multiple = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<MessageNotifyTemplateQuery>({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  code: undefined,
  status: undefined,
  createTime: undefined
})

// 新增/修改弹窗引用
const addOrUpdateRef = ref<InstanceType<typeof AddOrUpdate>>()

// 发送测试弹窗引用（组件暂未启用，保留 ref）
const sendFormRef = ref()

/** 查询站内信模板列表 */
function getDataList() {
  loading.value = true
  getNotifyTemplatePage(queryParams.value).then(response => {
    notifyTemplateList.value = response.data?.list || []
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
function handleSelectionChange(selection: MessageNotifyTemplate[]) {
  ids.value = selection.map(item => item.id!)
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  addOrUpdateRef.value?.open()
}

/** 修改按钮操作 */
function handleUpdate(row: MessageNotifyTemplate) {
  addOrUpdateRef.value?.openWithData(row.id!)
}

/** 删除按钮操作 */
function handleDelete(row?: MessageNotifyTemplate) {
  const deleteIds = row?.id !== undefined ? [row.id] : (ids.value || [])
  if (deleteIds.length === 0) {
    ElMessage.warning('请选择删除记录')
    return
  }
  ElMessageBox.confirm('是否确认删除站内信模板编号为"' + deleteIds + '"的数据项？').then(function() {
    return deleteNotifyTemplates(deleteIds)
  }).then(() => {
    getDataList()
    ElMessage.success("删除成功")
  }).catch(() => {})
}

/** 发送站内信按钮 */
function openSendForm(row: MessageNotifyTemplate) {
  sendFormRef.value?.open(row.id)
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
