<template>
  <el-card class="mod__menu">
    <el-form :inline="true">
      <el-form-item>
        <el-button v-auth="'sys:menu:save'" type="primary" @click="handleAdd()">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button plain @click="toggleExpandAll()">
          <template v-if="!isExpandAll">
            全部展开&nbsp;<el-icon><ArrowDown /></el-icon>
          </template>
          <template v-else>
            全部收起&nbsp;<el-icon><ArrowUp /></el-icon>
          </template>
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-if="refreshTable"
        v-loading="loading"
        :default-expand-all="isExpandAll"
        :data="menuList"
        show-overflow-tooltip
        row-key="id"
        border
        style="width: 100%"
    >
      <el-table-column prop="name" label="名称" header-align="center" min-width="150"></el-table-column>
      <el-table-column prop="icon" label="图标" header-align="center" align="center">
        <template #default="scope">
          <svg-icon :icon="scope.row.icon || 'default-icon'"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" header-align="center" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.type === 0" type="info">菜单</el-tag>
          <el-tag v-if="scope.row.type === 1" type="success">按钮</el-tag>
          <el-tag v-if="scope.row.type === 2" type="warning">接口</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="openStyle" label="打开方式" header-align="center" align="center">
        <template #default="scope">
          <span v-if="scope.row.type !== 0"></span>
          <el-tag v-else-if="scope.row.openStyle === 0">内部打开</el-tag>
          <el-tag v-else type="info">外部打开</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" header-align="center" align="center"></el-table-column>
      <el-table-column prop="url" label="路由" header-align="center" align="center" width="150"></el-table-column>
      <el-table-column prop="authority" label="授权标识" header-align="center" align="center" width="150"></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="160">
        <template #default="scope">
          <el-button v-if="scope.row.type === 0" v-auth="'sys:menu:save'" type="primary" link @click="handleAdd(scope.row)"
          >新增</el-button
          >
          <el-button v-auth="'sys:menu:update'" type="primary" link icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-auth="'sys:menu:delete'" type="primary" link icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update ref="addOrUpdateRef" @success="getDataList"></add-or-update>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { SysMenu } from '@/types/api/sys/menu'
import { deleteMenu, useMenuListApi } from '@/api/sys/menu'
import { ElMessage, ElMessageBox } from 'element-plus'

const menuList = ref<SysMenu[]>([])
const loading = ref<boolean>(true)

// 新增/修改弹窗引用
const addOrUpdateRef = ref<InstanceType<typeof AddOrUpdate>>()

// 是否展开，默认全部折叠
const isExpandAll = ref(false)
// 是否重新渲染表格状态
const refreshTable = ref(true)

/** 查询菜单列表 */
function getDataList() {
  loading.value = true
  useMenuListApi().then(response => {
    menuList.value = response.data || []
    loading.value = false
  })
}

/** 新增按钮操作 */
function handleAdd(row?: SysMenu) {
  addOrUpdateRef.value?.open(row)
}

/** 修改按钮操作 */
function handleUpdate(row: SysMenu) {
  addOrUpdateRef.value?.openWithData(row.id!)
}

/** 删除按钮操作 */
function handleDelete(row: SysMenu) {
  ElMessageBox.confirm('是否确认删除菜单编号为"' + row.id + '"的数据项？').then(function() {
    return deleteMenu(row.id!)
  }).then(() => {
    getDataList()
    ElMessage.success("删除成功")
  }).catch(() => {})
}

/** 切换 展开和折叠 */
function toggleExpandAll() {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
