<template>
  <div class="app-container tree-sidebar-manage-wrap">
    <tree-panel title="组织机构"
                :tree-data="deptOptions"
                search-placeholder="请输入部门名称"
                storage-key="dept-sidebar-width"
                :defaultExpandAll="true"
                @node-click="handleDeptClick"
                @refresh="getDeptTree"
                ref="deptTreeRef" />
    <div class="tree-sidebar-content">
      <div class="content-inner">
        <el-form :inline="true" :model="queryParams" ref="queryRef">
          <el-form-item>
            <el-input v-model="queryParams.username" placeholder="用户名" clearable/>
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryParams.mobile" placeholder="手机号" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-auth="'sys:user:save'" type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-auth="'sys:user:delete'" type="danger" @click="handleDelete">删除</el-button>
          </el-form-item>
          <el-form-item v-auth="'sys:user:import'">
            <DataImport
                ref="dataImportRef"
                import-url="/sys/user/import"
                :accept="['xlsx', 'xls']"
                :max-size="2"
                :max-records="10000"
                business-name="用户"
                business-type="user"
                templateUrl="/sys/user/exportTemplate"
                duplicate-fields-api="/sys/user/uniqueFields"
                @success="handleImportSuccess"
                @error="handleImportError"/>
          </el-form-item>
          <el-form-item>
            <el-button v-auth="'sys:user:export'" type="warning" @click="handleExport">导出</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" ref="tableRef" show-overflow-tooltip :data="userList" border style="width: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="username" label="用户账号" header-align="center" align="center"></el-table-column>
          <el-table-column prop="realName" label="用户姓名" header-align="center" align="center"></el-table-column>
          <fast-table-column prop="gender" label="用户性别" dict-type="user_gender"></fast-table-column>
          <el-table-column prop="mobile" label="手机号码" header-align="center" align="center"></el-table-column>
          <el-table-column prop="deptName" label="所属部门" header-align="center" align="center"></el-table-column>
          <fast-table-column prop="status" label="用户状态" dict-type="user_status"></fast-table-column>
          <el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
          <el-table-column label="操作" fixed="right" header-align="center" align="center" width="120">
            <template #default="scope">
              <el-button v-auth="'sys:user:update'" type="primary" link @click="handleUpdate(scope.row)">修改</el-button>
              <el-button v-auth="'sys:user:delete'" type="primary" link @click="handleDelete(scope.row.id)">删除</el-button>
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
      </div>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <AddOrUpdate ref="addOrUpdateRef" @success="getDataList"/>
  </div>
</template>

<script setup lang="ts" name="SysUserIndex">
  import {onMounted, ref} from 'vue';
  import AddOrUpdate from './add-or-update.vue';
  import { useDeptListApi } from '@/api/sys/dept'
  import DataImport from '@/components/upload/dataImport.vue'
  import TreePanel from '@/components/tree-panel/index.vue'
  import type {TreeNode} from '@/types/api/common'
  import {SysUser, SysUserQuery} from "@/types/api/sys/user";
  import {deleteUsers, getUserPage} from "@/api/sys/user";
  import {ElMessage, ElMessageBox} from "element-plus";
  import {exportFile2} from "@/utils/download";

  const queryRef = ref()
  const tableRef = ref();

  const userList = ref<SysUser[]>([])
  const loading = ref<boolean>(true)
  const ids = ref<number[]>([])
  const single = ref<boolean>(true)
  const multiple = ref<boolean>(true)
  const total = ref<number>(0)

  const dataImportRef = ref()
  const addOrUpdateRef = ref<InstanceType<typeof AddOrUpdate>>()
  const deptOptions = ref<TreeNode[] | undefined>(undefined)

  const queryParams = ref<SysUserQuery>({
    pageNo: 1,
    pageSize: 10,
    username: undefined,
    mobile: undefined,
    gender: undefined,
    deptId: undefined
  })

  /** 查询岗位列表 */
  function getDataList() {
    loading.value = true
    getUserPage(queryParams.value).then(response => {
      userList.value = response.data?.list || []
      total.value = response.data?.total || 0
      loading.value = false
    })
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    queryParams.value.pageNo = 1
    getDataList()
  }

  /** 多选框选中数据 */
  function handleSelectionChange(selection: SysUser[]) {
    ids.value = selection.map(item => item.id!)
    single.value = selection.length != 1
    multiple.value = !selection.length
  }

  /** 新增按钮操作 */
  function handleAdd() {
    addOrUpdateRef.value?.open()
  }

  /** 修改按钮操作 */
  function handleUpdate(row?: SysUser) {
    const postId = row?.id || ids.value[0]
    addOrUpdateRef.value?.openWithData(postId)
  }

  /** 删除按钮操作 */
  function handleDelete(row?: SysUser) {
    const postIds = row?.id !== undefined ? [row.id] : (ids.value || [])
    ElMessageBox.confirm('是否确认删除岗位编号为"' + postIds + '"的数据项？').then(function() {
      return deleteUsers(postIds)
    }).then(() => {
      getDataList()
      ElMessage.success("删除成功")
    }).catch(() => {})
  }

  /** 导出按钮操作 */
  function handleExport() {
    console.log('handleExport', queryParams.value)
    exportFile2("sys/user/export", {
      ...queryParams.value
    }, `user_${new Date().getTime()}.xlsx`)
  }


  function handleDeptClick(data: any) {
    queryParams.value.deptId = data.id;
    getDataList();
  }

  // 部门列表
  function getDeptTree() {
    useDeptListApi().then(response => {
      deptOptions.value = response.data
    })
  }

  // 不接收参数
  function handleImportSuccess() {
    getDataList()
  }

  function handleImportError() {
    getDataList()

  }

  onMounted(async () => {
    getDeptTree()
    getDataList()
  })

</script>
  <style lang="scss" scoped>
  .app-container {
    padding: 20px;
  }
  /* tree-sidebar content */
  .tree-sidebar-manage-wrap {
    display: flex;
    gap: 0;
    min-height: calc(100vh - 130px);
    padding: 0 !important;
    overflow: hidden;
  }

  .tree-sidebar-content {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    background: #fff;

    .content-inner {
      padding: 12px 16px;
      height: 100%;
      overflow-y: auto;
    }
  }
</style>
