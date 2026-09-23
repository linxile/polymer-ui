<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input
            v-model="queryParams.templateTitle"
            placeholder="邮件标题"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
            v-auth="'message:mailLog:delete'"
            type="danger"
            :disabled="multiple"
            @click="handleDelete"
        >删除</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        :data="mailLogList"
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
          prop="toMail"
          label="接收邮箱地址"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="fromMail"
          label="发送邮箱地址"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="templateCode"
          label="模板编码"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="templateNickname"
          label="模版发送人名称"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="templateTitle"
          label="邮件标题"
          header-align="center"
          align="center"
      ></el-table-column>
      <fast-table-column
          prop="sendStatus"
          label="发送状态"
          dict-type="mail_send_status"
          align="center"
      ></fast-table-column>
      <el-table-column
          prop="sendTime"
          label="发送时间"
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
              v-auth="'message:mailLog:info'"
              type="primary"
              link
              @click="detailHandle(scope.row)"
          >查看</el-button
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
    <mail-log-detail ref="detailRef"></mail-log-detail>
  </el-card>
</template>

<script setup lang="ts" name="MessageMailLogIndex">
import { onMounted, ref } from 'vue'
import MailLogDetail from './mail-log-detail.vue'
import { MessageMailLog, MessageMailLogQuery } from '@/types/api/message/mail-log'
import { deleteMailLogs, getMailLogPage } from '@/api/message/mail-log'
import { ElMessage, ElMessageBox } from 'element-plus'

const queryRef = ref()
const tableRef = ref()

const mailLogList = ref<MessageMailLog[]>([])
const loading = ref<boolean>(true)
const ids = ref<number[]>([])
const multiple = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<MessageMailLogQuery>({
  pageNo: 1,
  pageSize: 10,
  templateTitle: undefined
})

// 详情弹窗引用
const detailRef = ref<InstanceType<typeof MailLogDetail>>()

/** 查询邮件日志列表 */
function getDataList() {
  loading.value = true
  getMailLogPage(queryParams.value).then(response => {
    mailLogList.value = response.data?.list || []
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
function handleSelectionChange(selection: MessageMailLog[]) {
  ids.value = selection.map(item => item.id!)
  multiple.value = !selection.length
}

/** 删除按钮操作 */
function handleDelete(row?: MessageMailLog) {
  const deleteIds = row?.id !== undefined ? [row.id] : (ids.value || [])
  if (deleteIds.length === 0) {
    ElMessage.warning('请选择删除记录')
    return
  }
  ElMessageBox.confirm('是否确认删除邮件日志编号为"' + deleteIds + '"的数据项？').then(function() {
    return deleteMailLogs(deleteIds)
  }).then(() => {
    getDataList()
    ElMessage.success("删除成功")
  }).catch(() => {})
}

/** 详情按钮操作 */
function detailHandle(row: MessageMailLog) {
  detailRef.value?.open(row)
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
