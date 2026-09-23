<template>
  <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" draggable @closed="handleClosed">
    <el-form ref="multipleFilesRef" :model="form" :rules="rules" label-width="100px" @keyup.enter="submitForm()">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <WangEditor :key="editorKey" v-model="form.description" :style="'height: 300px'" placeholder="请输入..."></WangEditor>
      </el-form-item>
      <!-- ========== 图片上传 ========== -->
      <el-form-item prop="images" label="图片">
        <UploadComponent
            v-model:file-list="form.images"
            only-image
            :accept="['jpg', 'png', 'jpeg', 'gif', 'webp']"
            :max-size="20"
            :max-count="9"
            @error="handleUploadError"
        />
        <div style="margin-top: 6px; color: #909399; font-size: 12px">
          共 {{ form.images?.length || 0 }} 张图片，最多 9 张
        </div>
      </el-form-item>

      <!-- ========== 附件上传 ========== -->
      <el-form-item prop="attachments" label="附件">
        <UploadComponent
            v-model:file-list="form.attachments"
            :accept="[]"
            :max-size="50"
            @error="handleUploadError"
        >
          <template #upload>
            <el-button type="primary" size="small">
              <el-icon><Upload /></el-icon>
              选择附件
            </el-button>
          </template>
        </UploadComponent>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { Upload } from '@element-plus/icons-vue'
import UploadComponent from '@/components/upload/index.vue'
import WangEditor from '@/components/wang-editor/index.vue'
import { getMultipleFilesById, submitMultipleFiles } from '@/api/demo/multiple-files'
import { DemoMultipleFiles } from '@/types/api/demo/multiple-files'

const emit = defineEmits<{ (e: 'success'): void }>()
const multipleFilesRef = ref()
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)
const editorKey = ref(0) // 用于强制重新创建编辑器

const form = ref<DemoMultipleFiles>({
  id: undefined,
  name: '',
  description: '',
  images: [],
  attachments: [],
  deptId: undefined
})

const rules = {
  name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗（新增） */
function open() {
  reset()
  isEdit.value = false
  title.value = "添加多文件上传样例"
  dialogVisible.value = true
}

/** 打开弹窗（修改） */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "修改多文件上传样例"
  getMultipleFilesById(id).then(response => {
    const data = response.data!
    // 处理可能为 null 的字段
    data.description = data.description ?? ''
    data.attachments = Array.isArray(data.attachments) ? data.attachments : []
    data.images = Array.isArray(data.images) ? data.images : []
    form.value = data
    dialogVisible.value = true
  })
}

/** 关闭弹窗 */
function cancel() {
  dialogVisible.value = false
}

/** 弹窗关闭后重置表单 */
function handleClosed() {
  reset()
}

/** 对外暴露方法 */
defineExpose({
  open,
  openWithData
})

/** 表单重置 */
function reset() {
  // 每次重置时增加 editorKey，强制 WangEditor 重新创建
  editorKey.value += 1

  form.value = {
    id: undefined,
    name: '',
    description: '',
    images: [],
    attachments: [],
    deptId: undefined
  }

  if (multipleFilesRef.value) {
    multipleFilesRef.value.resetFields()
  }
}

/** 上传错误回调 */
function handleUploadError(error: Error) {
  ElMessage.error(error.message || '上传失败')
}

/** 提交按钮 */
function submitForm() {
  multipleFilesRef.value.validate((valid: boolean) => {
    if (valid) {
      const msg = isEdit.value ? "修改成功" : "新增成功"
      submitMultipleFiles(form.value).then(() => {
        ElMessage.success(msg)
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>
