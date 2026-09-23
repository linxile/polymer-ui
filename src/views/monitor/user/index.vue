<template>
  <el-card>
    <el-table
        v-loading="loading"
        :data="userOnlineList"
        border
        style="width: 100%"
    >
      <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
      ></el-table-column>
      <el-table-column
          prop="accessToken"
          label="会话编号"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="username"
          label="用户名"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          prop="realName"
          label="姓名"
          header-align="center"
          align="center"
      ></el-table-column>
      <fast-table-column
          prop="gender"
          label="性别"
          dict-type="user_gender"
      ></fast-table-column>
      <el-table-column
          prop="email"
          label="邮箱"
          header-align="center"
          align="center"
      ></el-table-column>
      <el-table-column
          label="操作"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
      >
        <template #default="scope">
          <el-button
              v-auth="'monitor:user:all'"
              type="primary"
              link
              icon="SwitchButton"
              @click="logoutHandle(scope.row.accessToken)"
          >踢出</el-button
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
  </el-card>
</template>

<script setup lang="ts" name="MonitorUserOnlineIndex">
import { onMounted, ref } from 'vue'
import { UserOnline, UserOnlineQuery } from '@/types/api/monitor/user-online'
import { forceLogout, getUserOnlinePage } from '@/api/monitor/user-online'
import { ElMessage, ElMessageBox } from 'element-plus'

const userOnlineList = ref<UserOnline[]>([])
const loading = ref<boolean>(true)
const total = ref<number>(0)

const queryParams = ref<UserOnlineQuery>({
  pageNo: 1,
  pageSize: 10
})

/** 查询在线用户列表 */
function getDataList() {
  loading.value = true
  getUserOnlinePage(queryParams.value).then(response => {
    userOnlineList.value = response.data?.list || []
    total.value = response.data?.total || 0
    loading.value = false
  })
}

/** 踢出按钮操作 */
function logoutHandle(accessToken?: string) {
  if (!accessToken) {
    ElMessage.warning('会话编号为空')
    return
  }
  ElMessageBox.confirm("确定踢出该用户?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(() => {
        forceLogout(accessToken).then(() => {
          ElMessage.success("操作成功")
          getDataList()
        })
      })
      .catch(() => {})
}

// 页面初始化
onMounted(() => {
  getDataList()
})
</script>
