<template>
  <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" draggable @closed="handleClosed">
    <el-form ref="generatorRef" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="表名" prop="tableName">
            <el-input v-model="form.tableName" disabled placeholder="表名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="说明" prop="tableComment">
            <el-input v-model="form.tableComment" placeholder="说明"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="类名" prop="className">
            <el-input v-model="form.className" placeholder="类名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="baseclassId" label="继承">
            <el-select v-model="form.baseclassId" placeholder="继承" style="width: 100%" clearable>
              <el-option
                  v-for="item in baseClassList"
                  :key="item.id"
                  :label="item.code"
                  :value="item.id!"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="模块名" prop="moduleName">
            <el-input v-model="form.moduleName" placeholder="模块名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="功能名" prop="functionName">
            <el-input v-model="form.functionName" placeholder="功能名"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目包名" prop="packageName">
            <el-input v-model="form.packageName" placeholder="项目包名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版本号" prop="version">
            <el-input v-model="form.version" placeholder="版本号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="默认作者" prop="author">
            <el-input v-model="form.author" placeholder="默认作者"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作者邮箱" prop="email">
            <el-input v-model="form.email" placeholder="作者邮箱"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="生成方式" prop="generatorType">
            <el-radio-group v-model="form.generatorType">
              <el-radio :value="0" label="zip压缩包" />
              <el-radio :value="1" label="自定义路径" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表单布局" prop="formLayout">
            <el-radio-group v-model="form.formLayout">
              <el-radio :value="1" label="一列" />
              <el-radio :value="2" label="两列" />
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="form.generatorType === 1" label="后端生成路径" prop="backendPath">
        <el-input v-model="form.backendPath" placeholder="后端生成路径"></el-input>
      </el-form-item>
      <el-form-item v-if="form.generatorType === 1" label="前端生成路径" prop="frontendPath">
        <el-input v-model="form.frontendPath" placeholder="前端生成路径"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm()">保存</el-button>
      <el-button type="danger" @click="generatorHandle()">生成代码</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useBaseClassListApi } from '@/api/gen/base-class'
import { useGeneratorApi, getDownloadUrl } from '@/api/gen/generator'
import { getTableById, submitTable } from '@/api/gen/table'
import { TableEntity } from '@/types/api/gen/table-entity'
import { BaseClass } from '@/types/api/gen/base-class'

const emit = defineEmits<{ (e: 'success'): void }>()
const generatorRef = ref()
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)

const baseClassList = ref<BaseClass[]>([])

const form = ref<TableEntity>({
  id: undefined,
  baseclassId: undefined,
  generatorType: 0,
  formLayout: 1,
  backendPath: '',
  frontendPath: '',
  packageName: '',
  email: '',
  author: '',
  version: '',
  moduleName: '',
  functionName: '',
  className: '',
  tableComment: '',
  tableName: ''
})

const rules = {
  tableName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  tableComment: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  className: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  packageName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  author: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  moduleName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  functionName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  generatorType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  formLayout: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  backendPath: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  frontendPath: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗 */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "生成代码"
  dialogVisible.value = true
  getBaseClassList()
  getTable(id)
}

/** 关闭弹窗 */
function cancel() {
  dialogVisible.value = false
}

/** 弹窗关闭后重置 */
function handleClosed() {
  reset()
}

/** 对外暴露方法 */
defineExpose({
  openWithData
})

/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    baseclassId: undefined,
    generatorType: 0,
    formLayout: 1,
    backendPath: '',
    frontendPath: '',
    packageName: '',
    email: '',
    author: '',
    version: '',
    moduleName: '',
    functionName: '',
    className: '',
    tableComment: '',
    tableName: ''
  }

  if (generatorRef.value) {
    generatorRef.value.resetFields()
  }
}

/** 获取基类列表 */
function getBaseClassList() {
  useBaseClassListApi().then(res => {
    baseClassList.value = res.data || []
  })
}

/** 获取表信息 */
function getTable(id: number) {
  getTableById(id).then(res => {
    form.value = res.data!
  })
}

/** 保存 */
function submitForm() {
  generatorRef.value.validate((valid: boolean) => {
    if (!valid) return false

    submitTable(form.value).then(() => {
      ElMessage.success('操作成功')
      dialogVisible.value = false
      emit('success')
    })
  })
}

/** 生成代码 */
function generatorHandle() {
  generatorRef.value.validate(async (valid: boolean) => {
    if (!valid) return false

    // 先保存
    await submitTable(form.value)

    // zip 压缩包：直接用 URL 下载
    if (form.value.generatorType === 0) {
      window.open(getDownloadUrl([form.value.id!]), '_blank')
      dialogVisible.value = false
      return
    }

    // 自定义路径：调用生成接口
    useGeneratorApi([form.value.id!]).then(() => {
      ElMessage.success('操作成功')
      dialogVisible.value = false
      emit('success')
    })
  })
}
</script>
