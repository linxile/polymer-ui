<template>
  <el-drawer v-model="dialogVisible" title="编辑" :size="1200" :with-header="false" @closed="handleClosed">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="属性设置" name="field">
        <vxe-table
            ref="fieldTable"
            border
            row-key
            class="sortable-row-gen"
            :data="fieldList"
            :checkbox-config="{ checkStrictly: true }"
            :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-column type="seq" width="60"></vxe-column>
          <vxe-column width="60" title="拖动">
            <template #default>
							<span class="drag-btn">
								<i class="vxe-icon-sort"></i>
							</span>
            </template>
            <template #header>
              <el-tooltip class="item" effect="dark" content="按住后可以上下拖动排序" placement="top-start">
                <i class="vxe-icon-question-circle-fill"></i>
              </el-tooltip>
            </template>
          </vxe-column>
          <vxe-column field="fieldName" title="字段名"></vxe-column>
          <vxe-column field="fieldComment" title="说明" :edit-render="{ name: 'input' }"></vxe-column>
          <vxe-column field="fieldType" title="字段类型"></vxe-column>
          <vxe-column field="attrName" title="属性名" :edit-render="{ name: 'input' }"></vxe-column>
          <vxe-column field="attrType" title="属性类型">
            <template #default="{ row }">
              <vxe-select v-model="row.attrType">
                <vxe-option v-for="item in typeList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
              </vxe-select>
            </template>
          </vxe-column>
          <vxe-column field="autoFill" title="自动填充">
            <template #default="{ row }">
              <vxe-select v-model="row.autoFill">
                <vxe-option v-for="item in fillList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
              </vxe-select>
            </template>
          </vxe-column>
          <vxe-column field="primaryPk" title="主键">
            <template #default="{ row }">
              <vxe-checkbox v-model="row.primaryPk"></vxe-checkbox>
            </template>
          </vxe-column>
        </vxe-table>
      </el-tab-pane>
      <el-tab-pane label="表单配置" name="form">
        <vxe-table
            ref="formTable"
            border
            row-key
            :data="fieldList"
            :checkbox-config="{ checkStrictly: true }"
            :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-column field="attrName" title="属性名"></vxe-column>
          <vxe-column field="fieldComment" title="说明"></vxe-column>
          <vxe-column field="formItem" title="表单显示">
            <template #default="{ row }">
              <vxe-checkbox v-model="row.formItem"></vxe-checkbox>
            </template>
          </vxe-column>
          <vxe-column field="formRequired" title="表单必填">
            <template #default="{ row }">
              <vxe-checkbox v-model="row.formRequired"></vxe-checkbox>
            </template>
          </vxe-column>
          <vxe-column field="formValidator" title="表单效验" :edit-render="{ name: 'input' }"></vxe-column>
          <vxe-column field="formType" title="表单类型">
            <template #default="{ row }">
              <vxe-select v-model="row.formType">
                <vxe-option v-for="item in formTypeList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
              </vxe-select>
            </template>
          </vxe-column>
          <vxe-column field="formDict" title="表单字典类型" :edit-render="{ name: 'input' }"></vxe-column>
        </vxe-table>
      </el-tab-pane>
      <el-tab-pane label="列表配置" name="grid">
        <vxe-table
            ref="gridTable"
            border
            row-key
            :data="fieldList"
            :checkbox-config="{ checkStrictly: true }"
            :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-column field="attrName" title="属性名"></vxe-column>
          <vxe-column field="fieldComment" title="说明"></vxe-column>
          <vxe-column field="gridItem" title="列表显示">
            <template #default="{ row }">
              <vxe-checkbox v-model="row.gridItem"></vxe-checkbox>
            </template>
          </vxe-column>
          <vxe-column field="gridSort" title="列表排序">
            <template #default="{ row }">
              <vxe-checkbox v-model="row.gridSort"></vxe-checkbox>
            </template>
          </vxe-column>
        </vxe-table>
      </el-tab-pane>
      <el-tab-pane label="查询配置" name="query">
        <vxe-table
            ref="queryTable"
            border
            row-key
            :data="fieldList"
            :checkbox-config="{ checkStrictly: true }"
            :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-column field="attrName" title="属性名"></vxe-column>
          <vxe-column field="fieldComment" title="说明"></vxe-column>
          <vxe-column field="queryItem" title="查询显示">
            <template #default="{ row }">
              <vxe-checkbox v-model="row.queryItem"></vxe-checkbox>
            </template>
          </vxe-column>
          <vxe-column field="queryType" title="查询方式">
            <template #default="{ row }">
              <vxe-select v-model="row.queryType">
                <vxe-option v-for="item in queryList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
              </vxe-select>
            </template>
          </vxe-column>
          <vxe-column field="queryFormType" title="查询表单类型">
            <template #default="{ row }">
              <vxe-select v-model="row.queryFormType">
                <vxe-option v-for="item in formTypeList" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
              </vxe-select>
            </template>
          </vxe-column>
        </vxe-table>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm()">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { ElMessage, TabsPaneContext } from 'element-plus/es'
