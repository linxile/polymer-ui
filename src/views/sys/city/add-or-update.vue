<template>
  <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" @closed="handleClosed">
    <el-form ref="cityRef" :model="form" :rules="rules" label-width="100px" @keyup.enter="submitForm()">
      <!-- 父级ID（仅用于数据传递，不展示） -->
      <el-form-item label="父级ID" v-show="false">
        <el-input v-model="form.pid" placeholder="父级ID" disabled></el-input>
      </el-form-item>
      <el-form-item label="城市名称" prop="name">
        <el-input v-model="form.name" placeholder="城市名称"></el-input>
      </el-form-item>
      <el-form-item label="城市拼音" prop="pinyin">
        <el-input v-model="form.pinyin" placeholder="城市拼音"></el-input>
      </el-form-item>
      <el-form-item label="城市简称" prop="shortName">
        <el-input v-model="form.shortName" placeholder="城市简称"></el-input>
      </el-form-item>
      <el-form-item label="行政编码" prop="areaCode">
        <el-input v-model="form.areaCode" placeholder="行政编码"></el-input>
      </el-form-item>
      <el-form-item label="城市区号" prop="cityCode">
        <el-input v-model="form.cityCode" placeholder="城市区号"></el-input>
      </el-form-item>
      <el-form-item label="城市等级" prop="level">
        <fast-radio-group v-model="form.level" dict-type="city_level"></fast-radio-group>
      </el-form-item>
      <el-form-item label="邮政编码" prop="zipCode">
        <el-input v-model="form.zipCode" placeholder="邮政编码"></el-input>
      </el-form-item>
      <el-form-item label="城市经度" prop="longitude">
        <el-input v-model="form.longitude" placeholder="城市经度"></el-input>
      </el-form-item>
      <el-form-item label="城市纬度" prop="latitude">
        <el-input v-model="form.latitude" placeholder="城市纬度"></el-input>
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
import { getCityById, submitCity } from '@/api/sys/city'
import { SysCity } from '@/types/api/sys/city'

const props = defineProps({
  pid: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits<{ (e: 'success'): void }>()
const cityRef = ref()
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)

const form = ref<SysCity>({
  id: undefined,
  pid: props.pid,
  name: '',
  pinyin: '',
  shortName: '',
  fullName: '',
  areaCode: '',
  cityCode: '',
  parentCode: '',
  level: undefined,
  zipCode: '',
  longitude: '',
  latitude: '',
  haveChild: false
})

const rules = {
  name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  level: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  areaCode: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗（新增，可带父级ID） */
function open(pid?: number) {
  reset()
  isEdit.value = false
  title.value = "添加城市"
  form.value.pid = pid !== undefined ? pid : props.pid
  dialogVisible.value = true
}

/** 打开弹窗（修改） */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "修改城市"
  getCityById(id).then(response => {
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
    pid: props.pid,
    name: '',
    pinyin: '',
    shortName: '',
    fullName: '',
    areaCode: '',
    cityCode: '',
    parentCode: '',
    level: undefined,
    zipCode: '',
    longitude: '',
    latitude: '',
    haveChild: false
  }

  if (cityRef.value) {
    cityRef.value.resetFields()
  }
}

/** 提交按钮 */
function submitForm() {
  cityRef.value.validate((valid: boolean) => {
    if (valid) {
      // 新增时确保父级ID正确
      if (!form.value.id && form.value.pid === undefined) {
        form.value.pid = props.pid
      }

      const msg = isEdit.value ? "修改成功" : "新增成功"
      submitCity(form.value).then(() => {
        ElMessage.success(msg)
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>
