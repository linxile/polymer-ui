<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input
            v-model="queryParams.name"
            placeholder="附件名称"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
            v-model="queryParams.platform"
            placeholder="存储平台"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item v-auth="'sys:attachment:save'">
        <Upload
            ref="uploadRef"
            :accept="[]"
            :max-size="100"
            :no-file-list="true"
            @success="handleUploadSuccess"
            @error="handleUploadError">
          <template #upload>
            <el-button type="primary" :loading="uploadLoading">上传</el-button>
          </template>
        </Upload>
      </el-form-item>
      <el-form-item>
        <el-button
            v-auth="'sys:attachment:delete'"
            type="danger"
            :disabled="multiple"
            @click="handleDelete"
        >删除</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        show-overflow-tooltip
        :data="attachmentList"
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
          label="附件名称"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="url"
          label="附件地址"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column prop="size" label="附件大小" header-align="center" align="center">
        <template #default="scope">
          {{ convertSizeFormat(scope.row.size) }}
        </template>
      </el-table-column>
      <el-table-column
          prop="platform"
          label="存储平台"
          header-align="center"
          align="center"
      ></el-table-column>
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
          width="150"
      >
        <template #default="scope">
          <el-button
              type="primary"
              link
              icon="Download"
              @click="downloadHandle(scope.row.url, scope.row.name)"
          >下载</el-button
          >
          <el-button
              v-auth="'sys:attachment:delete'"
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
  </el-card>
</template>

<script setup lang="ts" name="SysAttachmentIndex">
import { onMounted, ref } from 'vue'
import { convertSizeFormat } from '@/utils/tool'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps } from 'element-plus'
import { deleteAttachments, getAttachmentPage, submitAttachment } from '@/api/sys/attachment'
import type { SysAttachment, SysAttachmentQuery } from '@/types/api/sys/attachment'
import type { SysFileUpload } from '@/types/api/storage/file'
import Upload from '@/components/upload/index.vue'
import {download} from "@/utils/useFileDownload";

const queryRef = ref()
const tableRef = ref()

const attachmentList = ref<SysAttachment[]>([])
const loading = ref<boolean>(true)
const ids = ref<number[]>([])
const multiple = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<SysAttachmentQuery>({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  platform: undefined
})

const uploadRef = ref<InstanceType<typeof Upload>>()
const uploadLoading = ref(false)

/** 查询附件列表 */
function getDataList() {
  loading.value = true
  getAttachmentPage(queryParams.value).then(response => {
    attachmentList.value = response.data?.list || []
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
function handleSelectionChange(selection: SysAttachment[]) {
  ids.value = selection.map(item => item.id!)
  multiple.value = !selection.length
}

/** 上传成功回调 */
function handleUploadSuccess(result: SysFileUpload): void {
  // 保存附件记录到后端
  submitAttachment(result as any)
      .then(() => {
        ElMessage.success('保存附件记录成功')
        getDataList()
        // 重置上传组件的 loading 状态
        uploadRef.value?.resetUploadStatus()
      })
      .catch((error) => {
        const message = error?.message || '保存附件记录失败'
        ElMessage.error(message)
      })
}

/** 上传失败回调 */
function handleUploadError(error: Error): void {
  ElMessage.error(`上传失败：${error.message}`)
}

/** 上传前校验 */
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  // 校验文件大小（100MB）
  const maxSize = 100 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.error('文件大小不能超过 100MB')
    return false
  }
  return true
}

/** 删除按钮操作 */
function handleDelete(row?: SysAttachment) {
  const deleteIds = row?.id !== undefined ? [row.id] : (ids.value || [])
  if (deleteIds.length === 0) {
    ElMessage.warning('请选择删除记录')
    return
  }
  ElMessageBox.confirm('是否确认删除附件编号为"' + deleteIds + '"的数据项？').then(function() {
    return deleteAttachments(deleteIds)
  }).then(() => {
    getDataList()
    ElMessage.success("删除成功")
  }).catch(() => {})
}

/** 文件下载 */
function downloadHandle(url: string, filename: string) {
  download(url, filename)
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