import Sortable from 'sortablejs'
import { getTableById, submitTableFields } from '@/api/gen/table'
import { useFieldTypeListApi } from '@/api/gen/field-type'
import { TableEntity } from '@/types/api/gen/table-entity'
import type { VxeTableInstance } from 'vxe-table'

const emit = defineEmits<{ (e: 'success'): void }>()
const dialogVisible = ref<boolean>(false)
const activeName = ref<string>('field')

const fieldTable = ref<VxeTableInstance>()
const formTable = ref<VxeTableInstance>()
const gridTable = ref<VxeTableInstance>()
const queryTable = ref<VxeTableInstance>()

const tableId = ref<number>()
const fieldList = ref<any[]>([])
const typeList = ref<{ label: string; value: string }[]>([])
const sortable = ref<any>()

const fillList = reactive([
  { label: 'DEFAULT', value: 'DEFAULT' },
  { label: 'INSERT', value: 'INSERT' },
  { label: 'UPDATE', value: 'UPDATE' },
  { label: 'INSERT_UPDATE', value: 'INSERT_UPDATE' }
])

const queryList = reactive([
  { label: '=', value: '=' },
  { label: '!=', value: '!=' },
  { label: '>', value: '>' },
  { label: '>=', value: '>=' },
  { label: '<', value: '<' },
  { label: '<=', value: '<=' },
  { label: 'like', value: 'like' },
  { label: 'between', value: 'between' }
])

const formTypeList = reactive([
  { label: '单行文本', value: 'text' },
  { label: '多行文本', value: 'textarea' },
  { label: '富文本编辑器', value: 'editor' },
  { label: '下拉框', value: 'select' },
  { label: '单选按钮', value: 'radio' },
  { label: '复选框', value: 'checkbox' },
  { label: '日期', value: 'date' },
  { label: '日期时间', value: 'datetime' },
  { label: '数字输入框', value: 'inputNumber' },
  { label: '选择用户', value: 'selectUser' }
])

/** tab 切换 */
function handleClick(tab: TabsPaneContext) {
  if (tab.paneName !== 'field') {
    formTable.value?.loadData(fieldList.value)
    gridTable.value?.loadData(fieldList.value)
    queryTable.value?.loadData(fieldList.value)
  }
}

/** 打开弹窗 */
function openWithData(id: number) {
  reset()
  tableId.value = id
  dialogVisible.value = true
  activeName.value = 'field'
  rowDrop()
  getTable(id)
  getFieldTypeList()
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
  fieldList.value = []
  typeList.value = []
  tableId.value = undefined
}

/** 拖动排序 */
function rowDrop() {
  nextTick(() => {
    const el: any = window.document.querySelector('.body--wrapper>.vxe-table--body tbody')
    if (!el) return
    sortable.value = Sortable.create(el, {
      handle: '.drag-btn',
      onEnd: (e: any) => {
        const { newIndex, oldIndex } = e
        const currRow = fieldList.value.splice(oldIndex, 1)[0]
        fieldList.value.splice(newIndex, 0, currRow)
      }
    })
  })
}

/** 获取表信息 */
function getTable(id: number) {
  getTableById(id).then(res => {
    fieldList.value = (res.data as TableEntity)?.fieldList || []
  })
}

/** 获取字段类型列表 */
async function getFieldTypeList() {
  typeList.value = []
  const { data } = await useFieldTypeListApi()
  ;(data || []).forEach((item: string) => typeList.value.push({ label: item, value: item }))
  typeList.value.push({ label: 'Object', value: 'Object' })
}

/** 提交按钮 */
function submitForm() {
  submitTableFields(tableId.value!, fieldList.value).then(() => {
    ElMessage.success('操作成功')
    dialogVisible.value = false
    emit('success')
  })
}
</script>

<style lang="scss">
.sortable-row-gen .drag-btn {
  cursor: move;
  font-size: 12px;
}

.sortable-row-gen .vxe-body--row.sortable-ghost,
.sortable-row-gen .vxe-body--row.sortable-chosen {
  background-color: #dfecfb;
}
</style>
