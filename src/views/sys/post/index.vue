<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input
          v-model="queryParams.postCode"
          placeholder="岗位编码"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="queryParams.postName"
          placeholder="岗位名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <fast-select
          v-model="queryParams.status"
          dict-type="post_status"
          clearable
          placeholder="状态"
          style="width: 80px"
        ></fast-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'sys:post:save'" type="primary" @click="handleAdd">
          新增
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'sys:post:update'" type="success" :disabled="single" @click="handleUpdate">
          修改
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'sys:post:delete'" type="danger" :disabled="multiple" @click="handleDelete">
          删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="postList"
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
        prop="postCode"
        label="岗位编码"
        header-align="center"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="postName"
        label="岗位名称"
        header-align="center"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        header-align="center"
        align="center"
      ></el-table-column>
      <fast-table-column
        prop="status"
        label="状态"
        dict-type="post_status"
      ></fast-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        header-align="center"
        align="center"
        width="150"
      >
        <template #default="scope">
          <el-button
            v-auth="'sys:post:update'"
            type="primary"
            link
            icon="Edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            v-auth="'sys:post:delete'"
            type="primary"
            link
            icon="Delete"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
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
  </el-card>
</template>

<script setup lang="ts" name="Post">
import {onMounted, ref} from 'vue';
import AddOrUpdate from './add-or-update.vue';
import {SysPost, SysPostQuery} from "@/types/api/sys/post";
import {deletePosts, getPostPage} from "@/api/sys/post";
import {ElMessage, ElMessageBox} from "element-plus";

const queryRef = ref()
const tableRef = ref();

const postList = ref<SysPost[]>([])
const loading = ref<boolean>(true)
const ids = ref<number[]>([])
const single = ref<boolean>(true)
const multiple = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<SysPostQuery>({
  pageNo: 1,
  pageSize: 10,
  postCode: undefined,
  postName: undefined,
  status: undefined
})

// 新增/修改弹窗引用
const addOrUpdateRef = ref<InstanceType<typeof AddOrUpdate>>()

/** 查询岗位列表 */
function getDataList() {
  loading.value = true
  getPostPage(queryParams.value).then(response => {
    postList.value = response.data?.list || []
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
function handleSelectionChange(selection: SysPost[]) {
  ids.value = selection.map(item => item.id!)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  addOrUpdateRef.value?.open()
}

/** 修改按钮操作 */
function handleUpdate(row?: SysPost) {
  const postId = row?.id || ids.value[0]
  addOrUpdateRef.value?.openWithData(postId)
}

/** 删除按钮操作 */
function handleDelete(row?: SysPost) {
  const postIds = row?.id !== undefined ? [row.id] : (ids.value || [])
  ElMessageBox.confirm('是否确认删除岗位编号为"' + postIds + '"的数据项？').then(function() {
    return deletePosts(postIds)
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
