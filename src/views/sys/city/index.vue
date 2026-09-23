<template>
  <el-card>
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item>
        <el-input
            v-model="queryParams.name"
            placeholder="城市名称"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'system:city:save'" type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="cityList" border style="width: 100%">
      <el-table-column label="序号" type="index" :index="calculateIndex" header-align="center" align="center" width="60"></el-table-column>
      <el-table-column prop="name" label="城市名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="cityCode" label="城市区号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="areaCode" label="行政编码" header-align="center" align="center"></el-table-column>
      <el-table-column prop="parentCode" label="父级编码" header-align="center" align="center"></el-table-column>
      <fast-table-column
          prop="level"
          label="城市等级"
          dict-type="city_level"
          align="center"
          width="100"
      ></fast-table-column>
      <el-table-column prop="zipCode" label="邮政编码" header-align="center" align="center"></el-table-column>
      <el-table-column prop="shortName" label="城市简称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="pinyin" label="城市拼音" header-align="center" align="center"></el-table-column>
      <el-table-column prop="longitude" label="城市经度" header-align="center" align="center"></el-table-column>
      <el-table-column prop="latitude" label="城市纬度" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template #default="scope">
          <el-button
              v-auth="'system:city:update'"
              v-if="scope.row.haveChild"
              type="primary"
              link
              @click="goSubLevel(scope.row.id, scope.row.name)"
          >下级</el-button
          >
          <el-button
              v-auth="'system:city:update'"
              type="primary"
              link
              icon="Edit"
              @click="handleUpdate(scope.row)"
          >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" @success="getDataList" :pid="currentPid"></add-or-update>

    <!-- 下级城市抽屉 -->
    <el-drawer
        v-model="drawerState.visible"
        :title="drawerTitle"
        direction="rtl"
        :size="drawerState.size"
        :before-close="handleDrawerClose">
      <system-city-index
          v-if="drawerState.visible"
          :pid="drawerState.currentPid"
          :level="drawerState.level + 1"
          is-drawer
          @back="handleBack"
      />
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts" name="SystemCityIndex">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AddOrUpdate from './add-or-update.vue'
import { SysCity, SysCityQuery } from '@/types/api/sys/city'
import { useCityListApi } from '@/api/sys/city'

const route = useRoute()

// 新增 props 接收抽屉模式参数
const props = defineProps({
  pid: {
    type: Number,
    default: 0
  },
  isDrawer: {
    type: Boolean,
    default: false
  },
  level: {
    type: Number,
    default: 0
  }
})

const queryRef = ref()

const cityList = ref<SysCity[]>([])
const loading = ref<boolean>(true)
const currentPid = ref<number>(0)

const queryParams = ref<SysCityQuery>({
  name: undefined,
  pid: 0
})

// 新增/修改弹窗引用
const addOrUpdateRef = ref<InstanceType<typeof AddOrUpdate>>()

// 抽屉相关状态
const drawerState = ref({
  visible: false,
  currentPid: 0,
  currentName: '',
  level: props.level,
  size: '70%'
})

// 动态抽屉标题
const drawerTitle = computed(() =>
    drawerState.value.currentName ? `${drawerState.value.currentName}的下级城市` : '下级城市'
)

/** 查询城市列表 */
function getDataList() {
  loading.value = true
  useCityListApi(queryParams.value).then(response => {
    cityList.value = response.data || []
    loading.value = false
  })
}

/** 搜索按钮操作 */
function handleQuery() {
  getDataList()
}

/** 重置按钮操作 */
function resetQuery() {
  queryRef.value.resetFields()
  queryParams.value.pid = currentPid.value
  handleQuery()
}

/** 新增按钮操作 */
function handleAdd() {
  addOrUpdateRef.value?.open(currentPid.value)
}

/** 修改按钮操作 */
function handleUpdate(row: SysCity) {
  addOrUpdateRef.value?.openWithData(row.id!)
}

/** 计算序号 */
function calculateIndex(index: number) {
  return index + 1
}

/** 计算抽屉大小 */
function calculateDrawerSize(level: number) {
  const baseSize = 70
  const minSize = 30
  const calculatedSize = baseSize - level * 10
  return Math.max(calculatedSize, minSize) + '%'
}

/** 查看下级 */
function goSubLevel(id: number, name: string) {
  drawerState.value = {
    ...drawerState.value,
    visible: true,
    currentPid: id,
    currentName: name,
    level: props.level,
    size: calculateDrawerSize(props.level)
  }
}

/** 处理抽屉关闭 */
function handleDrawerClose() {
  drawerState.value = {
    visible: false,
    currentPid: 0,
    currentName: '',
    level: 0,
    size: '70%'
  }
}

/** 处理返回上一级 */
function handleBack() {
  if (drawerState.value.level > 1) {
    drawerState.value = {
      ...drawerState.value,
      level: props.level - 1,
      size: calculateDrawerSize(props.level - 1)
    }
  } else {
    drawerState.value.visible = false
  }
}

// 初始化获取路由参数
onMounted(() => {
  const pid = props.pid || (route.query.pid ? Number(route.query.pid) : 0)
  queryParams.value.pid = pid
  currentPid.value = pid
  getDataList()
})

// 监听 props.pid 变化
watch(() => props.pid, (newPid) => {
  queryParams.value.pid = newPid
  currentPid.value = newPid
  getDataList()
})
</script>
