<template>
  <el-dialog v-model="dialogVisible" title="导入数据库表" :close-on-click-modal="false" draggable @closed="handleClosed">
    <el-form ref="importRef" :model="form">
      <el-row>
        <el-col :span="8">
          <el-form-item label="数据源" prop="datasourceId">
            <el-select v-model="form.datasourceId" style="width: 100%" placeholder="请选择数据源" @change="getTableList">
              <el-option label="默认数据源" :value="0"></el-option>
              <el-option
                  v-for="ds in datasourceList"
                  :key="ds.id"
                  :label="ds.connName"
                  :value="ds.id!"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="表名" prop="tableName" :label-width="80">
            <el-input
                v-model="form.tableName"
                placeholder="请输入表名"
                style="width: 100%"
                @input="getTableList"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-table
          :data="tableList"
          border
          style="width: 100%"
          :max-height="400"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" header-align="center" align="center" width="60"></el-table-column>
        <el-table-column prop="tableName" label="表名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="tableComment" label="表说明" header-align="center" align="center"></el-table-column>
      </el-table>
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
import { useDataSourceListApi, useDataSourceTableListApi } from '@/api/gen/datasource'
import { importTables } from '@/api/gen/table'
import { Datasource } from '@/types/api/gen/datasource'
import { TableEntity } from '@/types/api/gen/table-entity'

const emit = defineEmits<{ (e: 'success'): void }>()
const importRef = ref()
const dialogVisible = ref<boolean>(false)

const datasourceList = ref<Datasource[]>([])
const tableList = ref<TableEntity[]>([])
const selectedTables = ref<string[]>([])

const form = ref<{
  datasourceId: number
  tableName: string
}>({
  datasourceId: 0,
  tableName: ''
})

/** 打开弹窗 */
function open() {
  reset()
  dialogVisible.value = true
  getDataSourceList()
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
  open
})

/** 表单重置 */
function reset() {
  form.value = {
    datasourceId: 0,
    tableName: ''
  }
  tableList.value = []
  selectedTables.value = []
}

/** 多选 */
function handleSelectionChange(selection: TableEntity[]) {
  selectedTables.value = selection.map(item => item.tableName!)
}

/** 获取数据源列表 */
function getDataSourceList() {
  useDataSourceListApi().then(res => {
    datasourceList.value = res.data || []
  })
}

/** 获取表列表 */
function getTableList() {
  useDataSourceTableListApi(form.value.datasourceId, form.value.tableName).then(res => {
    tableList.value = res.data || []
  })
}

/** 提交按钮 */
function submitForm() {
  if (selectedTables.value.length === 0) {
    ElMessage.warning('请选择记录')
    return
  }

  importTables(form.value.datasourceId, selectedTables.value).then(() => {
    ElMessage.success('操作成功')
    dialogVisible.value = false
    emit('success')
  })
}
</script>
