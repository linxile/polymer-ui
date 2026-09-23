<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input
            v-model="queryParams.templateCode"
            placeholder="模板编码"
            clearable
        ></el-input>
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
        <el-button
            v-auth="'message:notifyMessage:update'"
            type="primary"
            :disabled="multiple"
            @click="handleMarkRead"
        >标记已读</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
            v-auth="'message:notifyMessage:update'"
            type="primary"
            @click="handleMarkAllRead"
        >全部已读</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        :data="notifyMessageList"
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
          prop="templateCode"
          label="模板编码"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="sender"
          label="发送人"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="content"
          label="内容"
          header-align="center"
          align="center"
      ></el-table-column>
      <fast-table-column
          prop="type"
          label="类型"
          dict-type="notify_type"
          align="center"
          width="100"
      ></fast-table-column>
      <el-table-column
          prop="readStatus"
          label="是否已读"
          header-align="center"
          align="center"
          width="100"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.readStatus" type="success">已读</el-tag>
          <el-tag v-else type="info">未读</el-tag>
        </template>
      </el-table-column>
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
          width="100"
      >
        <template #default="scope">
          <el-button
              v-auth="'message:notifyMessage:info'"
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

    <!-- 详情弹窗 -->
    <detail ref="detailRef"></detail>
  </el-card>
</template>

<script setup lang="ts" name="MessageNotifyMessageIndex">
import { onMounted, ref } from 'vue'
import Detail from './add-or-update.vue'
import { MessageNotifyMessage, MessageNotifyMessageQuery } from '@/types/api/message/notify-message'
import {
  getNotifyMessagePage,
  updateAllNotifyMessageRead,
  updateNotifyMessageRead
} from '@/api/message/notify-message'
import { ElMessage, ElMessageBox } from 'element-plus'

const queryRef = ref()
const tableRef = ref()

const notifyMessageList = ref<MessageNotifyMessage[]>([])
const loading = ref<boolean>(true)
const ids = ref<number[]>([])
const multiple = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<MessageNotifyMessageQuery>({
  pageNo: 1,
  pageSize: 10,
  templateCode: undefined,
  type: undefined,
  createTime: undefined
})

// 详情弹窗引用
const detailRef = ref<InstanceType<typeof Detail>>()

/** 查询站内信消息列表 */
function getDataList() {
  loading.value = true
  getNotifyMessagePage(queryParams.value).then(response => {
    notifyMessageList.value = response.data?.list || []
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
  queryParams.value.createTime = undefined
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection: MessageNotifyMessage[]) {
  ids.value = selection.map(item => item.id!)
  multiple.value = !selection.length
}

/** 详情按钮操作 */
function detailHandle(row: MessageNotifyMessage) {
  detailRef.value?.open(row)
}

/** 标记选中为已读 */
function handleMarkRead() {
  if (ids.value.length === 0) {
    ElMessage.warning('请选择要标记的消息')
    return
  }
  ElMessageBox.confirm(`确定将选中的 ${ids.value.length} 条消息标记为已读?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    updateNotifyMessageRead(ids.value).then(() => {
      ElMessage.success('标记成功')
      getDataList()
    })
  }).catch(() => {})
}

/** 标记全部为已读 */
function handleMarkAllRead() {
  ElMessageBox.confirm('确定将所有消息标记为已读?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    updateAllNotifyMessageRead().then(() => {
      ElMessage.success('标记成功')
      getDataList()
    })
  }).catch(() => {})
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
