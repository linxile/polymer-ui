<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input
            v-model="queryParams.columnType"
            placeholder="字段类型"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
            v-model="queryParams.attrType"
            placeholder="属性类型"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'gen:fieldtype:save'" type="primary" @click="handleAdd">
          新增
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'gen:fieldtype:delete'" type="danger" :disabled="multiple" @click="handleDelete">
          删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        :data="fieldTypeList"
        border
        style="width: 100%"
        ref="tableRef"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="columnType" label="字段类型" header-align="center" align="center"></el-table-column>
      <el-table-column prop="attrType" label="属性类型" header-align="center" align="center"></el-table-column>
      <el-table-column prop="packageName" label="属性包名" header-align="center" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template #default="scope">
          <el-button
              v-auth="'gen:fieldtype:update'"
              type="primary"
              link
              icon="Edit"
              @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
              v-auth="'gen:fieldtype:delete'"
              type="primary"
              link
              icon="Delete"
              @click="handleDelete(scope.row)"
          >删除</el-button>
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
  </el-card>
</template>

<script setup lang="ts" name="FieldTypeIndex">
import { onMounted, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { FieldType } from '@/types/api/gen/field-type'
import { GenQuery } from '@/types/api/gen/base-class'
import { deleteFieldTypes, getFieldTypePage } from '@/api/gen/field-type'
import { ElMessage, ElMessageBox } from 'element-plus'

const queryRef = ref()
const tableRef = ref()

const fieldTypeList = ref<FieldType[]>([])
const loading = ref<boolean>(true)
const ids = ref<number[]>([])
const multiple = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<GenQuery>({
  pageNo: 1,
  pageSize: 10,
  columnType: undefined,
  attrType: undefined
})

// 新增/修改弹窗引用
const addOrUpdateRef = ref<InstanceType<typeof AddOrUpdate>>()

/** 查询字段类型列表 */
function getDataList() {
  loading.value = true
  getFieldTypePage(queryParams.value).then(response => {
    fieldTypeList.value = response.data?.list || []
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
function handleSelectionChange(selection: FieldType[]) {
  ids.value = selection.map(item => item.id!)
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  addOrUpdateRef.value?.open()
}

/** 修改按钮操作 */
function handleUpdate(row: FieldType) {
  addOrUpdateRef.value?.openWithData(row.id!)
}

/** 删除按钮操作 */
function handleDelete(row?: FieldType) {
  const deleteIds = row?.id !== undefined ? [row.id] : (ids.value || [])
  if (deleteIds.length === 0) {
    ElMessage.warning('请选择删除记录')
    return
  }
  ElMessageBox.confirm('是否确认删除字段类型编号为"' + deleteIds + '"的数据项？').then(function() {
    return deleteFieldTypes(deleteIds)
  }).then(() => {
    getDataList()
    ElMessage.success("删除成功")
  }).catch(() => {})
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
