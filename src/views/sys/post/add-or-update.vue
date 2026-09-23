<template>
	<el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" draggable @closed="handleClosed">
		<el-form ref="postRef" :model="form" :rules="rules" label-width="80px" >
			<el-form-item label="岗位编码" prop="postCode">
				<el-input v-model="form.postCode"></el-input>
			</el-form-item>
			<el-form-item label="岗位名称" prop="postName">
				<el-input v-model="form.postName"></el-input>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input-number v-model="form.sort" :min="0"></el-input-number>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<fast-radio-group v-model="form.status" dict-type="post_status"></fast-radio-group>
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
import { getPostById, submitPost } from '@/api/sys/post'
import {SysPost} from "@/types/api/sys/post";

const emit = defineEmits<{(e: 'success'): void }>()
const postRef = ref()
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)

const form = ref<SysPost>({
	id: undefined,
	postCode: '',
	postName: '',
	sort: 0,
	status: 1
})

const rules = {
  postCode: [{required: true, message: '必填项不能为空', trigger: 'blur'}],
  postName: [{required: true, message: '必填项不能为空', trigger: 'blur'}],
}

/** 打开弹窗（新增） */
function open() {
  reset()
  isEdit.value = false
  title.value = "添加岗位"
  dialogVisible.value = true
}

/** 打开弹窗（修改） */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "修改岗位"
  getPostById(id).then(response => {
    form.value = response.data!
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
  form.value = {
    id: undefined,
    postCode: '',
    postName: '',
    sort: 0,
    status: 1,
  };

  if (postRef.value) {
    postRef.value.resetFields()
  }
}

/** 提交按钮 */
function submitForm() {
  postRef.value.validate((valid: boolean) => {
    if (valid) {
      const msg = isEdit.value ? "修改成功" : "新增成功"
      submitPost(form.value).then(() => {
        ElMessage.success(msg)
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>
