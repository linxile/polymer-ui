<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input
            v-model="queryParams.name"
            placeholder="角色名称"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'sys:role:save'" type="primary" @click="handleAdd">
          新增
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'sys:role:update'" type="success" :disabled="single" @click="handleUpdate">
          修改
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'sys:role:delete'" type="danger" :disabled="multiple" @click="handleDelete">
          删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
        v-loading="loading"
        :data="roleList"
        border
        style="width: 100%"
        ref="tableRef"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
      ></el-table-column>
      <el-table-column
          prop="name"
          label="角色名称"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="roleCode"
          label="角色编码"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="remark"
          label="备注"
          header-align="center"
          align="center"
      ></el-table-column>
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
          width="220"
      >
        <template #default="scope">
          <el-button
              v-auth="'sys:role:update'"
              type="primary"
              link
              icon="Edit"
              @click="handleUpdate(scope.row)"
          >修改</el-button
          >
          <el-button
              v-auth="'sys:role:delete'"
              type="primary"
              link
              icon="Delete"
              @click="handleDelete(scope.row)"
          >删除</el-button
          >
          <el-dropdown
              v-auth="'sys:role:update'"
              @command="(command: string) => handleCommand(command, scope.row)"
          >
            <el-button type="primary" class="el-dropdown-link" link>更多</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="dataScope">数据权限</el-dropdown-item>
                <el-dropdown-item command="user">分配用户</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
    <AddOrUpdate ref="addOrUpdateRef" @success="getDataList"/>
    <!-- 数据权限 -->
    <data-scope ref="dataScopeRef"></data-scope>
    <!-- 分配用户 -->
    <el-drawer
        v-if="userVisible"
        v-model="userVisible"
        :title="userTitle"
        :size="1000"
        :close-on-press-escape="false"
    >
      <user :role-id="roleId"></user>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts" name="SysRoleIndex">
import { onMounted, ref } from 'vue';
import AddOrUpdate from './add-or-update.vue';
import DataScope from './data-scope.vue';
import User from './user.vue';
import { SysRole, SysRoleQuery } from "@/types/api/sys/role";
import { deleteRoles, getRolePage } from "@/api/sys/role";
import { ElMessage, ElMessageBox } from "element-plus";

const queryRef = ref()
const tableRef = ref();

const roleList = ref<SysRole[]>([])
const loading = ref<boolean>(true)
const ids = ref<number[]>([])
const single = ref<boolean>(true)
const multiple = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<SysRoleQuery>({
  pageNo: 1,
  pageSize: 10,
  name: undefined
})

// 新增/修改弹窗引用
const addOrUpdateRef = ref<InstanceType<typeof AddOrUpdate>>()

// 数据权限弹窗引用
const dataScopeRef = ref()
// 分配用户抽屉
const userVisible = ref(false)
const roleId = ref()
const userTitle = ref()

/** 查询角色列表 */
function getDataList() {
  loading.value = true
  getRolePage(queryParams.value).then(response => {
    roleList.value = response.data?.list || []
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
function handleSelectionChange(selection: SysRole[]) {
  ids.value = selection.map(item => item.id!)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  addOrUpdateRef.value?.open()
}

/** 修改按钮操作 */
function handleUpdate(row?: SysRole) {
  const roleId = row?.id || ids.value[0]
  addOrUpdateRef.value?.openWithData(roleId)
}

/** 删除按钮操作 */
function handleDelete(row?: SysRole) {
  const roleIds = row?.id !== undefined ? [row.id] : (ids.value || [])
  ElMessageBox.confirm('是否确认删除角色编号为"' + roleIds + '"的数据项？').then(function() {
    return deleteRoles(roleIds)
  }).then(() => {
    getDataList()
    ElMessage.success("删除成功")
  }).catch(() => {})
}

/** 更多操作命令 */
function handleCommand(command: string, row: SysRole) {
  if (command === "dataScope") {
    dataScopeRef.value.init(row.id)
  } else if (command === "user") {
    roleId.value = row.id
    userTitle.value = "分配用户 - " + row.name
    userVisible.value = true
  }
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>

<style scoped>
.el-dropdown-link {
  display: flex;
  align-items: center;
  line-height: normal;
  margin-left: 10px;
}
</style>
